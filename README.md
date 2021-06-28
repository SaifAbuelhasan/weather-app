# Weather-Journal App Project

Client side:

The generate button is disabled by default.
line 119 app.js checks if the zip code input isn't empty to enable the button.

Clicking the generate button with an invalid zip code triggers an alert notifying the user that
his input is incorrect. line 101
(I realize an alert isn't the best UI experience
but I guess it covers the purposes of this project)

If a valid input is generated chain() function is called and the promise chain starts.
1. getWeather line 18
2. postData line 39
3. fetchData line 72

If the user didn't provide feelings only date and temprature elements will be added. line 68


Server side:

post route adds the data to the endpoint array. line 33

get route sends the last entry in the endpoint as a response. line 38 

UPDATE:
Added city entry
Retrieve most recent entry from server if page is refreshed. line 168
"No entries" text is shown if user hasn't entered any entries yet.

