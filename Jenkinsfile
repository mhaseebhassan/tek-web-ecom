pipeline {
    agent any

    environment {
        DOCKER_HUB_REPO = "haseebbhinder/tekron"
        COMMITTER_EMAIL = sh(script: "git log -1 --pretty=format:'%ae'", returnStdout: true).trim()
        DATABASE_URL = "postgresql://tekron_user:tekron_password@db:5432/tekron_db"
        NEXTAUTH_SECRET = credentials('NEXTAUTH_SECRET')
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/mhaseebhassan/tekron.git'
            }
        }

        stage('Build Application') {
            steps {
                sh 'docker compose build web'
            }
        }

        stage('Build & Run Tests') {
            environment {
                NODE_ENV = "production"
            }
            steps {
                script {
                    // 1. Start Database and Web in background
                    sh 'docker compose up -d db web'
                    
                    // 2. Wait for Web to be healthy and Push DB Schema
                    sh 'docker compose exec -T web npx prisma db push --accept-data-loss'
                    
                    // 3. Run Tests
                    sh 'docker compose up --build --force-recreate --exit-code-from tests tests'
                }
            }
            post {
                always {
                    script {
                        // More robust way to find the container ID even if it exited
                        def containerId = sh(script: "docker ps -a -q --filter 'label=com.docker.compose.service=tests' | head -n 1", returnStdout: true).trim()
                        if (containerId) {
                            sh "docker cp ${containerId}:/app/report.html selenium-report.html || true"
                            sh "docker cp ${containerId}:/app/screenshots screenshots || true"
                        }
                    }
                    archiveArtifacts artifacts: 'selenium-report.html, screenshots/*.png', allowEmptyArchive: true
                }
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                sh "docker tag tekron-ci-cd_web ${DOCKER_HUB_REPO}:latest"
                // sh "docker push ${DOCKER_HUB_REPO}:latest" // Uncomment if Docker Hub creds are set
                sh 'docker rm -f tekron-prod || true'
                sh "docker run -d -p 3001:3000 --name tekron-prod -e DATABASE_URL=${env.DATABASE_URL} -e NEXTAUTH_SECRET=${env.NEXTAUTH_SECRET} -e NEXTAUTH_URL=http://localhost:3001 ${DOCKER_HUB_REPO}:latest"
            }
        }
    }

    post {
        always {
            emailext (
                subject: "Assignment 3: Test Results for ${currentBuild.fullDisplayName}",
                body: """
                    <h3>Build Status: ${currentBuild.currentResult}</h3>
                    <p>Build URL: <a href='${env.BUILD_URL}'>${env.BUILD_URL}</a></p>
                    <p>Hello, the automated tests for the Tekron application have completed. Check the attached report for details.</p>
                """,
                to: "${COMMITTER_EMAIL}, qasimalik@gmail.com",
                attachmentsPattern: 'selenium-report.html',
                attachLog: true
            )
        }
    }
}