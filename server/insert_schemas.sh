#!/bin/bash

# PostgreSQL credentials
DB_USER="labber"
DB_NAME="beastly_bonds_development"  # Specify your database name
PGPASSWORD="labber"
# Path to your schema files
SCHEMA_PATH="server/db/schema/"

# List of files to exclude (separate by space)
EXCLUDE_FILES=("schema.sql")

# Loop through each SQL file in the schema directory
for FILE in ${SCHEMA_PATH}*.sql; do
    # Extract file name
    FILE_NAME=$(basename $FILE)

    # Check if file is in the exclude list
    if [[ " ${EXCLUDE_FILES[@]} " =~ " ${FILE_NAME} " ]]; then
        echo "Skipping $FILE_NAME"
        continue
    fi

    # Execute the SQL file (insert schema)
    echo "Inserting schema from $FILE_NAME into beastly_bonds_development"
        PGPASSWORD=$PGPASSWORD psql -U $DB_USER -d $DB_NAME -f $FILE
done
