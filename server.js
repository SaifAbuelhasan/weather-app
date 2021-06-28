// API endpoint
let projectData = {};
// Express to run server and routes
const express = require("express");

// Start up an instance of app 
const app = express();

/* Dependencies */
const bodyParser = require('body-parser');
/* Middleware*/
// Here we're configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static("website"));

/* Server port*/
const port = 8000;

// Run the server 
const server = app.listen(port, () => {
	console.log(`running on localhost: ${port}`);
})

// Route to post request
app.post("/addData", (req, res) => {
	// add the request body to project data.
	const newEntry = {
		city: req.body.city,
		date: req.body.date,
		temp: req.body.temp,
		feeling: req.body.feeling
	}
	projectData = newEntry;
	res.send(projectData);
}) 

// Route to get request
app.get("/getData", (req, res) => {
	// Check if there are entries to show
	if (Object.keys(projectData).length !== 0) {
		res.send(projectData);
	} else {
		// send false as response
		res.send('false');
	}
})

