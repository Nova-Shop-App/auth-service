pipeline {
    agent any


    stages {
         stage('Get Version') {
                    steps {
                        script {
                            //   def version = sh(script: "node -p 'require(\"./package.json\").version'", returnStdout: true).trim()
                              echo "Getting Version"
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

