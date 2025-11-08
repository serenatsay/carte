#!/bin/bash

# Netlify build script for Carte web app
# This script ensures mobile app directories are removed BEFORE TypeScript checks run

echo "🗑️  Removing mobile app directories..."
rm -rf carte-mobile carte-mobile-fresh

echo "📦 Building Next.js app..."
npm run build

echo "✅ Build complete!"
