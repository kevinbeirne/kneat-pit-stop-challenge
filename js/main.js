

/**
*@class Entry point for the app
*/
function Main() {
}

Main.prototype.getCalculateButton = function() {

};

Main.prototype.init = function() {
  this.swApi = new SwApiManager();
  var calculateBtn = document.getElementById("mglt-calculate-btn");
  var ctx = this;

  if(calculateBtn){
  calculateBtn.addEventListener("click", function(evt) {
    ctx.getStarships().then(ctx.updatePitstops);
    }, false);
  }
};

Main.prototype.getDistance = function() {
  return document.getElementById("mglt-input").value;
};

Main.prototype.getStarships = function(ctx) {
  return this.swApi.getStarships();

};

Main.prototype.updatePitstops = function(res) {

  console.log("res");
  console.log(res);
console.log(res.length);
  var distance = 1000000;//this.getDistance();

  for(var i = 0; i < res.length; i++) {
    console.log(res[i]);

    var HOURS_PER_YEAR = 8766;
    var DAYS_PER_YEAR = 365;
    var WEEKS_PER_YEAR = 52;
    var MONTHS_PER_YEAR = 12;

    var AMOUNT = 0;
    var UNIT = 1;
    var consumables = res[i].consumables.split(" ");
    var consumablesInHours = -1;
    if(consumables.length == 2 && !isNaN(consumables[AMOUNT]) && typeof(consumables[UNIT] == "string")) {
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
    if(distance < 0 || consumablesInHours < 0 || res[i].MGLT == "unknown" || res[i].MGLT < 0){
      console.log("unknown");
    } else {
      console.log((distance / (res[i].MGLT * consumablesInHours)));
    }


  }
};

/**
* Reads the consumables string and returns how long they will last in hours
*/
Main.prototype.getConsumablesInHours = function(consumables) {

}


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
