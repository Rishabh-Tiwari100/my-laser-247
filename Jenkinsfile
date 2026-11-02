pipeline {
    agent any

    environment {
        SSH_HOST = "103.189.173.30"
        PROD_WORK_DIR = "/var/www/html/notout-user"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Deploy to Staging Server') {
            steps {
                sshagent(['jenkins-notout-server']) {
                    sh """
ssh -o StrictHostKeyChecking=no ubuntu@${SSH_HOST} << 'EOF'

echo "----- Switching to project directory -----"
cd ${PROD_WORK_DIR}

echo "----- Loading NVM -----"
export NVM_DIR="\\$HOME/.nvm"
[ -s "\\$NVM_DIR/nvm.sh" ] && . "\\$NVM_DIR/nvm.sh"

echo "----- Checking out branch: staging -----"
git checkout staging

echo "----- Pulling latest code -----"
git pull origin staging

echo "----- Installing dependencies -----"
npm install --force

echo "----- Building project -----"
npm run build

echo "----- Deployment complete! -----"

EOF
"""
                }
            }
        }
    }

    post {
        failure {
            echo "Deployment FAILED ❌"
        }
        success {
            echo "Deployment SUCCESSFUL ✅"
        }
    }
}
