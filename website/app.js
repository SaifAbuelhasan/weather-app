/* global variables*/ 
const baseURL = "http://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = config.API_KEY;
const zip = document.getElementById("zip");
const feelings = document.getElementById("feelings");
const generate = document.getElementById("generate");

/* Helper functions*/
const clearInput = (clearFeelings) => {
	zip.value = '';
	feelings.value = clearFeelings ? '' : feelings.value;
	generate.disabled = true;
}

// Get a js object out of response
const getObj = async (response) => {
	try {
		const data = await response.json();
		// Get a readable date string out of timestamp
		const city = data.name;
		const timestamp = data.dt;
		const date = new Date(timestamp * 1000).toLocaleString("en-GB");

		// Get temprature in Celsius
		const temp = data.main.temp;

		// Return only date and temprature from retrieved data
		return {city: city, date: date.slice(0, date.indexOf(',')), temp: temp};
	} catch(error) {
		return error;
	}
}

/* Main functions*/
// getWeather function sends a request to the api
const getWeather = async (url) => {
	// The request
	const res = await fetch(url);
	return res;
}

// POST data entered by user
const postData = async (url, data) => {
	const res = await fetch(url, {
		method: "POST",
		credentials: "same-origin",
		headers: {
			"content-Type": "application/json",
		},
		body: JSON.stringify(data)
	});
	try {
		const newData = await res.json();
		return newData;
	} catch(error) {
		return error;
	}
}

// Update UI
const update = (city, date, temp, feeling) => {
	// Store entry elements in variables
	const cityElement = document.getElementById("city");
	const dateElement = document.getElementById("date");
	const tempElement = document.getElementById("temp");
	const contentElement = document.getElementById("content");

	// Add data
	cityElement.innerHTML = `<p>City: ${city}</p>`;
	dateElement.innerHTML = `<p>Date: ${date}</p>`;
	tempElement.innerHTML = `<p>Temprature: ${temp}&deg;</p>`;
	// populate the feeling entry if the user provided how he felt
	contentElement.innerHTML = feeling === '' ? '' : `<p>Feeling: ${feeling}</p>`;
}

// Retrieve data from server
const fetchData = async () => {
	// p element that indicates when no entries exist
	const noEntries = document.getElementById("noEntries");
	const res = await fetch("/getData");
	try {
		const data = await res.json();
		if(data) {
			// Hide text
			noEntries.classList.add("hide");

			update(data.city, data.date, data.temp, data.feeling);
		} else {
			// Show no entries text if there are no entries
			noEntries.classList.remove("hide");
		}
	} catch(error) {
		return error;
	}
}

const chain = (url, feeling) => {
	getWeather(url)
	.then((response) => {
		// Check if API get request was successful
		if (!response.ok) {
			throw response; // Jump to catch function
		}
		// return js object
		return getObj(response);
	})
	.then((data) => {
		postData('/addData', {...data, feeling});
	})
	.then(() => {
		fetchData();
	})
	.catch((error) => {
		if (error.status === 404) {
			// zip code isn't in the US
			alert("Please enter a US zip code");
		}
		return error;
	})

}

// callback function when the generate button is clicked
const generateClicked = () => {
	// get user input
	let zipCodeInput = zip.value;
	const feelingsInput = feelings.value;

	/* validate zipCode*/
	const zepCodeRGEX = /^[0-9]{5}(?:-[0-9]{4})?$/;
	if (zepCodeRGEX.test(zipCodeInput)) {
		// Create url
		const url = baseURL + zipCodeInput + ',us&appid=' + apiKey;

		// Start promises chain
		chain(url, feelingsInput);

		// Clear user input
		clearInput(true);
	} else {
		// If the input is invalid alert the user and reset zip input
		alert("Please enter a valid zip code");
		clearInput(false);
	}
}

// Check if input is empty
zip.addEventListener("input", () => {
	const input = zip.value;
	// if the button is disabled any input other than whitespace would enable it
	if (generate.disabled && input.trim() !== '') {
		generate.disabled = false;
	} else if (input.trim() === '') {
		// disable the button if the input is empty
		generate.disabled = true;
	}
});


// Handle generate button click
generate.addEventListener("click", generateClicked);
generate.disabled = true;

// Check if there are any entries to show
fetchData();