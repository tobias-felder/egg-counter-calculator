# Hostinger Deployment Checklist

## 1. Firebase Setup
- [ ] Create Firebase project (if not already done)
- [ ] Set up Firestore database
- [ ] Configure Firebase security rules
- [ ] Update Firebase config in your application

## 2. Email Setup
- [ ] Create email account in Hostinger (notifications@yourdomain.com)
- [ ] Get SMTP credentials
- [ ] Update email settings in .env

## 3. Node.js Application Setup
- [ ] Log in to Hostinger control panel
- [ ] Go to Node.js section
- [ ] Create new application:
  - Name: fertility-tracker
  - Node.js version: 18.x
  - Application root: /public_html
  - Startup file: server.js
  - Environment: production
  - Port: 3001

## 4. Domain Configuration
- [ ] Point domain to Hostinger nameservers
- [ ] Set up SSL certificate
- [ ] Configure domain in Node.js application

## 5. Deployment
- [ ] Upload deployment.tar.gz
- [ ] Extract files
- [ ] Install dependencies:
  ```bash
  npm install --production
  ```
- [ ] Start application:
  ```bash
  npm start
  ```

## 6. Verification
- [ ] Test Firebase connection
- [ ] Test email sending
- [ ] Verify SSL certificate
- [ ] Check all API endpoints
- [ ] Test calculator functionality

## 7. Monitoring Setup
- [ ] Set up error logging
- [ ] Configure uptime monitoring
- [ ] Set up backup schedule

## Next Steps
After completing this checklist, we can proceed with:
1. Setting up subscription plans
2. Implementing payment processing
3. Creating user management system
4. Building analytics dashboard