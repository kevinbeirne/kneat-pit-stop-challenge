StarshipManager = function(){
  this.nextRequest = "https://swapi.co/api/starships/";
  this.API_UNKOWN = "unknown";//The value the api uses to tell us it doesn't have an answer
};
/**
* Gets all the starships from thje swapi
* @param {number} count The max number of starships we want to use
* @return {Object[]} The list of starships
*/
StarshipManager.prototype.loadAllStarships = function(count) {
  return new Promise(function(resolve, reject) {
    var xhttp = new XMLHttpRequest();
    var nextRequest = "https://swapi.co/api/starships/";
    var results = [];
    var err = null;
    while(nextRequest) {
      xhttp.open("GET", nextRequest, false);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
      var response = JSON.parse(xhttp.responseText);
      if(xhttp.status == 200) {
        if(response.results && response.results.constructor === Array) {
          results.push(...response.results);
        } else {
          err = "No results were in the response";
        }
        nextRequest = response.next;
      } else {
        nextRequest = null;
        err = xhttp.status;
      }
      if(err) {
        return reject(err);
      }
    }
    resolve(results);
  });
};

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
    xhttp.addEventListener("load",  function() {
      var response = JSON.parse(xhttp.responseText);
      if(xhttp.status == 200) {
        if(response.results && response.results.constructor === Array) {
          //results.push(...response.results); <- Preferable
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
* Reads the given amount and unit and returns how long the consumables will last, in hours
*/
StarshipManager.prototype.getConsumablesInHours = function(amount, unit) {
  var HOURS_PER_YEAR = 8766;
  var DAYS_PER_YEAR = 365;
  var WEEKS_PER_YEAR = 52;
  var MONTHS_PER_YEAR = 12;

  var consumablesInHours = -1;

  if(!isNaN(amount) && typeof(unit == "string")) {
    consumablesInHours = amount;

    if(unit.startsWith("day")) {
      consumablesInHours *= HOURS_PER_YEAR / DAYS_PER_YEAR;
    } else if(unit.startsWith("week")) {
      consumablesInHours *= HOURS_PER_YEAR / WEEKS_PER_YEAR;
    } else if(unit.startsWith("month")) {
      consumablesInHours *= HOURS_PER_YEAR / MONTHS_PER_YEAR;
    } else if (unit.startsWith("year")) {
      consumablesInHours *= HOURS_PER_YEAR;
    } else {
      consumablesInHours = -1;
    }
  }
  return consumablesInHours;
};
