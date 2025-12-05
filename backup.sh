#!/bin/bash

# Create backups directory if it doesn't exist
mkdir -p backups

# Get current timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="backups/backup_${TIMESTAMP}"

# Create specific backup directory
mkdir -p "$BACKUP_DIR"

# Copy key files
cp manifest.json "$BACKUP_DIR/"
cp content.js "$BACKUP_DIR/"
cp background.js "$BACKUP_DIR/"
cp popup.html "$BACKUP_DIR/"
cp popup.js "$BACKUP_DIR/"
cp popup.css "$BACKUP_DIR/" 2>/dev/null || : # Ignore if css doesn't exist yet

echo "✅ Backup created at $BACKUP_DIR"
