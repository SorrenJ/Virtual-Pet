#!/bin/bash

# PostgreSQL credentials
DB_USER="labber"
DB_NAME="beastly_bonds_development"
DB_PASSWORD="labber"  # Set your password here if needed

# Path to your seed files
SEED_PATH="server/db/seeds/"

# List of files to exclude (separate by space)
EXCLUDE_FILES=("all_seed.sql")

# Check if the directory with seed files exists
if [ ! -d "$SEED_PATH" ]; then
  echo "Directory $SEED_PATH does not exist. Please check the path."
  exit 1
fi

# Check if there are any SQL files in the directory
if [ -z "$(ls -A ${SEED_PATH}*.sql 2>/dev/null)" ]; then
  echo "No SQL files found in $SEED_PATH"
  exit 1
fi

# Loop through each SQL file in the seeds directory
for FILE in ${SEED_PATH}*.sql; do
    FILE_NAME=$(basename $FILE)

    # Check if the file is in the exclude list
    if [[ " ${EXCLUDE_FILES[@]} " =~ " ${FILE_NAME} " ]]; then
        echo "Skipping $FILE_NAME"
        continue
    fi

    # Execute the SQL file
    echo "Inserting seed data from $FILE_NAME into $DB_NAME"

    # Use PGPASSWORD if the password is set
    if [ -n "$DB_PASSWORD" ]; then
        PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -f $FILE
    else
        psql -U $DB_USER -d $DB_NAME -f $FILE
    fi
    
    # Check if the command succeeded
    if [ $? -ne 0 ]; then
        echo "Error inserting data from $FILE_NAME. Aborting."
        exit 1
    fi
done

echo "All seed files have been successfully inserted into $DB_NAME, excluding the specified files."