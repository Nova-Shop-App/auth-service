pipeline {
    agent any
    tools {
        nodejs 'nodejs-18-19-1'
        dockerTool "docker-latest"
    }
    environment {

        JWT_SECRET="your_jwt_secret_key"
        JWT_EXPIRY="1h"
        // Define SonarQube scanner tool
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
                                        --disableYarnAudit
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
                stage('Build & Push Auth Service') {
                    steps {
                        script {
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

