pipeline {
    agent any
    tools {
        nodejs 'nodejs-18-19-1'
        dockerTool "docker-latest"
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
                                dependencyCheck additionalArguments: '''
                                --scan ./
                                --out ./
                                --format 'ALL'
                                --prettyPrint
                                ''', odcInstallation: 'OWASP-DepCheck-10'

                                dependencyCheckPublisher failedTotalCritical: 1,
                                                    pattern: 'dependency-check-report.xml',
                                                    stopBuild: true
                                
                                publishHTML(
                                    allowMissing: true,
                                    alwaysLinkToLastBuild: true,
                                    keepAll: true,
                                    reportDir: './',
                                    reportFiles: 'dependency-check-jenkins.html',
                                    reportName: 'Dependency Check HTML Report',
                                    useWrapperFileDirectly: true
                                )
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
                        junit allowEmptyResults: true,keepProperties: true, testResults: 'dependency-check-junit.xml'
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
}

