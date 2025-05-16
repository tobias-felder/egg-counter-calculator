#!/bin/bash

# Build the application
echo "Building the application..."
npm run build

# Copy necessary files to deploy directory
echo "Copying files to deploy directory..."
cp -r dist/* deploy/public/
cp package.json deploy/
cp package-lock.json deploy/
cp .env deploy/

# Create a deployment archive
echo "Creating deployment archive..."
cd deploy
tar -czf ../deployment.tar.gz .

echo "Deployment package created successfully!"
echo "Upload deployment.tar.gz to your Hostinger server and extract it in your project directory." 