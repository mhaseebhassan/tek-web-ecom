# Tekron DevOps Assignment: EXTREME Comprehensive Setup Guide

This guide covers everything from pushing your code to GitHub to running a full CI/CD pipeline on AWS EC2.

---

## Phase 1: Local Preparation & GitHub Push

Before you move to EC2, your local changes must be on GitHub so Jenkins can pull them.

### 1.1 Commit and Push Changes
Run these commands in your local terminal (where the project is):
```bash
# Add all new files (selenium-tests, Jenkinsfile, etc.)
git add .

# Commit changes
git commit -m "Add Selenium tests, Docker setup, and Jenkins pipeline"

# Push to your main branch
git push origin main
```
*Note: If you get a permission error, ensure you have your GitHub credentials configured.*

---

## Phase 2: AWS EC2 Instance Configuration

### 2.1 Launch Instance
1.  **Go to AWS Console** > EC2 > Launch Instance.
2.  **Name**: `Tekron-Jenkins-Server`
3.  **OS**: `Ubuntu 22.04 LTS`
4.  **Instance Type**: `t3.medium` (Required: 2 vCPUs, 4GB RAM).
5.  **Key Pair**: Create or use an existing `.pem` key.
6.  **Security Group**: Create a new one with these rules:
    - SSH (22) -> Your IP
    - Custom TCP (8080) -> 0.0.0.0/0 (Jenkins)
    - Custom TCP (3000) -> 0.0.0.0/0 (App Dev)
    - Custom TCP (3001) -> 0.0.0.0/0 (App Prod)

---

## Phase 3: Server Installation (SSH into EC2)

Connect to your server: `ssh -i your-key.pem ubuntu@your-ec2-ip`

### 3.1 Install Docker & Docker Compose
```bash
sudo apt update
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker

# Install Docker Compose V2
sudo apt install docker-compose-v2 -y
```

### 3.2 Install Jenkins
```bash
# Install Java
sudo apt install fontconfig openjdk-17-jre -y

# Add Jenkins Repo
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt update
sudo apt install jenkins -y
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

### 3.3 Critical: Jenkins Permissions
Jenkins must be able to talk to Docker:
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

---

## Phase 4: Database & Application Environment Setup

The application uses **Prisma** with **PostgreSQL**. Inside the Docker container, the database is initialized automatically, but you need to handle secrets.

### 4.1 Jenkins Credentials
In Jenkins UI, go to **Manage Jenkins** > **Credentials** > **System** > **Global credentials**:
1.  **Add Secret Text**:
    - ID: `NEXTAUTH_SECRET`
    - Secret: `your_random_string_here`
2.  **Add Username/Password** (if using private GitHub):
    - ID: `github-creds`
    - Username: `your-github-username`
    - Password: `your-github-token`

---

## Phase 5: Creating the Jenkins Pipeline Job

1.  Open Jenkins (`http://your-ec2-ip:8080`).
2.  Click **New Item** > Enter `Tekron-Ecommerce` > Select **Pipeline** > OK.
3.  **Build Triggers**: Check "GitHub hook trigger for GITScm polling".
4.  **Pipeline Section**:
    - Definition: `Pipeline script from SCM`
    - SCM: `Git`
    - Repository URL: `https://github.com/mhaseebhassan/tekron.git`
    - Branch: `*/main`
    - Script Path: `Jenkinsfile`
5.  **Save**.

---

## Phase 6: GitHub Webhook (Automatic Trigger)

1.  GitHub Repo > **Settings** > **Webhooks** > **Add Webhook**.
2.  Payload URL: `http://your-ec2-ip:8080/github-webhook/`
3.  Content type: `application/json`
4.  Click **Add Webhook**.

---

## Phase 7: Troubleshooting the Database

If the app fails to start because of DB errors:
1.  **Check if DB is up**: `docker ps` (should see a postgres container).
2.  **Prisma Migrations**: Our `Dockerfile` runs `npx prisma generate`. The first time the app runs, the database schema will be created by the application if configured, or you can manually run migrations inside the container:
    ```bash
    docker exec -it <app_container_id> npx prisma db push
    ```

---

## Phase 8: Email Setup (SMTP)

1.  **Manage Jenkins** > **System**.
2.  **Extended E-mail Notification**:
    - SMTP Server: `smtp.gmail.com`
    - Port: `465`
    - Credentials: Add a new credential with your Gmail and **App Password**.
    - SSL: Checked.
3.  **Test configuration** by clicking "Test configuration by sending Test e-mail".

---

## Phase 9: How to Run Locally

1.  **Install dependencies**: `npm install`
2.  **Run with Docker**: `docker-compose up --build`
3.  **Run Tests Only**:
    ```bash
    cd selenium-tests
    pip install -r requirements.txt
    pytest --html=report.html
    ```

---

## Phase 10: Final Checklist for Assignment
- [ ] Code is pushed to GitHub.
- [ ] EC2 is running Ubuntu with Docker & Jenkins.
- [ ] Jenkins user is in the `docker` group.
- [ ] Jenkins Job is configured to the GitHub Repo.
- [ ] Webhook is active (Green check in GitHub).
- [ ] `report.html` is visible in Jenkins build artifacts.
- [ ] Email is received with test results.
