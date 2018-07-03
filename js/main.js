

/**
* @class Entry point for the app
* This class controls the DOM for our pitstop calculator app
* It will set up an interface that allows a user to enter a number of Megalights and will display
* all the starships and the total amount of stops required to make the given distance.
* It will give feedback to the user about whether their request was successful
*/
function Main() {
  this.loading = false;

  /**
  * Errors
  */
  this.DISTANCE_ERROR = "Please enter a valid distance";
  this.LOAD_FAILED_ERROR = "Couldn't fetch all the results, please try again later";

  /**
  * Dom values
  */
  this.CALCULATE_BUTTON = "mglt-calculate-btn";
  this.MGLT_INPUT = "mglt-input";
  this.IGNORE_UNKNOWN_PITSTOPS_CHECK = "ignore-unknowns-chk";
  this.STARSHIP_LIST = "starship-list";
  this.LOADER = "loader";
  this.ERROR_MESSAGE = "error-message";
}

/**
* Initialises the app and enables user controls to calculate starship pitstops
*/
Main.prototype.init = function() {
  this.starshipManager = new StarshipManager();
  var calculateBtn = document.getElementById(this.CALCULATE_BUTTON);

  if(calculateBtn) {
    calculateBtn.addEventListener("click", this.onCalculatePitstops.bind(this), false);
  }
};

/**
* Make a request to calculate the number of pitstops
*/
Main.prototype.onCalculatePitstops = function() {
  var distance = this.getDistance();
  if(distance > 0 && distance <= this.getMaxDistance()) {
    this.toggleLoading();
    this.setErrorMessage("");
    this.calculateStarshipPitstops();
  } else {
    this.setErrorMessage(this.DISTANCE_ERROR);
  }
};

/**
* Empties our list of current starships and begins an attempt
* to recalculate all starship pitstops
*/
Main.prototype.calculateStarshipPitstops = function() {
  this.clearStarships();
  this.starshipManager.loadMoreStarships().then(this.getMoreStarships.bind(this), this.loadFailed.bind(this));
};

/**
* This will update the pitstops of our
*/
Main.prototype.getMoreStarships = function(results) {
  this.updatePitstops(results);
  var promise = this.starshipManager.loadMoreStarships();
  if(promise) {
    promise.then(this.getMoreStarships.bind(this), this.loadFailed.bind(this));
  } else {
    this.toggleLoading();
  }
};

/**
* Clear any partially loaded data and display an error if we fail to load starsgips
*/
Main.prototype.loadFailed = function() {
  this.clearStarships();
  this.setErrorMessage(this.LOAD_FAILED_ERROR);
};


/**
* Goes through each of the given starships and displays them
* @param {array} starships An array of the starships we want to update the pitstops of. Should each have name, MGLT and consumables properties
*/
Main.prototype.updatePitstops = function(starships) {
  var distance = this.getDistance();

  for(var i = 0; i < starships.length; i++) {
    var consumablesInHours = this.starshipManager.getConsumablesInHours(starships[i]);

    if(distance < 0 || consumablesInHours < 0 || starships[i].MGLT == "unknown" || starships[i].MGLT < 0) {
      if(this.allowUnknownPitstops()) {
        this.displayStarship(starships[i].name, "unknown");
      }
    } else {
      var stopsRequired = Math.floor(distance / (starships[i].MGLT * consumablesInHours));
      this.displayStarship(starships[i].name, stopsRequired);
    }
  }

};

/**
* Clears the display of all starships
*/
Main.prototype.clearStarships = function() {
  var starshipList = document.getElementById(this.STARSHIP_LIST);
  if(starshipList) {
    starshipList.innerHTML = "";
  }
};

/**
* Displays the given sparship with the given detail by adding it to a list
* @param {string} name The name of the ship we want to display
* @param {string} detail The detail about this ship we want to display
*/
Main.prototype.displayStarship = function(name, detail) {
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
* Toggles whether app is loading or not
* @return {boolean} Whether the app is loading after the toggle
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
  return this.loading;
};

/**
* Sends the given error message to the user
*/
Main.prototype.setErrorMessage = function(message) {
  var messageBox = document.getElementById("error-message");
  if(messageBox) {
    messageBox.innerHTML = message;
  }
};

/**
* Get the distance the user has provided us with
* @return {number} The distance the user has entered or -1 if the user input was invalid or undetectable
*/
Main.prototype.getDistance = function() {
  var input = document.getElementById("mglt-input");
  if(input && input.value && !isNaN(input.value)) {
    return parseInt(input.value);
  }
  return -1;
};

/**
* Gets the max distance a user is allowed to enter
* @return {number} The max distance a user can enter. -1 If not found.
*/
Main.prototype.getMaxDistance = function() {
  var input = document.getElementById("mglt-input");
  if(input && input.max && !isNaN(input.max)) {
    return parseInt(input.max);
  }
  return -1;
};

/**
* Returns whether we are allowing or disallowing unknown pitstops to be displayed
* @return {boolean} True if unknowns are allowed, false otherwise
*/
Main.prototype.allowUnknownPitstops = function() {
  var excludeUnknowns = document.getElementById(this.IGNORE_UNKNOWN_PITSTOPS_CHECK);
  return(excludeUnknowns && !excludeUnknowns.checked);
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
