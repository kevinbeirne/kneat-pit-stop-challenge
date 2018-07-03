

/**
*@class Entry point for the app
*/
function Main() {
  this.loading = false;

  this.DISTANCE_ERROR = "Please enter a valid distance";
  this.LOAD_FAILED_ERROR = "Couldn't fetch all the results, please try again later";


  /**
  * Dom values
  */
  this.CALCULATE_BUTTON = "mglt-calculate-btn";
  this.MGLT_INPUT = "mglt-input";
  this.IGNORE_UNKNOWNS_CHECK = "ignore-unknowns-chk";
  this.STARSHIP_LIST = "starship-list";
  this.LOADER = "loader";
  this.ERROR_MESSAGE = "error-message";
}

Main.prototype.getCalculateButton = function() {

};

Main.prototype.init = function() {
  this.starshipManager = new StarshipManager();
  var calculateBtn = document.getElementById(this.CALCULATE_BUTTON);
  var self = this;

  if(calculateBtn) {
    calculateBtn.addEventListener("click", function(evt) {
        if(self.getDistance() > 0) {
          self.toggleLoading();
          self.setErrorMessage("");
          self.calculateStarshipPitstops();
        } else {
          self.setErrorMessage(self.DISTANCE_ERROR);
        }
      }, false);
  }
};


Main.prototype.calculateStarshipPitstops = function() {
  this.clearSpaceships();
  this.starshipManager.loadMoreStarships().then(this.getMoreStarships.bind(this), this.loadFailed.bind(this));
};

Main.prototype.getMoreStarships = function(results) {
  this.updatePitstops(results);
  var promise = this.starshipManager.loadMoreStarships();
  if(promise) {
    promise.then(this.getMoreStarships.bind(this), this.loadFailed.bind(this));
  } else {
    this.toggleLoading();
  }
};

Main.prototype.loadFailed = function() {
  this.clearSpaceships();
  this.setErrorMessage(this.LOAD_FAILED_ERROR);
};

Main.prototype.updatePitstops = function(res) {
  var distance = this.getDistance();


  for(var i = 0; i < res.length; i++) {
    var AMOUNT = 0;
    var UNIT = 1;
    var consumables = res[i].consumables.split(" ");
    var consumablesInHours = -1;//Fix this
    if(consumables.length == 2){
      consumablesInHours = this.starshipManager.getConsumablesInHours(consumables[AMOUNT], consumables[UNIT]);
    }

    if(distance < 0 || consumablesInHours < 0 || res[i].MGLT == "unknown" || res[i].MGLT < 0) {
      var unknowns = document.getElementById(this.IGNORE_UNKNOWNS_CHECK);
      if(unknowns && !unknowns.checked) {
        this.displaySpaceship(res[i].name, "unknown");
      }
    } else {
      var stopsRequired = Math.floor(distance / (res[i].MGLT * consumablesInHours));
      this.displaySpaceship(res[i].name, stopsRequired);
    }
  }

};

Main.prototype.clearSpaceships = function() {
  var starshipList = document.getElementById(this.STARSHIP_LIST);
  if(starshipList) {
    starshipList.innerHTML = "";
  }
};

/**
* @param {string} name The name of the ship we want to display
* @param {string} detail The detail about this ship we want to display
*/
Main.prototype.displaySpaceship = function(name, detail) {
  console.log(name + ": " + detail);
  var starshipList = document.getElementById(this.STARSHIP_LIST);
  if(starshipList) {
    var li = document.createElement("li");
    var span = document.createElement("span");
    span.appendChild(document.createTextNode(name + ": " + detail));
    li.appendChild(span);
    starshipList.appendChild(li);
  }
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

/**
* @function
* Says whether the app is working
* @param {string} title The title of the app
* @return {boolean} Whether the app is working
*/
Main.prototype.isWorking = function(title) {
  console.log(title + " is working!");
  return true;
};

var m = new Main();
m.init();
