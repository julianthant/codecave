# DigitalOcean Spaces for file storage
resource "digitalocean_spaces_bucket" "codecave_storage" {
  name   = "${var.project_name}-${var.environment}-files"
  region = var.droplet_region
  
  # Enable versioning for file history
  versioning {
    enabled = true
  }
  
  # Lifecycle rules to manage storage costs
  lifecycle_rule {
    id      = "delete_old_versions"
    enabled = true
    
    noncurrent_version_expiration {
      days = 30  # Keep old versions for 30 days
    }
  }
  
  lifecycle_rule {
    id      = "cleanup_multipart_uploads"
    enabled = true
    
    abort_incomplete_multipart_upload_days = 7
  }
  
  # CORS configuration for web uploads
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "POST", "PUT", "DELETE"]
    allowed_origins = [
      "https://codecave.tech",
      "https://www.codecave.tech",
      "https://*.vercel.app",  # For preview deployments
      "http://localhost:3000"  # For local development
    ]
    max_age_seconds = 3000
  }
}

# Spaces access key for API authentication
resource "digitalocean_spaces_bucket_policy" "codecave_storage_policy" {
  region = digitalocean_spaces_bucket.codecave_storage.region
  bucket = digitalocean_spaces_bucket.codecave_storage.name
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowAPIAccess"
        Effect    = "Allow"
        Principal = "*"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::${digitalocean_spaces_bucket.codecave_storage.name}",
          "arn:aws:s3:::${digitalocean_spaces_bucket.codecave_storage.name}/*"
        ]
        Condition = {
          IpAddress = {
            "aws:SourceIp" = [
              digitalocean_droplet.app_server.ipv4_address,
              "216.198.79.1/32"  # Vercel IP range (approximate)
            ]
          }
        }
      },
      {
        Sid       = "AllowPublicRead"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "arn:aws:s3:::${digitalocean_spaces_bucket.codecave_storage.name}/public/*"
      }
    ]
  })
}

# CDN endpoint for faster file delivery (commented out for initial deployment)
# resource "digitalocean_cdn" "codecave_storage_cdn" {
#   origin           = digitalocean_spaces_bucket.codecave_storage.bucket_domain_name
#   custom_domain    = "cdn.codecave.tech"  # Optional: custom domain for CDN
#   certificate_name = "codecave-tech-cert"  # You'll need to create this certificate
#   ttl              = 3600
# }

# Create directories/prefixes in the bucket
resource "digitalocean_spaces_bucket_object" "folders" {
  for_each = toset([
    "uploads/avatars/",
    "uploads/projects/", 
    "uploads/documents/",
    "uploads/images/",
    "public/assets/",
    "public/images/",
    "private/backups/",
    "temp/"
  ])
  
  region      = digitalocean_spaces_bucket.codecave_storage.region
  bucket      = digitalocean_spaces_bucket.codecave_storage.name
  key         = each.value
  content     = ""
  content_type = "application/x-directory"
} 