pipeline {
    agent any
    tools {
        nodejs 'nodejs-18-19-1'
        dockerTool "docker-latest"
    }
    environment {
        SONAR_SCANNER_HOME = tool 'sonarqube-scanner-720'
    }


    stages {
                stage('Get Version') {
                    steps {
                        script {
                              echo "Getting Version"
                              def version = sh(script: "node -p 'require(\"./package.json\").version'", returnStdout: true).trim()
                              echo "Version: ${version}"
                        }
                    }
                }

                stage('Installing Dependencies') {
                    steps {
                        script {
                            echo "Installing Dependencies"
                            sh 'npm install --no-audit'
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
                            echo "Running Tests"
                            sh 'npm run test --passWithNoTests'
                            
                        }
                        junit(allowEmptyResults: true, testResults: 'junit.xml')

                    }
                }
                stage('Code Coverage') {
                    steps {
                        script {
                           echo "Code Coverage"
                           sh "npm run coverage"
                        }
                    }
                }
                stage('SAST - SonarQube') {
                    steps {
                        script {
                           echo "SonarQube Scan and Analysis"
                           echo "SONAR_SCANNER_HOME: $SONAR_SCANNER_HOME"
                           sh ''' 
                            $SONAR_SCANNER_HOME/bin/sonar-scanner \
                                -Dsonar.projectKey=NovaShop-solar-system \
                                -Dsonar.sources=index.js \
                                -Dsonar.host.url=http://20.51.130.232:9000 \
                                -Dsonar.javascript.lcov.reportPaths=./coverage/lcov.info \
                                -Dsonar.token=sqp_1947608d3dc2023548bad8cbe5a411bf2a8cf3c9
                           '''
                        }
                    }
                }
                stage('Build & Push Auth Service') {
                    steps {
                        script {
                           echo "Building and Pushing Auth Service"
                           sh "docker --version"
                        }
                    }
                }
                stage('Deploy Auth Service') {
                    steps {
                        script {
                            echo "Deploying Auth Service"
                        }
                    }
                }
    }
    post {
        always {
            junit(allowEmptyResults: true,keepProperties: true,testResults: 'dependency-check-junit.xml')
            junit(allowEmptyResults: true,keepProperties: true, testResults: 'junit.xml')
            clover(cloverReportDir: 'coverage',cloverReportFileName: 'clover.xml',healthyTarget: [methodCoverage: 70, conditionalCoverage: 80, statementCoverage: 80],unhealthyTarget: [methodCoverage: 50, conditionalCoverage: 50, statementCoverage: 50],failingTarget: [methodCoverage: 20, conditionalCoverage: 20, statementCoverage: 20])
            publishHTML(allowMissing: true,alwaysLinkToLastBuild: true,keepAll: true,reportDir: './',reportFiles: 'dependency-check-jenkins.html',reportName: 'Dependency Check HTML Report',reportTitles: '',useWrapperFileDirectly: true )
        }
    }
}

