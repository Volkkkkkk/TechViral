# 🔒 Security Headers Configuration - TechViral
## Version "Acier" - Configuration CSP stricte + Headers sécurité

---

## 📋 RÉSUMÉ CONFIGURATION

### 🎯 **Headers Sécurité Requis**
- **Content Security Policy (CSP)**: Strict avec nonces
- **HTTP Strict Transport Security (HSTS)**: HTTPS forcé
- **X-Content-Type-Options**: Protection MIME sniffing
- **X-Frame-Options**: Protection clickjacking
- **Referrer-Policy**: Contrôle données référent
- **Permissions-Policy**: Restriction APIs sensibles

---

## 🌐 NGINX CONFIGURATION

### 📁 **Fichier**: `/etc/nginx/sites-available/techviral`

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name techviral.hostingersite.com;
    
    # SSL Configuration
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Document Root
    root /var/www/techviral;
    index index.html;
    
    # SECURITY HEADERS
    
    # HSTS - Force HTTPS (2 ans + subdomains)
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    
    # CSP - Content Security Policy stricte
    set $csp_base "default-src 'self'";
    set $csp_script "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net";
    set $csp_style "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com";
    set $csp_font "font-src 'self' https://fonts.gstatic.com";
    set $csp_img "img-src 'self' data: https: blob:";
    set $csp_connect "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net";
    set $csp_frame "frame-src 'none'";
    set $csp_object "object-src 'none'";
    set $csp_media "media-src 'self'";
    set $csp_manifest "manifest-src 'self'";
    set $csp_worker "worker-src 'self'";
    
    add_header Content-Security-Policy "$csp_base; $csp_script; $csp_style; $csp_font; $csp_img; $csp_connect; $csp_frame; $csp_object; $csp_media; $csp_manifest; $csp_worker; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;" always;
    
    # Protection MIME sniffing
    add_header X-Content-Type-Options "nosniff" always;
    
    # Protection clickjacking
    add_header X-Frame-Options "DENY" always;
    
    # Protection XSS (Edge/IE legacy)
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Contrôle référent
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Permissions APIs
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(self), payment=(), usb=(), interest-cohort=()";
    
    # Cache Control sécurisé
    add_header Cache-Control "public, max-age=31536000, immutable" always;
    
    # Information serveur masquée
    server_tokens off;
    more_clear_headers Server;
    more_set_headers "Server: TechViral/1.0";
    
    # LOCATIONS
    
    location / {
        try_files $uri $uri/ =404;
        
        # Cache HTML court
        location ~* \.(html)$ {
            add_header Cache-Control "public, max-age=3600";
            expires 1h;
        }
    }
    
    # Assets statiques - Cache long
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|avif|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Vary "Accept-Encoding";
        
        # Compression
        gzip on;
        gzip_vary on;
        gzip_types text/css application/javascript image/svg+xml;
    }
    
    # Favicon
    location = /favicon.ico {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000";
        log_not_found off;
        access_log off;
    }
    
    # Robots & Sitemap
    location = /robots.txt {
        add_header Content-Type text/plain;
        expires 1d;
    }
    
    location = /sitemap.xml {
        add_header Content-Type application/xml;
        expires 1d;
    }
    
    # Manifest PWA
    location = /manifest.json {
        add_header Content-Type application/manifest+json;
        expires 1d;
    }
    
    # Security - Bloquer accès fichiers sensibles
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    location ~* \.(env|log|config)$ {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    location ~ /scripts/ {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Health check
    location = /health {
        add_header Content-Type application/json;
        return 200 '{"status":"ok","timestamp":"$time_iso8601"}';
        access_log off;
    }
}

# Redirection HTTP vers HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name techviral.hostingersite.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 🌐 APACHE CONFIGURATION

### 📁 **Fichier**: `.htaccess` ou VirtualHost

```apache
# SSL/HTTPS Configuration
<IfModule mod_ssl.c>
    <VirtualHost *:443>
        ServerName techviral.hostingersite.com
        DocumentRoot /var/www/techviral
        
        # SSL Configuration
        SSLEngine on
        SSLCertificateFile /path/to/ssl/cert.pem
        SSLCertificateKeyFile /path/to/ssl/private.key
        SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1
        SSLCipherSuite ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384
        
        # SECURITY HEADERS
        
        # HSTS - Force HTTPS
        Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
        
        # CSP - Content Security Policy
        Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://www.google-analytics.com https://analytics.google.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;"
        
        # Protection MIME sniffing
        Header always set X-Content-Type-Options "nosniff"
        
        # Protection clickjacking
        Header always set X-Frame-Options "DENY"
        
        # Protection XSS
        Header always set X-XSS-Protection "1; mode=block"
        
        # Contrôle référent
        Header always set Referrer-Policy "strict-origin-when-cross-origin"
        
        # Permissions APIs
        Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(self), payment=(), usb=()"
        
        # Masquer version serveur
        ServerTokens Prod
        Header unset Server
        Header always set Server "TechViral/1.0"
        
        # CACHE & COMPRESSION
        
        <IfModule mod_expires.c>
            ExpiresActive On
            
            # HTML - Cache court
            ExpiresByType text/html "access plus 1 hour"
            
            # Assets - Cache long
            ExpiresByType text/css "access plus 1 year"
            ExpiresByType application/javascript "access plus 1 year"
            ExpiresByType image/png "access plus 1 year"
            ExpiresByType image/jpg "access plus 1 year"
            ExpiresByType image/jpeg "access plus 1 year"
            ExpiresByType image/gif "access plus 1 year"
            ExpiresByType image/webp "access plus 1 year"
            ExpiresByType image/avif "access plus 1 year"
            ExpiresByType image/svg+xml "access plus 1 year"
            ExpiresByType font/woff "access plus 1 year"
            ExpiresByType font/woff2 "access plus 1 year"
            
            # Manifests
            ExpiresByType application/manifest+json "access plus 1 day"
            ExpiresByType text/xml "access plus 1 day"
        </IfModule>
        
        <IfModule mod_deflate.c>
            SetOutputFilter DEFLATE
            SetEnvIfNoCase Request_URI \.(?:gif|jpe?g|png)$ no-gzip dont-vary
            SetEnvIfNoCase Request_URI \.(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
        </IfModule>
        
        # SECURITY RESTRICTIONS
        
        # Bloquer accès fichiers sensibles
        <FilesMatch "^\.">
            Require all denied
        </FilesMatch>
        
        <FilesMatch "\.(env|log|config)$">
            Require all denied
        </FilesMatch>
        
        <Directory "/var/www/techviral/scripts">
            Require all denied
        </Directory>
        
        # Health check
        RewriteEngine On
        RewriteRule ^health$ - [R=200,L]
        
    </VirtualHost>
</IfModule>

# Redirection HTTP vers HTTPS
<VirtualHost *:80>
    ServerName techviral.hostingersite.com
    Redirect permanent / https://techviral.hostingersite.com/
</VirtualHost>
```

---

## ☁️ CLOUDFLARE CONFIGURATION

### 🛡️ **Cloudflare Workers** (si utilisé)

```javascript
// Cloudflare Worker pour headers sécurité
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const response = await fetch(request)
    const newResponse = new Response(response.body, response)
    
    // Security Headers
    newResponse.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
    newResponse.headers.set('X-Content-Type-Options', 'nosniff')
    newResponse.headers.set('X-Frame-Options', 'DENY')
    newResponse.headers.set('X-XSS-Protection', '1; mode=block')
    newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    newResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)')
    
    // CSP dynamique basé sur le type de contenu
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('text/html')) {
        newResponse.headers.set('Content-Security-Policy', 
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; " +
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
            "font-src 'self' https://fonts.gstatic.com; " +
            "img-src 'self' data: https: blob:; " +
            "connect-src 'self' https://www.google-analytics.com; " +
            "frame-src 'none'; object-src 'none'; " +
            "base-uri 'self'; form-action 'self'; frame-ancestors 'none';"
        )
    }
    
    return newResponse
}
```

### ⚙️ **Cloudflare Dashboard Settings**

```
SSL/TLS:
✅ Full (strict)
✅ Always Use HTTPS: On
✅ Minimum TLS Version: 1.2
✅ TLS 1.3: On
✅ HSTS: Enabled (6 months, subdomains, preload)

Security:
✅ Security Level: Medium
✅ Bot Fight Mode: On
✅ Challenge Passage: 30 minutes
✅ Browser Integrity Check: On

Speed:
✅ Auto Minify: CSS, JS, HTML
✅ Brotli: On
✅ Rocket Loader: Off (conflit avec CSP strict)
✅ Mirage: On
✅ Polish: Lossless

Page Rules:
1. techviral.hostingersite.com/assets/*
   - Cache Level: Cache Everything
   - Edge Cache TTL: 1 year
   
2. techviral.hostingersite.com/*.html
   - Cache Level: Standard
   - Edge Cache TTL: 1 hour
```

---

## 🧪 VALIDATION HEADERS

### 🔍 **Tests Manuels**

```bash
# Test headers sécurité
curl -I https://techviral.hostingersite.com/

# Vérifications attendues:
# Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
# Content-Security-Policy: default-src 'self'; ...
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# Referrer-Policy: strict-origin-when-cross-origin

# Test CSP spécifique
curl -H "Accept: text/html" https://techviral.hostingersite.com/ -v

# Test redirection HTTPS
curl -I http://techviral.hostingersite.com/
# Doit retourner: 301 redirect vers HTTPS
```

### 🔧 **Outils de Validation**

```
1. SecurityHeaders.com
   URL: https://securityheaders.com/?q=techviral.hostingersite.com
   Objectif: Grade A+

2. SSL Labs
   URL: https://www.ssllabs.com/ssltest/
   Objectif: Grade A

3. CSP Evaluator
   URL: https://csp-evaluator.withgoogle.com/
   CSP: Copier header CSP pour analyse

4. Observatory Mozilla
   URL: https://observatory.mozilla.org/
   Objectif: Score 90+
```

### 📊 **Script Validation Automatique**

```javascript
// Script test headers (à exécuter en console)
async function testSecurityHeaders() {
    const response = await fetch(window.location.href);
    const headers = {
        'strict-transport-security': response.headers.get('strict-transport-security'),
        'content-security-policy': response.headers.get('content-security-policy'),
        'x-content-type-options': response.headers.get('x-content-type-options'),
        'x-frame-options': response.headers.get('x-frame-options'),
        'referrer-policy': response.headers.get('referrer-policy')
    };
    
    console.table(headers);
    
    // Vérifications
    const checks = {
        'HSTS Present': !!headers['strict-transport-security'],
        'CSP Present': !!headers['content-security-policy'],
        'NoSniff Present': headers['x-content-type-options'] === 'nosniff',
        'Frame Deny': headers['x-frame-options'] === 'DENY',
        'Referrer Policy': !!headers['referrer-policy']
    };
    
    console.table(checks);
    
    const passed = Object.values(checks).filter(Boolean).length;
    console.log(`Headers sécurité: ${passed}/5 (${passed === 5 ? '✅ OK' : '❌ À corriger'})`);
}

testSecurityHeaders();
```

---

## ⚠️ NOTES IMPORTANTES

### 🎯 **CSP Considerations**

```
'unsafe-inline' autorisé temporairement pour:
- Styles Tailwind inline
- Scripts RGPD/GTM conditionnels

TODO pour CSP strict:
1. Implémenter nonces pour scripts
2. Externaliser tous styles inline
3. Utiliser hashes pour scripts statiques
```

### 🔐 **HSTS Preload**

```bash
# Soumission HSTS Preload (après validation complète)
# URL: https://hstspreload.org/
# Prérequis:
# - HTTPS fonctionnel 100%
# - Header HSTS avec preload
# - Tous subdomains HTTPS
```

### 📋 **Checklist Déploiement**

```
AVANT mise en production:
[ ] Test headers avec curl -I
[ ] Validation SecurityHeaders.com (Grade A+)
[ ] Test CSP sans erreurs console
[ ] Validation SSL Labs (Grade A)
[ ] Test redirection HTTP->HTTPS
[ ] Vérification blocage fichiers sensibles
[ ] Test health check /health
[ ] Monitoring erreurs 24h
```

---

## 🚀 **DÉPLOIEMENT PAR ENVIRONNEMENT**

### 🏢 **Hostinger (Production)**

```apache
# Configuration via .htaccess (si Apache)
# Ou via cPanel > Security > Headers

# Activer dans l'ordre:
1. SSL/TLS certificat
2. Redirection HTTPS forcée
3. Headers sécurité (.htaccess)
4. Test validation complète
```

### 🌐 **Autres Hébergeurs**

```
- OVH: Via .htaccess ou manager
- 1&1/IONOS: Panel control > SSL
- SiteGround: cPanel > Security
- Cloudflare: Via dashboard settings
```

---

**🎯 OBJECTIF**: Grade A+ SecurityHeaders + Grade A SSL Labs  
**📊 MONITORING**: Alertes dégradation scores sécurité  
**🔄 MAINTENANCE**: Review trimestrielle configuration