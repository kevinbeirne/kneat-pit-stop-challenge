SwApiManager = function(){

};
/**
* Gets all the starships from thje swapi
* @param {number} count The max number of starships we want to use
* @return {Object[]} The list of starships
*/
SwApiManager.prototype.getStarships = function(count) {
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
