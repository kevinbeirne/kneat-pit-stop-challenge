

/**
*@class Entry point for the app
*/
function Main() {
  this.DISTANCE_ERROR = "Please enter a valid distance";

  this.CALCULATE_BUTTON = "mglt-calculate-btn";
  this.MGLT_INPUT = "mglt-input";
  this.LOADER = "loader";
  this.ERROR_MESSAGE = "error-message";
  this.STARSHIP_LIST = "starship-list";
  this.loading = false;
}

Main.prototype.getCalculateButton = function() {

};

Main.prototype.init = function() {
  this.swApi = new SwApiManager();
  var calculateBtn = document.getElementById(this.CALCULATE_BUTTON);
  var self = this;

  if(calculateBtn){
  calculateBtn.addEventListener("click", function(evt) {
      if(self.getDistance() > 0) {

        self.toggleLoading();
        self.setErrorMessage("");
        self.getStarships().then(self.updatePitstops.bind(self));
      } else {
        self.setErrorMessage(self.DISTANCE_ERROR);
      }
    }, false);
  }
};

Main.prototype.calculateStarshipPitstops = function() {

};

/**
* Updates the dom to the loading state
*
*/
Main.prototype.toggleLoading = function() {
  this.loading = !this.loading;

  var loader = document.getElementById("loader");
  if(loader) {
    if(this.loading) {
      loader.style.visibility = "visible";
    } else {
      loader.style.visibility = "hidden";
    }
  }
  var calculateBtn = document.getElementById(this.CALCULATE_BUTTON);
  if(calculateBtn) {
    calculateBtn.disabled = this.loading;
  }
  var input = document.getElementById(this.MGLT_INPUT);
  if(input) {
    input.disabled = this.loading;
  }
};

Main.prototype.setErrorMessage = function(message) {
  var messageBox = document.getElementById("error-message");
  if(messageBox) {
    messageBox.innerHTML = message;
  }
};

Main.prototype.getDistance = function() {
  var input = document.getElementById("mglt-input");
  if(input && input.value && !isNaN(input.value)) {
    return input.value;
  }
  return -1;
};

Main.prototype.getStarships = function(ctx) {
  return this.swApi.getStarships();

};

Main.prototype.updatePitstops = function(res, distance) {
this.toggleLoading();
  console.log("res");
  console.log(res);
  console.log(res.length);


  for(var i = 0; i < res.length; i++) {
    var AMOUNT = 0;
    var UNIT = 1;
    var consumables = res[i].consumables.split(" ");
    var consumablesInHours = -1;
    if(consumables.length == 2){
      var consumablesInHours = this.getConsumablesInHours(consumables[AMOUNT], consumables[UNIT]);
    }

    if(distance < 0 || consumablesInHours < 0 || res[i].MGLT == "unknown" || res[i].MGLT < 0){
      this.displaySpaceship(res[i].name, "unknown");
    } else {
      var stopsRequired = Math.floor(distance / (res[i].MGLT * consumablesInHours));
      this.displaySpaceship(res[i].name, stopsRequired);
    }
  }

};

/**
* @param {string} name The name of the ship we want to display
* @param {string} detail The detail about this ship we want to display
*/
Main.prototype.displaySpaceship = function(name, detail) {
  console.log(name + ": " + detail);
};

/**
* Reads the given amount and unit and returns how long the consumables will last, in hours
*/
Main.prototype.getConsumablesInHours = function(amount, unit) {
  var HOURS_PER_YEAR = 8766;
  var DAYS_PER_YEAR = 365;
  var WEEKS_PER_YEAR = 52;
  var MONTHS_PER_YEAR = 12;

  var consumablesInHours = -1;

  if(!isNaN(consumables[AMOUNT]) && typeof(consumables[UNIT] == "string")) {
    consumablesInHours = consumables[AMOUNT];
    if(consumables[UNIT].startsWith("day")) {
      consumablesInHours *= HOURS_PER_YEAR / DAYS_PER_YEAR;
    } else if(consumables[UNIT].startsWith("week")) {
      consumablesInHours *= HOURS_PER_YEAR / WEEKS_PER_YEAR;
    } else if(consumables[UNIT].startsWith("month")) {
      consumablesInHours *= HOURS_PER_YEAR / MONTHS_PER_YEAR;
    } else if (consumables[UNIT].startsWith("year")) {
      consumablesInHours *= HOURS_PER_YEAR;
    }
  }
  return consumablesInHours;
};


/**
* @function
* Says whether the app is working
* @param {string} title The title of the app
* @return {boolean} Whether the app is working
*/
Main.prototype.isWorking = function(title) {
  console.log(title + " is working!");
  return true;
}

var m = new Main();
m.init();
