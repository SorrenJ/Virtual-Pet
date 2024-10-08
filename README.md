# Virtual-Pet

We know... we'll delete the .env file later

## Setup
Install dependencies with `npm install` in each respective `/client/pet-app` and `/server`.

## How To Run

### Setup anf run Front-end Server

1. Install `npm install sass`

2. Install `npm install react-modal`

2. Go to the path: `/client/pet-app` and `npm run` in the terminal

### Setup and run Back-end Server

install to root server directory `npm i express pg cors`

install to root server directory`npm install --save-dev nodemon`

run root server directory to start `npm start`


## Database
DB_NAME= beastly_bonds_development

1. In psql create db: `CREATE DATABASE beastly_bonds_development;`

2. Then connect to it: `\c beastly_bonds_development`

3. After creating database type `\i db/schema/schema.sql` in psql terminal to create the tables

4. To check if tables exist type : `\dt`
 
5. in psql type `\i db/seeds/your_seed.sql` to insert the data to the tables. (replace "your_seed" with the seed file name)

6. To test if the seed was inserted in psql: `SELECT * your_table_name;` 

7. You might find yourself needing to deleting th data from a table you can `DELETE FROM your_table_name`

8. To reset the serial id from a table you can `ALTER SEQUENCE your_table_name_id_seq RESTART WITH 1;`

Alternatively you can run our bash script files in the terminal to insert all schemas and seed files located in their respective directories (with specified exceptions in the scripts).

For the schemas:

1. Set the correct permissions: `chmod +x server/insert_schemas.sh`

2. Run `./server/insert_schemas.sh`

Now for the seeds:

1. Set the correct permissions: `chmod +x server/insert_seeds.sh`

2. Run `./server/insert_seeds.sh`