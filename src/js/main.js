
/**
*@class Entry point for the app
*/
function Main() {

  console.log("loading");
  this.swApi = new SwApiManager();

  var ctx = this;
  document.getElementById("#mglt-calculate-btn").addEventListener("click", function(evt) {
    console.log("clicked!");
    /*var shipPromise = ctx.swApi.getStarships();
    shipPromise.then(function(res) {
      console.log("res");
      console.log(res);
    });*/
  }, false);
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
