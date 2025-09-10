#!/bin/bash
set -e

echo "Starting build process..."

echo "Running Vite build..."
npx vite build

echo "Running ESBuild..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build completed successfully!"
