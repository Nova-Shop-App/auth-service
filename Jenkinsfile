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
                stage('NPM Dependencies Audit') {
                    steps {
                        script {
                            sh 'npm audit --audit-level=critical'
                        }
                    }
                }
                stage('Run Tests') {
                    steps {
                        script {
                            echo "Running Tests"
                            sh 'npm run test --passWithNoTests'
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
}

