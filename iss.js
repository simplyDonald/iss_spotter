/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  let domain = 'https://api.ipify.org?format=json';
  
  request(domain, (error, response, body) => {
    if (error) {
      callback(error,null);
      return;
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // console.log(response.statusCode);
    let data = JSON.parse(body);
    let {ip} = data;
    callback(null,ip);
    // console.log(body);
    // if(data.length === 0) {
    // if(body === '[]') {
    //   let message = 'Incorrect breed name';
    //   callback(null,message);
    //   return;
    // }
    // console.log(data);
    // let {description} = data[0];
    // // console.log(description);
    // callback(null,description);
      
  });
};

const fetchCoordsByIP = function(ip,callback) {
  let domain = `https://api.freegeoip.app/json/${ip}?apikey=289ffb70-3e85-11ec-8a53-45d35ab9e4d0`;
  let invalidIp = 'https://freegeoip.app/json/invalidIPHere';
  request(domain, (error, response, body) => {
    if (error) {
      callback(error,null);
      return;
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // console.log(response.statusCode);
    let data = JSON.parse(body);
    let {latitude,longitude} = data;
    // console.log(data)
    callback(null,{latitude,longitude});
    // console.log(body);
    // if(data.length === 0) {
    // if(body === '[]') {
    //   let message = 'Incorrect breed name';
    //   callback(null,message);
    //   return;
    // }
    // console.log(data);
    // let {description} = data[0];
    // // console.log(description);
    // callback(null,description);
      
  });
};



/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */

const fetchISSFlyOverTimes = (geoObj,callback) =>{
  let domain = `https://iss-pass.herokuapp.com/json/?lat=${geoObj.latitude}&lon=${geoObj.longitude}`;

  request(domain, (error, response, body) => {
    if (error) {
      callback(error,null);
      return;
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // console.log(body);
    let data = JSON.parse(body);
    let output = data.response;
    callback(null,output);
    // if(data.length === 0) {
    // if(body === '[]') {
    //   let message = 'Incorrect breed name';
    //   callback(null,message);
    //   return;
    // }
    // console.log(data);
    // let {description} = data[0];
    // // console.log(description);
    // callback(null,description);
      
  });
};

// iss.js 

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
 const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};


module.exports = { nextISSTimesForMyLocation };
