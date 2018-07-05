/**
* Defaults the loading to false and establishes constants for our error messages and DOM elements.
* @constructor Main
* @classdesc This class controls the DOM for our pitstop calculator app
* It will set up an interface that allows a user to enter a number of Megalights and will display
* all the starships and the total amount of stops required to make the given distance.
* It will give feedback to the user about whether their request was successful.
*/
var Main = function() {
  var Promise = require('promise-polyfill');

  var StarshipManager = require("./starshipManager");
  var starshipManager = new StarshipManager();

  /**
  * @member {boolean}
  */
  var loading = false;
  /**
  * Error message for invalid distance
  * @member {string}
  * @const
  */
  var DISTANCE_ERROR = "Please enter a valid distance (number from 1-1000000000)";
  /**
  * Error message for failing to load results
  * @member {string}
  * @const
  */
  var LOAD_FAILED_ERROR = "Couldn't fetch all the results, please try again later";

  /**
  * Message we display when there is an unknown number of pitstops required
  * @member {string}
  * @const
  */
  var UNKNOWN_MESSAGE = "Unknown";

  /**
  * DOM access for calculate
  * @member {string}
  * @const
  */
  var DOM_CALCULATE_BUTTON = "mglt-calculate-btn";
  /**
  * @member {string}
  * @const
  */
  var DOM_MGLT_INPUT = "mglt-input";
  /**
  * @member {string}
  * @const
  */
  var DOM_IGNORE_UNKNOWN_PITSTOPS_CHECK = "ignore-unknowns-chk";
  /**
  * @member {string}
  * @const
  */
  var DOM_STARSHIP_LIST = "starship-list";
  /**
  * @member {string}
  * @const
  */
  var DOM_LOADER = "loader";
  /**
  * @member {string}
  * @const
  */
  var DOM_ERROR_MESSAGE = "error-message";


  /**
  * Initialises the app and enables user controls to calculate starship pitstops
  * @memberof Main
  */
  Main.prototype.init = function() {
    var calculateBtn = document.getElementById(DOM_CALCULATE_BUTTON);

    if(calculateBtn) {
      calculateBtn.addEventListener("click", onCalculatePitstops, false);
    }
  };

  /**
  * Make a request to calculate the number of pitstops
  */
  var onCalculatePitstops = function() {
    var distance = getDistance();
    if(distance > 0 && distance <= getMaxDistance()) {
      toggleLoading();
      setErrorMessage("");
      calculateStarshipPitstops();
    } else {
      setErrorMessage(DISTANCE_ERROR);
    }
  };

  /**
  * Empties our list of current starships and begins an attempt
  * to recalculate all starship pitstops
  */
  var calculateStarshipPitstops = function() {
    clearStarships();
    starshipManager.loadMoreStarships().then(onGetStarships, loadFailed);
  };

  /**
  * Updates our pitstops with the results we've received and then attempts to load more starships if they are available
  * @param {Object[]} starships The starships we just received
  */
  var onGetStarships = function(starships) {
    updatePitstops(starships);
    var promise = starshipManager.loadMoreStarships();
    if(promise) {
      promise.then(onGetStarships, loadFailed);
    } else {
      toggleLoading();
    }
  };

  /**
  * Clears any partially loaded starships and displays an error if we fail to load any starships
  */
  var loadFailed = function() {
    clearStarships();
    toggleLoading();
    setErrorMessage(LOAD_FAILED_ERROR);
  };

  /**
  * Goes through each of the given starships and displays them
  * @param {Object[]} starships An array of the starships we want to update the pitstops of. Should each have name, MGLT and consumables properties
  */
  var updatePitstops = function(starships) {
    for(var i = 0; i < starships.length; i++) {
      var stopsRequired = starshipManager.getPitstopsNeeded(starships[i], getDistance());
      if(stopsRequired == -1) {
        if(allowUnknownPitstops()) {
          displayStarship(starships[i].name, UNKNOWN_MESSAGE);
        }
      } else {
        displayStarship(starships[i].name, stopsRequired);
      }
    }
  };

  /**
  * Displays the given starship with the given detail by adding it to a list
  * @param {string} name The name of the ship we want to display
  * @param {string} detail The detail about this ship we want to display
  */
  var displayStarship = function(name, detail) {
    var starshipTable = document.getElementById(DOM_STARSHIP_LIST);
    if(starshipTable) {

      var tbody = starshipTable.getElementsByTagName('tbody');
      if(tbody && tbody.length > 0 && tbody[0]) {
        var tr = document.createElement("tr");
        var tdName = document.createElement("td");
        var tdDetail = document.createElement("td");
        tdName.appendChild(document.createTextNode(name));
        tdDetail.appendChild(document.createTextNode(detail));
        tr.appendChild(tdName);
        tr.appendChild(tdDetail);
        tbody[0].appendChild(tr);
      }
    }
  };

  /**
  * Clears the display of all starships
  */
  var clearStarships = function() {
    var starshipTable = document.getElementById(DOM_STARSHIP_LIST);
    if(starshipTable) {
      var tbody = starshipTable.getElementsByTagName('tbody');
      if(tbody && tbody.length > 0 && tbody[0]) {
        tbody[0].innerHTML = "";
      }
    }
  };

  /**
  * Toggles whether app is loading or not.
  * Will update display and enable/disable any controls that shouldn't be allowed when app is loading
  * @return {boolean} Whether the app is loading after the toggle
  */
  var toggleLoading = function() {
    loading = !loading;

    var loader = document.getElementById(DOM_LOADER);
    if(loader) {
      if(loading) {
        loader.style.visibility = "visible";
      } else {
        loader.style.visibility = "hidden";
      }
    }
    var calculateBtn = document.getElementById(DOM_CALCULATE_BUTTON);
    if(calculateBtn) {
      calculateBtn.disabled = loading;
    }
    var input = document.getElementById(DOM_MGLT_INPUT);
    if(input) {
      input.disabled = loading;
    }
    var unknowns = document.getElementById(DOM_IGNORE_UNKNOWN_PITSTOPS_CHECK);
    if(unknowns) {
      unknowns.disabled = loading;
    }
    return loading;
  };

  /**
  * Sends the given error message to the user
  * @param {string} message The message we want to show
  */
  var setErrorMessage = function(message) {
    var messageBox = document.getElementById(DOM_ERROR_MESSAGE);
    if(messageBox) {
      messageBox.innerHTML = message;
    }
  };

  /**
  * Get the distance the user has provided us with
  * @return {number} The distance the user has entered or -1 if the user input was invalid or undetectable
  */
  var getDistance = function() {
    var input = document.getElementById(DOM_MGLT_INPUT);
    if(input && input.value && !isNaN(input.value)) {
      return parseInt(input.value);
    }
    return -1;
  };

  /**
  * Gets the max distance a user is allowed to enter
  * @return {number} The max distance a user can enter. -1 If not found.
  */
  var getMaxDistance = function() {
    var input = document.getElementById(DOM_MGLT_INPUT);
    if(input && input.max && !isNaN(input.max)) {
      return parseInt(input.max);
    }
    return -1;
  };

  /**
  * Returns whether we are allowing or disallowing unknown pitstops to be displayed
  * @return {boolean} True if unknowns are allowed, false otherwise
  */
  var allowUnknownPitstops = function() {
    var excludeUnknowns = document.getElementById(DOM_IGNORE_UNKNOWN_PITSTOPS_CHECK);
    return(excludeUnknowns && !excludeUnknowns.checked);
  };

};

(function(){
  new Main().init();
})();
