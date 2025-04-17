#!/bin/bash

# Run the normal build process
npm run build

# Make sure we have the index.html at the root of dist
echo "Copying files from dist/public to dist for deployment..."
cp -r dist/public/* dist/

echo "Build completed successfully. Files are ready for deployment in the dist directory."