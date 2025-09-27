pipeline {
    agent any
    tools {
        nodejs 'nodejs-18-19-1'
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
                stage('Build & Push Auth Service') {
                    steps {
                        script {
                           echo "Building and Pushing Auth Service"
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

