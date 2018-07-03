/**
* @constructor
* This StarshipManager will allow a user to request starships and perform actions on a given starship
* e.g. Get a given starship's consumables available in hours
*/
StarshipManager = function(){
  this.nextRequest = "https://swapi.co/api/starships/";
};

/**
* This will load a batch of starships from the swapi.
* @return {Promise<Object[]>} A promise that will resolve with an array of starships if they are successfully loaded. Is null if all starships have been loaded. Another request to this service after it returns null will begin loading the starships from the beginning
*/
StarshipManager.prototype.loadMoreStarships = function() {
  if(!this.nextRequest) {//Reached the end of our requests, let user know by returning null
    this.nextRequest = "https://swapi.co/api/starships/";
    return null;
  }
  var self = this;
  return new Promise(function(resolve, reject) {
    var xhttp = new XMLHttpRequest();
    var results = [];
    var err = null;

    xhttp.open("GET", self.nextRequest, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.timeout = 2000;
    xhttp.addEventListener("timeout",  function() {
      return reject("timeout");
    });
    xhttp.addEventListener("load",  function() {
      var response = JSON.parse(xhttp.responseText);
      if(xhttp.status == 200) {
        if(response.results && response.results.constructor === Array) {
          for(var i = 0; i < response.results.length; i++){
            results.push(response.results[i]);
          }
        } else {
          err = "No results were in the response";
        }
        self.nextRequest = response.next;
      } else {
        self.nextRequest = null;
        err = xhttp.status;
      }
      if(err) {
        return reject(err);
      }

      resolve(results);
    });
    xhttp.send();

  });
};

/**
* Gets the amount of consumables the given starship has available, in hours
* @param {Object} starship An object which is expected to have the property "consumables" which should take the format "number unit" e.g. "5 days", "7 years" etc.
* @return {number} The amount of consumables the given starship has, measured in hours
*/
StarshipManager.prototype.getConsumablesInHours = function(starship) {
  var AMOUNT = 0;
  var UNIT = 1;
  var consumables = starship.consumables.split(" ");
  var consumablesInHours = -1;
  if(consumables.length != 2) {
    return consumablesInHours;
  }

  return this._convertToHours(consumables[AMOUNT], consumables[UNIT]);
};

/**
* Takes the given amount and converts it to hours
* @param {number} amount The amount of the given unit we want converted into hours
* @param {string} unit The unit of measurement the amount is currently in. Valid values: Any that start with "day","week","month","year"
* @return {number} The amount provided, converted to hours
*/
StarshipManager.prototype._convertToHours = function(amount, unit) {
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
};
