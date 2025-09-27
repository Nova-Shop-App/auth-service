pipeline {
    agent any

    environment {
        KUBECONFIG = "/var/lib/jenkins/.kube/config"
        DOCKER_USERNAME =  credentials('DOCKER-USERNAME') // Replace with your Docker Hub username

    }

    stages {
         stage('Get Version') {
                    steps {
                        script {
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

