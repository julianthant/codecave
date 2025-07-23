# SSL Certificate Manual Setup Guide

## Overview

Since your domain (`codecave.tech`) is managed outside of Digital Ocean, you need to manually configure SSL certificates. Digital Ocean's automated Let's Encrypt integration only works for domains managed by Digital Ocean DNS.

## Current Status ✅

**HTTP is fully working:**

- ✅ Domain: `http://api.codecave.tech`
- ✅ Load Balancer: `24.199.71.99`
- ✅ Backend: `209.38.71.166:3001`
- ✅ Health Checks: Passing every 10 seconds

## SSL Setup Options

### Option 1: Certbot on Load Balancer (Recommended)

**Pros:** Free, automated renewal, industry standard
**Cons:** Requires SSH access to load balancer

```bash
# 1. SSH to the droplet that handles SSL termination
ssh root@209.38.71.166

# 2. Install Certbot
apt update
apt install certbot nginx -y

# 3. Create nginx configuration for SSL termination
cat > /etc/nginx/sites-available/api.codecave.tech << 'EOF'
server {
    listen 80;
    server_name api.codecave.tech;

    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name api.codecave.tech;

    ssl_certificate /etc/letsencrypt/live/api.codecave.tech/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.codecave.tech/privkey.pem;

    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;

    # Proxy to API
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# 4. Enable the site
ln -s /etc/nginx/sites-available/api.codecave.tech /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# 5. Create certificate directory
mkdir -p /var/www/certbot

# 6. Test nginx configuration
nginx -t

# 7. Start nginx
systemctl start nginx
systemctl enable nginx

# 8. Get SSL certificate
certbot certonly --webroot -w /var/www/certbot -d api.codecave.tech --email alerts@codecave.tech --agree-tos --non-interactive

# 9. Reload nginx to use SSL
systemctl reload nginx

# 10. Set up automatic renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet && /usr/bin/systemctl reload nginx" | crontab -
```

### Option 2: Cloudflare Proxy (Easiest)

**Pros:** Very easy, free SSL, DDoS protection, CDN
**Cons:** Traffic goes through Cloudflare

1. **Sign up for Cloudflare** (free plan)
2. **Add your domain** (`codecave.tech`)
3. **Update nameservers** to Cloudflare's
4. **Enable "Proxied" mode** for `api.codecave.tech`
5. **Set SSL mode** to "Full (strict)" in Cloudflare

### Option 3: Upload Custom Certificate to Digital Ocean

**Pros:** Uses Digital Ocean's load balancer SSL termination
**Cons:** Requires certificate management

```bash
# 1. Generate certificate using Certbot locally
certbot certonly --manual -d api.codecave.tech --preferred-challenges dns

# 2. Upload to Digital Ocean via Terraform
```

Then update `infra/terraform/load-balancer.tf`:

```hcl
# Custom SSL Certificate
resource "digitalocean_certificate" "api_lb_cert" {
  name             = "codecave-api-lb-cert-production"
  type             = "custom"
  private_key      = file("${path.module}/certs/api.codecave.tech.key")
  leaf_certificate = file("${path.module}/certs/api.codecave.tech.crt")
}

# Update load balancer with HTTPS
resource "digitalocean_loadbalancer" "api_lb" {
  # ... existing configuration ...

  # HTTPS with SSL termination
  forwarding_rule {
    entry_protocol  = "https"
    entry_port      = 443
    target_protocol = "http"
    target_port     = 3001
    certificate_id  = digitalocean_certificate.api_lb_cert.id
  }

  # HTTP redirect to HTTPS
  forwarding_rule {
    entry_protocol  = "http"
    entry_port      = 80
    target_protocol = "https"
    target_port     = 443
  }
}
```

## Recommended Approach

**For production: Option 1 (Certbot on Backend)**

This gives you:

- ✅ Free SSL certificates
- ✅ Automatic renewal every 90 days
- ✅ Full control over SSL configuration
- ✅ Industry-standard setup

## Testing SSL Setup

After implementing SSL:

```bash
# Test HTTPS endpoint
curl -v https://api.codecave.tech/health/live

# Test HTTP redirect
curl -I http://api.codecave.tech/health/live

# Test SSL certificate
openssl s_client -connect api.codecave.tech:443 -servername api.codecave.tech

# Test from different locations
curl -I https://api.codecave.tech/health/live -H "User-Agent: Mozilla/5.0"
```

## SSL Monitoring

Add to your monitoring:

```bash
# Certificate expiry check
echo "0 8 * * * curl -s https://api.codecave.tech 2>&1 | openssl s_client -connect api.codecave.tech:443 2>&1 | openssl x509 -noout -dates" | crontab -

# SSL health check endpoint
curl https://api.codecave.tech/health/live
```

## Security Headers

Add these to nginx for enhanced security:

```nginx
# Security headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

## Next Steps

1. **Choose SSL method** (recommend Option 1)
2. **Implement SSL** following the guide
3. **Test thoroughly** using the testing commands
4. **Update API URLs** in frontend to use `https://api.codecave.tech`
5. **Monitor certificate expiry**

Once SSL is working, your architecture will be:

```
🌐 Internet (HTTPS)
    ↓ SSL Termination
🔒 SSL Certificate (Let's Encrypt)
    ↓
📍 Load Balancer (24.199.71.99)
    ↓ HTTP → Backend
🖥️  Backend Droplet (209.38.71.166:3001)
    ↓
🐳 CodeCave API (Healthy)
```
