pipeline {
    agent any
    tools {
        nodejs 'nodejs-18-19-1'
    }
    environment {
        DB_HOST="ep-green-term-ab235syb-pooler.eu-west-2.aws.neon.tech"
        DB_USER=credentials('postgres-db-username')
        DB_PASSWORD=credentials('postgres-db-password')
        DB_NAME="neondb"
        DB_DIALECT="postgres"
        DB_SSL_MODE="true"

        JWT_SECRET="your_jwt_secret_key"
        JWT_EXPIRY="1h"

        SONAR_SCANNER_HOME = tool 'sonarqube-scanner-720'
    }


    stages {
                stage('Get Version') {
                    steps {
                        script {
                              echo "Getting Version"
                              env.VERSION = sh(script: "node -p 'require(\"./package.json\").version'", returnStdout: true).trim()
                              echo "Version: ${env.VERSION}"
                        }
                    }
                }

                stage('Installing Dependencies') {
                    steps {
                        script {
                            echo "Installing Dependencies"
                            sh 'npm ci --no-audit'
                        }
                    }
                }
                stage('Dependency Scanning') {
                    parallel {
                        stage('NPM Dependency Audit') {
                            steps {
                                sh '''
                                npm audit --audit-level=critical 
                                echo $?
                                '''
                            }
                        }
                        stage('OWASP Dependency Check') {
                            steps {
                                withCredentials([string(credentialsId: 'NVD_API_KEY', variable: 'NVD_API_KEY')]) {
                                    dependencyCheck additionalArguments: """
                                        --scan './' 
                                        --out './' 
                                        --format ALL
                                        --nvdApiKey ${NVD_API_KEY}
                                        --disableYarnAudit
                                        --disableAssembly
                                        --prettyPrint
                                    """, odcInstallation: 'OWASP-DepCheck-10'
                            }
                                dependencyCheckPublisher failedTotalCritical: 1,
                                                    pattern: 'dependency-check-report.xml',
                                                    stopBuild: true
                                
                                

                            }
                        }
                    }
                }

                stage('Run Tests') {
                    steps {
                        script {
                            sh 'npm run test'
                            
                        }
                        junit(allowEmptyResults: true, testResults: 'junit.xml')

                    }
                }
                stage('Code Coverage') {
                    steps {
                        script {
                           sh "npm run coverage"
                        }
                    }
                }
                stage('SAST - SonarQube') {
                   steps {
                        withSonarQubeEnv('sonar-qube-server') {
                            sh '''
                                $SONAR_SCANNER_HOME/bin/sonar-scanner
                            '''
                        }
                    }
                }
                stage('Build  Auth Service') {
                    steps {
                        script {
                           sh "docker build -t abdelkader97/auth-service:${env.VERSION} ."
                        }
                    }
                }
                stage('Trivy Vulnerability Scanner') {
                    steps {
                        script {
                            sh """
                                trivy image \
                                    abdelkader97/auth-service:${env.VERSION} \
                                    --severity LOW,MEDIUM,HIGH \
                                    --exit-code 0 \
                                    --quiet \
                                    --format json -o trivy-image-medium-results.json 
                                trivy image \
                                    abdelkader97/auth-service:${env.VERSION} \
                                    --severity CRITICAL \
                                    --exit-code 1 \
                                    --quiet \
                                    --format json -o trivy-image-critical-results.json 
                            """
                        }
                    }
                }
                stage('Push Docker Image') {
                    steps {
                        script {
                            withDockerRegistry(credentialsId: 'docker-hub-credentials', url: '') {
                                sh "docker push abdelkader97/auth-service:${env.VERSION}"
                            }
                        }
                    }
                }

                stage('K8S Update Image Tag') {
                    steps {
                        script {
                            // Clean up existing directory if it exists
                            if (fileExists('kubernetes-manifest')) {
                                sh 'rm -rf kubernetes-manifest'
                            }
                        }
                        
                        // Clone the repository with credentials
                        withCredentials([usernamePassword(
                            credentialsId: 'github-credentials',
                            usernameVariable: 'GIT_USERNAME',
                            passwordVariable: 'GIT_PASSWORD'
                        )]) {
                            sh "git clone -b main https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/Nova-Shop-App/kubernetes-manifest.git"
                        }

                        // Update deployment file and push changes
                        dir('kubernetes-manifest') {
                            withCredentials([usernamePassword(
                                credentialsId: 'github-credentials',
                                usernameVariable: 'GIT_USERNAME',
                                passwordVariable: 'GIT_PASSWORD'
                            )]) {
                                sh """
                                    git config user.email "jenkins@example.com"
                                    git config user.name "Jenkins CI"
                                    
                                    sed -i 's|image:.*abdelkader97/auth-service.*|image: abdelkader97/auth-service:${env.VERSION}|g' deployment.yaml
                                    
                                    git add deployment.yaml
                                    git commit -m "Update Docker image to version ${env.VERSION}" || echo "No changes to commit"
                                    git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/Nova-Shop-App/kubernetes-manifest.git main
                                """
                            }
                        }
                    }
                }
            
            

                
    }
    post {
        always {
            // Convert JSON to HTML and JUnit XML
            sh '''
                trivy convert --format template \
                --template "@/usr/local/share/trivy/templates/html.tpl" \
                --output trivy-image-medium.html trivy-image-medium-results.json


                trivy convert --format template \
                --template "@/usr/local/share/trivy/templates/html.tpl" \
                --output trivy-image-critical.html trivy-image-critical-results.json
            '''


            junit(allowEmptyResults: true,keepProperties: true,testResults: 'dependency-check-junit.xml')
            junit(allowEmptyResults: true,keepProperties: true, testResults: 'junit.xml')
            
            clover(cloverReportDir: 'coverage',cloverReportFileName: 'clover.xml',healthyTarget: [methodCoverage: 70, conditionalCoverage: 80, statementCoverage: 80],unhealthyTarget: [methodCoverage: 50, conditionalCoverage: 50, statementCoverage: 50],failingTarget: [methodCoverage: 20, conditionalCoverage: 20, statementCoverage: 20])
            publishHTML(allowMissing: true,alwaysLinkToLastBuild: true,keepAll: true,reportDir: './',reportFiles: 'dependency-check-jenkins.html',reportName: 'Dependency Check HTML Report',reportTitles: '',useWrapperFileDirectly: true )
            
            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true,reportDir: '.', reportFiles: 'trivy-image-critical.html',reportName: 'Critical Vulnerabilities', useWrapperFileDirectly: true])
            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true,reportDir: '.', reportFiles: 'trivy-image-medium.html',reportName: 'Medium/Low Vulnerabilities', useWrapperFileDirectly: true])

        }
    }
}
