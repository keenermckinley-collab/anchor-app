# Deploy On AWS (App Runner or ECS)

## Option A: App Runner (Fastest)
1. Build and push Docker image from `anchor-app/Dockerfile` to ECR.
2. Create App Runner service from ECR image.
3. Set environment variables from `.env.example`.
4. Attach IAM role with S3 access for upload APIs.
5. Put app behind custom domain + ACM certificate.

## Option B: ECS Fargate
1. Build image and push to ECR.
2. Deploy ECS service with ALB and HTTPS.
3. Set autoscaling and health checks (`/api/health`).
4. Configure secrets via AWS Secrets Manager.
5. Set WAF and CloudWatch alarms.

## Required AWS Services
- RDS PostgreSQL (or Aurora Postgres)
- S3 for evidence files
- SES (or external provider) for email/webhook pipeline
- KMS for encryption keys
