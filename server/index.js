const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();
//middleware
app.use(cors());


// Set up EJS as the templating engine
app.set('view engine', 'ejs');

app.listen(5000, () => {
    console.log("server started on port 5000");
});


app.get('/adopt', async (req, res) => {

    try {
        // Query the species table
        const result = await pool.query('SELECT * FROM species');
        
        // Render the 'adopt.ejs' template and pass the species data to it
        res.render('adopt', { species: result.rows });
      } catch (err) {
        console.error('Error fetching species:', err);
        res.status(500).send('Server error');
      }


})