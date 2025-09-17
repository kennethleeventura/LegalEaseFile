#!/bin/bash

# LegalEaseFile Database Backup Script
# This script creates automated backups of the database and application data

set -euo pipefail

# Configuration
BACKUP_DIR="/backup"
POSTGRES_HOST="${POSTGRES_HOST:-postgres}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_DB="${POSTGRES_DB:-legaleasefile}"
POSTGRES_USER="${POSTGRES_USER:-legalease}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR/database"
mkdir -p "$BACKUP_DIR/logs"

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/database/legaleasefile_backup_$TIMESTAMP.sql"
BACKUP_LOG="$BACKUP_DIR/logs/backup_$TIMESTAMP.log"

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$BACKUP_LOG"
}

# Function to send notification (placeholder)
send_notification() {
    local status="$1"
    local message="$2"

    # In production, integrate with:
    # - Slack webhook
    # - Email service
    # - PagerDuty
    # - Discord webhook

    log "NOTIFICATION [$status]: $message"
}

# Function to perform database backup
backup_database() {
    log "Starting database backup..."

    # Check if PostgreSQL is accessible
    if ! pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB"; then
        log "ERROR: PostgreSQL is not accessible"
        send_notification "ERROR" "Database backup failed - PostgreSQL not accessible"
        exit 1
    fi

    # Create database dump
    if pg_dump -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
        --no-password --verbose --format=custom --compress=9 \
        --file="$BACKUP_FILE" 2>>"$BACKUP_LOG"; then

        log "Database backup completed successfully"

        # Verify backup integrity
        if pg_restore --list "$BACKUP_FILE" >/dev/null 2>&1; then
            log "Backup integrity verified"

            # Compress backup for storage efficiency
            gzip "$BACKUP_FILE"
            BACKUP_FILE="${BACKUP_FILE}.gz"

            # Get backup size
            BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
            log "Backup size: $BACKUP_SIZE"

            send_notification "SUCCESS" "Database backup completed successfully (Size: $BACKUP_SIZE)"
        else
            log "ERROR: Backup integrity check failed"
            send_notification "ERROR" "Database backup integrity check failed"
            exit 1
        fi
    else
        log "ERROR: Database backup failed"
        send_notification "ERROR" "Database backup failed"
        exit 1
    fi
}

# Function to backup application data
backup_app_data() {
    log "Starting application data backup..."

    APP_DATA_DIR="/app/data"
    APP_BACKUP_FILE="$BACKUP_DIR/app_data_backup_$TIMESTAMP.tar.gz"

    if [ -d "$APP_DATA_DIR" ]; then
        tar -czf "$APP_BACKUP_FILE" -C "$APP_DATA_DIR" . 2>>"$BACKUP_LOG"

        if [ $? -eq 0 ]; then
            log "Application data backup completed"
        else
            log "WARNING: Application data backup encountered issues"
        fi
    else
        log "INFO: No application data directory found"
    fi
}

# Function to clean old backups
cleanup_old_backups() {
    log "Cleaning up backups older than $RETENTION_DAYS days..."

    # Delete old database backups
    find "$BACKUP_DIR/database" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete 2>>"$BACKUP_LOG"

    # Delete old application data backups
    find "$BACKUP_DIR" -name "app_data_backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete 2>>"$BACKUP_LOG"

    # Delete old log files
    find "$BACKUP_DIR/logs" -name "backup_*.log" -mtime +$RETENTION_DAYS -delete 2>>"$BACKUP_LOG"

    log "Cleanup completed"
}

# Function to upload backup to cloud storage (placeholder)
upload_to_cloud() {
    log "Uploading backup to cloud storage..."

    # In production, implement cloud storage upload:
    # - AWS S3
    # - Google Cloud Storage
    # - Azure Blob Storage
    # - DigitalOcean Spaces

    # Example AWS S3 upload:
    # aws s3 cp "$BACKUP_FILE" s3://your-backup-bucket/database/

    log "Cloud upload placeholder - configure your cloud storage provider"
}

# Function to perform health check
health_check() {
    log "Performing backup system health check..."

    # Check disk space
    DISK_USAGE=$(df "$BACKUP_DIR" | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$DISK_USAGE" -gt 90 ]; then
        log "WARNING: Backup disk usage is at $DISK_USAGE%"
        send_notification "WARNING" "Backup disk usage is at $DISK_USAGE%"
    fi

    # Check backup directory permissions
    if [ ! -w "$BACKUP_DIR" ]; then
        log "ERROR: Backup directory is not writable"
        send_notification "ERROR" "Backup directory is not writable"
        exit 1
    fi

    log "Health check completed"
}

# Main execution
main() {
    log "===== LegalEaseFile Backup Process Started ====="

    # Perform health check
    health_check

    # Perform backups
    backup_database
    backup_app_data

    # Clean old backups
    cleanup_old_backups

    # Upload to cloud (if configured)
    # upload_to_cloud

    log "===== Backup Process Completed Successfully ====="
}

# Error handling
trap 'log "ERROR: Backup process failed at line $LINENO"; send_notification "ERROR" "Backup process failed"; exit 1' ERR

# Run main function
main

# Set up cron job for automated backups
# Add this to crontab for daily backups at 2 AM:
# 0 2 * * * /path/to/backup.sh