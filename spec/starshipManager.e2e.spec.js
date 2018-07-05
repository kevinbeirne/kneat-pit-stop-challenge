describe("StarshipManager e2e", function() {
  var StarshipManager = require('../js/starshipManager.js');
  var starshipManager;
  var xhr;
  var urls;
  var REJECT_PROMISE_FAIL = "Test failed: Shouldn't reject promise";

  beforeEach(() => {
    starshipManager = new StarshipManager();
    xhr = {//create dummy XMLHttpRequest
      header: {},
      open: function(_type_, _url_) {
        xhr.status = urls[_url_].status;
        xhr.responseText = urls[_url_].responseText;
        xhr.statusText = urls[_url_].statusText;
      },
      send: () => setTimeout(xhr.onload, 1),
      setRequestHeader: (header, value) => {},
      onload: () => {},
      ontimeout: () =>{}
    };
    urls = {};
    /*Simulate XMLHttpRequest
    NOTE: Simplicitic implementation only suitable for these tests.*/
    XMLHttpRequest = jasmine.createSpy(xhr).and.returnValue(xhr);
  });

  it("should be able to calculate how many pitstops each ship will need to travel the SAMPLE_DISTANCE", function(done) {
    var SAMPLE_DISTANCE = 1000000;//1 millionMGLT
    //Taken directly from api
    var results1 = [{"name":"Millenium Falcon", "consumables": "2 months", "MGLT": "75"}];
    var results2 = [{"name":"Y-Wing", "consumables": "1 week", "MGLT": "80"}];
    var results3 = [{"name":"Rebel transport", "consumables": "6 months","MGLT": "20"}];
    var baseUrl = starshipManager.getStarshipApiUrl();
    urls[baseUrl] = {//responses
      responseText: JSON.stringify({count:1,next: baseUrl + "?page=2",previous:baseUrl,results:results1}),
      status: 200
    };
    urls[baseUrl +  "?page=2"] = {
      responseText: JSON.stringify({count:1,next: baseUrl + "?page=3",previous:baseUrl + "?page=2",results:results2}),
      status: 200
    };
    urls[baseUrl + "?page=3"] = {
      responseText: JSON.stringify({count:1,next: null,previous:baseUrl +  "?page=2",results:results3}),
      status: 200
    };
    var starships = [];
    var finalResults = [];
    var loadMoreResults = function(results) {
      if(results) {
        starships.push(...results);
      }

      var response = starshipManager.loadMoreStarships();
      if(response) {
        response.then(loadMoreResults, () => fail(REJECT_PROMISE_FAIL));
      }
      else {//response null so should have all the starships
        starships.forEach((starship) => {
          finalResults.push({"ship": starship, "pitstops":starshipManager.getPitstopsNeeded(starship, SAMPLE_DISTANCE)});
        });
        //Answers taken from Kneat Software Coding Challenge
        expect(finalResults).toEqual([{"ship":results1[0], "pitstops":9},
                                      {"ship":results2[0], "pitstops":74},
                                      {"ship":results3[0], "pitstops":11}]);
        done();
      }
    };
    loadMoreResults(null);
  });
});
