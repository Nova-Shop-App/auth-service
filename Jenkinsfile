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

            junit(allowEmptyResults: true,keepProperties: true,testResults: 'dependency-check-junit.xml')
            junit(allowEmptyResults: true,keepProperties: true, testResults: 'junit.xml')
            junit(allowEmptyResults: true,keepProperties: true, testResults: 'coverage/clover.xml')
            publishHTML(allowMissing: true,alwaysLinkToLastBuild: true,keepAll: true,reportDir: './',reportFiles: 'dependency-check-jenkins.html',reportName: 'Dependency Check HTML Report',reportTitles: '',useWrapperFileDirectly: true )
            publishHTML(allowMissing: true,alwaysLinkToLastBuild: true,keepAll: true,reportDir: 'coverage/lcov-report',reportFiles: 'index.html',reportName: 'Code Coverage HTML Report',reportTitles: '',useWrapperFileDirectly: true)

    }
}

