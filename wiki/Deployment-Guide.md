# Deployment Guide

Instructions for deploying the NSU Companion application to production environments.

---

## Prerequisites

- **Node.js** v18+ installed on the server
- **MySQL** 8.0+ (recommended for production) or a process manager like **pm2**
- **Git** for pulling updates
- **Nginx** or **Apache** as a reverse proxy (optional)
- **SSL certificate** for HTTPS (Let's Encrypt recommended)

---

## Production Build

### 1. Build the Frontend

```bash
cd client
npm ci --production
npm run build
```

This produces optimized static files in `client/dist/`.

### 2. Configure Environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
JWT_SECRET=<generate-a-strong-random-secret>
NODE_ENV=production
```

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Start with Process Manager

Install pm2 globally:

```bash
npm install -g pm2
```

Create `ecosystem.config.js` in the project root:

```javascript
module.exports = {
  apps: [{
    name: 'nsu-companion',
    script: 'server/src/index.js',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '500M',
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss'
  }]
};
```

Start the application:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## MySQL Database Setup

For production, replace SQLite with MySQL 8.0+:

### 1. Install MySQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### 2. Create Database and User

```sql
CREATE DATABASE nsu_companion CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'nsu_app'@'localhost' IDENTIFIED BY '<strong-password>';
GRANT ALL PRIVILEGES ON nsu_companion.* TO 'nsu_app'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Create Tables

```sql
USE nsu_companion;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'vendor', 'admin') DEFAULT 'customer',
  studentId VARCHAR(50),
  balance DECIMAL(10,2) DEFAULT 0.00,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  imageUrl VARCHAR(500),
  available TINYINT(1) DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  totalAmount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'preparing', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
  paymentMethod VARCHAR(20),
  paymentStatus ENUM('paid', 'unpaid') DEFAULT 'unpaid',
  token VARCHAR(10),
  estimatedMinutes INT DEFAULT 15,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderId INT NOT NULL,
  menuItemId INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (orderId) REFERENCES orders(id),
  FOREIGN KEY (menuItemId) REFERENCES menu_items(id)
);

CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  details TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  read TINYINT(1) DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_userId ON orders(userId);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_audit_logs_createdAt ON audit_logs(createdAt);
```

### 4. Install MySQL Driver

```bash
cd server
npm install mysql2
```

### 5. Update Database Configuration

Replace `config/database.js` to use MySQL instead of SQLite.

---

## Nginx Reverse Proxy

Configure Nginx to forward requests to the Node.js server:

```nginx
server {
    listen 80;
    server_name companion.nsu.edu;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Increase upload size for potential future image uploads
    client_max_body_size 10M;
}
```

Enable SSL with Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d companion.nsu.edu
```

---

## AWS Deployment

### EC2 Setup

1. Launch an **Ubuntu 22.04 LTS** EC2 instance (t3.medium recommended)
2. Configure security group:
   - SSH (22) — your IP
   - HTTP (80) — 0.0.0.0/0
   - HTTPS (443) — 0.0.0.0/0
   - Application (5000) — internal only

3. SSH into the instance:
```bash
ssh -i your-key.pem ubuntu@<ec2-public-ip>
```

4. Install dependencies:
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx git
```

5. Clone and deploy:
```bash
git clone https://github.com/mnxtr/Software-engineering-project.git
cd Software-engineering-project
./deploy.sh
```

### RDS Setup (MySQL)

1. Create an RDS instance (db.t3.micro, MySQL 8.0)
2. Configure security group to allow connections from EC2
3. Update the application's database configuration with RDS endpoint

---

## Docker Deployment

### Dockerfile

Create `Dockerfile` in the project root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy server dependencies
COPY server/package*.json ./server/
RUN cd server && npm ci --production

# Copy client dependencies and build
COPY client/package*.json ./client/
RUN cd client && npm ci
COPY client/ ./client/
RUN cd client && npm run build

# Copy server source
COPY server/ ./server/

EXPOSE 5000

CMD ["node", "server/src/index.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - PORT=5000
    volumes:
      - ./data:/app/data
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: nsu_companion
      MYSQL_USER: nsu_app
      MYSQL_PASSWORD: ${MYSQL_APP_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"
    restart: unless-stopped

volumes:
  mysql_data:
```

---

## Deployment Script

Create `deploy.sh` in the project root:

```bash
#!/bin/bash

echo "=== NSU Companion Deployment ==="
echo ""

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "Node.js is required"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm is required"; exit 1; }

# Install dependencies
echo "[1/4] Installing server dependencies..."
cd server && npm ci --production

echo "[2/4] Installing client dependencies..."
cd ../client && npm ci

# Build frontend
echo "[3/4] Building frontend..."
npm run build

# Start server
echo "[4/4] Starting server..."
cd ../server
NODE_ENV=production node src/index.js &

echo ""
echo "=== Deployment Complete ==="
echo "Application running on http://localhost:5000"
```

Make it executable:

```bash
chmod +x deploy.sh
```

---

## Monitoring

### Application Logs

```bash
# pm2 logs
pm2 logs nsu-companion

# Application logs
tail -f server/logs/out.log
tail -f server/logs/err.log
```

### Health Check

The `/api/health` endpoint returns:

```json
{
  "status": "ok",
  "message": "NSU Companion API is running"
}
```

Set up a cron job to monitor uptime:

```bash
*/5 * * * * curl -f http://localhost:5000/api/health || pm2 restart nsu-companion
```

---

## Rollback Procedure

1. **Switch to previous version:**
```bash
cd ~/Software-engineering-project
git log --oneline -5
git checkout <previous-stable-commit>
```

2. **Rebuild and restart:**
```bash
cd client && npm run build
cd ../server && pm2 restart nsu-companion
```

3. **Verify:**
```bash
curl http://localhost:5000/api/health
```
