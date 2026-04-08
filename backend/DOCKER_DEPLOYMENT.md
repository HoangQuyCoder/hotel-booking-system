# 🐳 Docker Deployment Guide - Hotel Booking Backend

## 📋 Yêu cầu

- Docker >= 20.10
- Docker Compose >= 1.29
- 2GB RAM tối thiểu

## 🚀 Deployment Local

### 1. Chuẩn bị Environment

Trước tiên, cập nhật mật khẩu database trong `docker-compose.yml`:

```bash
# Mở file docker-compose.yml và thay thế:
# your_secure_password_here -> mật khẩu mạnh của bạn
```

### 2. Build và Run

```bash
# Build image
docker-compose build

# Start containers
docker-compose up -d

# Xem logs
docker-compose logs -f backend
```

### 3. Kiểm tra Health

```bash
# Kiểm tra status containers
docker-compose ps

# Test API endpoint
curl http://localhost:8080/actuator/health
```

### 4. Stop Services

```bash
docker-compose down

# Xóa volumes (database)
docker-compose down -v
```

## 🐚 Docker CLI Commands

### Build Image

```bash
# Build multi-architecture image
docker build -t hotel-backend:latest \
  --platform linux/amd64 \
  --platform linux/arm64 .

# Build with tag
docker build -t hotel-backend:v1.0.0 .
```

### Run Container

```bash
# Run standalone (khi đã có database):
docker run -d \
  --name hotel-backend \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres-host:5432/hotel_booking \
  -e SPRING_DATASOURCE_USERNAME=hoangquy \
  -e SPRING_DATASOURCE_PASSWORD=your_password \
  hotel-backend:latest
```

### Push to Registry

```bash
# Login to Docker Hub
docker login

# Tag image
docker tag hotel-backend:latest your-username/hotel-backend:latest
docker tag hotel-backend:latest your-username/hotel-backend:v1.0.0

# Push
docker push your-username/hotel-backend:latest
docker push your-username/hotel-backend:v1.0.0
```

## ☁️ Deployment lên VPS/Server

### Tùy chọn 1: Docker Compose (Recommended)

```bash
# SSH vào server
ssh user@your-server-ip

# Clone repo hoặc upload files
git clone https://github.com/your-repo.git
cd hotel-booking-system/backend

# Chạy
docker-compose up -d
```

### Tùy chọn 2: Pull từ Docker Registry

```bash
# SSH vào server
ssh user@your-server-ip

# Create docker-compose.yml cho production
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  backend:
    image: your-username/hotel-backend:latest
    container_name: hotel_backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres-host:5432/hotel_booking
      SPRING_DATASOURCE_USERNAME: hoangquy
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
    restart: unless-stopped
EOF

# Run
docker-compose up -d
```

## 🔒 Security Best Practices

### 1. Environment Variables

Không lưu credentials trong code:

```bash
# Create .env file (não commit)
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret
MAIL_PASSWORD=your_app_specific_password
```

```bash
# docker-compose.yml
version: '3.8'
services:
  backend:
    environment:
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
```

### 2. Network Isolation

Database không expose ra ngoài:

```bash
# Chỉ backend có thể kết nối database
# Database port 5432 không public
docker-compose ps  # Kiểm tra ports
```

### 3. Image Security

```bash
# Scan image cho vulnerabilities
docker scout cves hotel-backend:latest

# Hoặc dùng Trivy
trivy image hotel-backend:latest
```

## 📊 Monitoring & Logs

```bash
# Live logs
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend

# Specific service
docker logs -f hotel_backend

# View system info
docker ps
docker inspect hotel_backend
docker stats
```

## 🔧 Troubleshooting

### Database Connection Error

```bash
# Kiểm tra network
docker network ls
docker network inspect hotel_network

# Test database connection
docker-compose exec postgres psql -U hoangquy -d hotel_booking -c "SELECT 1"
```

### Port Already in Use

```bash
# Tìm process sử dụng port
lsof -i :8080
lsof -i :5432

# Change ports trong docker-compose.yml
ports:
  - "8081:8080"  # 8081 -> container port 8080
```

### Rebuild từ scratch

```bash
docker-compose down -v
docker system prune -f
docker-compose up -d --build
```

## 📈 Performance Tips

1. **Resource Limits**

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: "2"
          memory: 2G
        reservations:
          cpus: "1"
          memory: 1G
```

2. **Connection Pooling** (trong application.properties)

```properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
```

3. **Multi-stage Build** (already in Dockerfile)

- Reduces image size từ 500MB+ → ~150MB

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: Build & Push Docker Image

on:
  push:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: your-username/hotel-backend:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

## ✅ Checklist trước khi Deploy Production

- [ ] Cập nhật database password
- [ ] Cập nhật JWT_SECRET (sinh random)
- [ ] Cập nhật mail credentials
- [ ] Kiểm tra CORS settings
- [ ] Enable HTTPS/SSL
- [ ] Setup monitoring & logging
- [ ] Backup database strategy
- [ ] Health check endpoint hoạt động
- [ ] Resource limits được set
- [ ] Auto-restart policy: `unless-stopped`

---

Có câu hỏi? Liên hệ team DevOps!
