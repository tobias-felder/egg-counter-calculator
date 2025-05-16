# Deployment Guide

## Prerequisites
- Node.js and npm installed on your local machine
- Hostinger hosting account with Node.js support
- Firebase project set up
- Access to your domain's DNS settings

## Deployment Steps

### 1. Local Preparation
1. Make sure all your changes are committed to your repository
2. Run the deployment script:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```
3. This will create a `deployment.tar.gz` file in your project root

### 2. Hostinger Setup
1. Log in to your Hostinger control panel
2. Navigate to the Node.js section
3. Create a new Node.js application:
   - Set the Node.js version to 18.x
   - Set the application root to your domain
   - Set the application startup file to `server.js`
   - Set the application URL to your domain

### 3. Firebase Setup
1. Ensure your Firebase project is properly configured
2. Update Firebase configuration in your application
3. Verify Firebase security rules are set correctly
4. Test Firebase connection from your local environment

### 4. Upload and Deploy
1. Upload the `deployment.tar.gz` file to your Hostinger server
2. Extract the archive in your project directory
3. Install dependencies:
   ```bash
   npm install --production
   ```
4. Start the application:
   ```bash
   npm start
   ```

### 5. Domain Configuration
1. In your Hostinger control panel, set up your domain to point to your Node.js application
2. Configure SSL certificate for secure HTTPS connection
3. Set up any necessary redirects

### 6. Post-Deployment Checks
1. Verify that your application is running:
   ```bash
   curl https://yourdomain.com
   ```
2. Check the application logs for any errors
3. Test all major functionality:
   - Calculator
   - Email notifications
   - Analytics
   - Export functionality

## Troubleshooting

### Common Issues
1. **Application not starting**
   - Check the Node.js version
   - Verify the startup file path
   - Check application logs

2. **Firebase connection issues**
   - Verify Firebase configuration
   - Check security rules
   - Ensure API keys are correct

3. **Email sending problems**
   - Verify SMTP settings
   - Check email service limits
   - Review email logs

### Support
If you encounter any issues during deployment, please contact support with:
- Your domain name
- Error messages from logs
- Steps to reproduce the issue