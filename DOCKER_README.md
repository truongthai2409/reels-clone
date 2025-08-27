# Docker Setup for React Upload App

## 🚀 Overview

This project includes a complete Docker setup optimized for ECS deployment with Nginx. The setup includes:

- Multi-stage Docker build for production
- Nginx configuration with security headers and performance optimizations
- Health checks and monitoring
- Docker Compose for local development
- ECS task definition for AWS deployment

## 📁 Files Structure

```
├── .Dockerfile              # Main Dockerfile for production
├── nginx.conf               # Nginx configuration for the app
├── nginx-proxy.conf         # Nginx proxy for local development
├── docker-compose.yml       # Local development setup
├── .dockerignore            # Docker build exclusions
├── ecs-task-definition.json # ECS deployment configuration
└── DOCKER_README.md         # This file
```

## 🏗️ Building the Docker Image

### Build locally
```bash
# Build the production image
docker build -f .Dockerfile -t react-upload-app:latest .

# Build with specific tag
docker build -f .Dockerfile -t react-upload-app:v1.0.0 .
```

### Build for different architectures
```bash
# Build for ARM64 (Apple Silicon)
docker buildx build --platform linux/arm64 -f .Dockerfile -t react-upload-app:arm64 .

# Build for AMD64 (Intel/AMD)
docker buildx build --platform linux/amd64 -f .Dockerfile -t react-upload-app:amd64 .
```

## 🐳 Running Locally

### Option 1: Direct container
```bash
# Run the app directly
docker run -p 8080:8080 react-upload-app:latest

# Access at: http://localhost:8080
```

### Option 2: Docker Compose (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build -d
```

## 🔧 Configuration

### Nginx Configuration (`nginx.conf`)

The Nginx configuration includes:

- **Security Headers**: XSS protection, content type sniffing prevention
- **Performance**: Gzip compression, static file caching
- **Rate Limiting**: API and auth endpoints protection
- **SPA Support**: React Router fallback handling
- **Health Check**: `/health` endpoint for monitoring

### Environment Variables

```bash
NODE_ENV=production          # Application environment
```

## 🚀 Deploying to ECS

### 1. Push to ECR

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Tag image
docker tag react-upload-app:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/react-upload-app:latest

# Push to ECR
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/react-upload-app:latest
```

### 2. Update ECS Task Definition

1. Update `ecs-task-definition.json`:
   - Replace `YOUR_ACCOUNT_ID` with your AWS account ID
   - Replace `YOUR_ECR_REPOSITORY_URL` with your ECR repository URL
   - Adjust CPU/memory as needed

2. Register the task definition:
```bash
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json
```

### 3. Deploy to ECS Service

```bash
# Update ECS service with new task definition
aws ecs update-service \
  --cluster your-cluster-name \
  --service your-service-name \
  --task-definition react-upload-app:latest
```

## 📊 Monitoring & Health Checks

### Health Check Endpoint
- **URL**: `/health`
- **Response**: `healthy`
- **Status**: 200 OK

### Docker Health Check
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1
```

### ECS Health Check
```json
"healthCheck": {
  "command": ["CMD-SHELL", "curl -f http://localhost:8080/health || exit 1"],
  "interval": 30,
  "timeout": 5,
  "retries": 3,
  "startPeriod": 60
}
```

## 🔒 Security Features

- **Non-root user**: Container runs as `nextjs` user (UID 1001)
- **Security headers**: XSS protection, content type sniffing prevention
- **Rate limiting**: API and authentication endpoint protection
- **File access control**: Hidden files and backup files are denied
- **Content Security Policy**: Strict CSP headers

## 📈 Performance Optimizations

- **Gzip compression**: Enabled for text-based files
- **Static file caching**: Long-term caching for assets
- **Sendfile optimization**: Efficient file serving
- **Connection pooling**: Optimized keepalive settings
- **Multi-stage build**: Minimal production image size

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure port 8080 is available
2. **Permission denied**: Check file ownership in container
3. **Health check failures**: Verify curl is installed and working

### Debug Commands

```bash
# Check container logs
docker logs <container_id>

# Execute commands in running container
docker exec -it <container_id> /bin/sh

# Check nginx configuration
docker exec <container_id> nginx -t

# View nginx access logs
docker exec <container_id> tail -f /var/log/nginx/access.log
```

## 📝 Customization

### Modify Nginx Configuration
Edit `nginx.conf` and rebuild the image:
```bash
docker build -f .Dockerfile -t react-upload-app:custom .
```

### Add Environment Variables
Update the Dockerfile or docker-compose.yml:
```dockerfile
ENV CUSTOM_VAR=value
```

### Change Port
Update both Dockerfile and nginx.conf:
```dockerfile
EXPOSE 3000
```

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
- name: Build and push Docker image
  run: |
    docker build -f .Dockerfile -t ${{ secrets.ECR_REGISTRY }}:${{ github.sha }} .
    docker push ${{ secrets.ECR_REGISTRY }}:${{ github.sha }}
```

### AWS CodePipeline
Use the provided ECS task definition with your CI/CD pipeline for automated deployments.

## 📚 Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [ECS Deployment](https://docs.aws.amazon.com/ecs/)
- [ECR Best Practices](https://docs.aws.amazon.com/ecr/latest/userguide/best-practices.html)
