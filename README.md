# Virtual-Pet

## Setup
Install dependencies with `npm install` in each respective `/client/pet-app` and `/server`.

## How To Run

### Running Front-end Server

Go to the path: `/client/pet-app` and `npm run` in the terminal

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
 
5. in psql type `\i seeds/your_seed.sql` to insert the data to the tables. (replace "your_seed" with the seed file name)