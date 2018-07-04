

/**
* Applies polyfills
* @constructor StarshipManager
* @classdesc This StarshipManager will allow a user to request starships and perform actions on a given starship
* e.g. Get a given starship's consumables available in hours
*/
var StarshipManager = function() {
  var Promise = require('promise-polyfill');
  //From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
  var startsWithPolyfill = function() {
    if (!String.prototype.startsWith) {
    	String.prototype.startsWith = function(search, pos) {
    		return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    	};
    }
  }();


  /**
  * @member {string}
  * @const
  */
  var BASE_API_REQUEST = "https://swapi.co/api/starships/";
  /**
  * @member {string}
  */
  var nextRequest = BASE_API_REQUEST;

  /**
  * This will load a batch of starships from the swapi.
  * @param {boolean} fromStart Whether we want to discard our current nextRequest and load starships using our original BASE_API_REQUEST. @default false
  * @return {Promise<Object[]>} A promise that will resolve with an array of starships if they are successfully loaded. Is null if all starships have been loaded. Another request to this service after it returns null will begin loading the starships from the beginning
  */
  StarshipManager.prototype.loadMoreStarships = function(fromStart) {
    if(fromStart && fromStart == true) {
      nextRequest = BASE_API_REQUEST;
    }
    if(!nextRequest) {//Reached the end of our requests, let user know by returning null
      nextRequest = BASE_API_REQUEST;
      return null;
    }
    return new Promise(function(resolve, reject) {
      var xhttp = new XMLHttpRequest();
      var results = [];
      var err = null;

      xhttp.open("GET", nextRequest, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.timeout = 2000;
      xhttp.ontimeout =  function() {
        return reject("timeout");
      };
      xhttp.onload =  function() {
        if(xhttp.status == 200) {
          response = null;
          try {
            response = JSON.parse(xhttp.responseText);
          } catch (e) {
            return reject("Server provided invalid response");
          }
          if(response.results && response.results.constructor === Array) {
            for(var i = 0; i < response.results.length; i++){
              results.push(response.results[i]);
            }
            nextRequest = response.next;
          } else {
            err = "No results were in the response";
          }
        } else {
          nextRequest = null;
          err = xhttp.statusText;
        }
        if(err) {
          return reject(err);
        }

        resolve(results);
      };
      xhttp.send();

    });
  };

  /**
  * Calculates the number of pitstops the given starship will need to take to cover the given distance
  * based on it's available consumables and speed(MGLT)
  * @param {Object} starship The starship we want to calculate the pitstops needed
  * @param {number} distance Distance you are travelling in MGLT
  * @return {number} The number of pitstops needed. Returns -1 if insufficient information available
  */
  StarshipManager.prototype.getPitstopsNeeded = function(starship, distance) {
    var consumablesInHours = this.getConsumablesInHours(starship);
    if(isNaN(distance) || distance < 0 || consumablesInHours < 0 || isNaN(starship.MGLT) || starship.MGLT < 0) {
      return -1;
    }
    return Math.floor(distance / (starship.MGLT * consumablesInHours));
  };


  /**
  * Gets the amount of consumables the given starship has available, in hours
  * @param {Object} starship An object which is expected to have the property "consumables" which should take the format "number unit" e.g. "5 days", "7 years" etc.
  * @return {number} The amount of consumables the given starship has, measured in hours
  */
  StarshipManager.prototype.getConsumablesInHours = function(starship) {
    var AMOUNT = 0;
    var UNIT = 1;
    var consumablesInHours = -1;
    if(starship.consumables && typeof starship.consumables == "string")
    {
      var consumables = starship.consumables.split(" ");
      if(consumables.length != 2) {
        return consumablesInHours;
      } else {
        consumablesInHours = convertToHours(consumables[AMOUNT], consumables[UNIT]);
      }
    }
    return consumablesInHours;
  };

  /**
  * Takes the given amount and converts it to hours
  * @param {number} amount The amount of the given unit we want converted into hours
  * @param {string} unit The unit of measurement the amount is currently in. Valid values: Any that start with "day","week","month","year"
  * @return {number} The amount provided, converted to hours
  */
  function convertToHours(amount, unit) {
    var HOURS_PER_YEAR = 8766;
    var DAYS_PER_YEAR = 365;
    var WEEKS_PER_YEAR = 52;
    var MONTHS_PER_YEAR = 12;
    var amountInHours = -1;
    if(!isNaN(amount) && typeof(unit == "string")) {
      amountInHours = amount;

      if(unit.startsWith("day")) {
        amountInHours *= HOURS_PER_YEAR / DAYS_PER_YEAR;
      } else if(unit.startsWith("week")) {
        amountInHours *= HOURS_PER_YEAR / WEEKS_PER_YEAR;
      } else if(unit.startsWith("month")) {
        amountInHours *= HOURS_PER_YEAR / MONTHS_PER_YEAR;
      } else if (unit.startsWith("year")) {
        amountInHours *= HOURS_PER_YEAR;
      } else {
        amountInHours = -1;
      }
    }
    return amountInHours;
  }

};

if ( typeof module !== 'undefined' && module.hasOwnProperty('exports') )
{
    module.exports = StarshipManager;
}
