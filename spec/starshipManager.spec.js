describe("StarshipManager consumables calculator", function() {
  var StarshipManager = require('../js/starshipManager.js');
  var starshipManager;

  beforeEach(() => {
    starshipManager = new StarshipManager();
  });

  it("should get starship consumables in hours", function() {
    var falcon = {//Values taken directly from api
      "consumables": "2 months"
    }, ywing = {
      "consumables": "1 week"
    }, deathStar = {
      "consumables": "3 years"
    };
    var HOURS_PER_YEAR = 8766;
    //Answers taken from Kneat Software Coding Challenge
    expect(starshipManager.getConsumablesInHours(falcon)).toBe(HOURS_PER_YEAR / 12 * 2);
    expect(starshipManager.getConsumablesInHours(ywing)).toBe(HOURS_PER_YEAR / 52);
    expect(starshipManager.getConsumablesInHours(deathStar)).toBe(HOURS_PER_YEAR * 3);

  });

  it("should tell us if it can't get starship consumables", function() {
    var invalidConsumables = {
      "consumables": {}
    },
    empty = {
    },
    invalidAmount = {
      "consumables": "8 cats"
    },
    invalidUnit = {
      "consumables": "cat weeks"
    };
    expect(starshipManager.getConsumablesInHours(invalidConsumables)).toBe(-1);
    expect(starshipManager.getConsumablesInHours(empty)).toBe(-1);
    expect(starshipManager.getConsumablesInHours(invalidAmount)).toBe(-1);
    expect(starshipManager.getConsumablesInHours(invalidUnit)).toBe(-1);

  });
});

describe("StarshipManager pitstop calculator", function() {
    var StarshipManager = require('../js/starshipManager.js');
    var starshipManager;
    var millionMGLT = 1000000;

    beforeEach(() => {
      starshipManager = new StarshipManager();
    });

    it("should get pitstops needed", function() {
      var falcon = {//Values taken directly from api
        "consumables": "2 months",
        "MGLT": "75"
      }, ywing = {
        "consumables": "1 week",
        "MGLT": "80"
      }, rebelTransport = {
        "consumables": "6 months",
        "MGLT": "20"
      };
      //Answers taken from Kneat Software Coding Challenge
      expect(starshipManager.getPitstopsNeeded(falcon, millionMGLT)).toBe(9);
      expect(starshipManager.getPitstopsNeeded(ywing, millionMGLT)).toBe(74);
      expect(starshipManager.getPitstopsNeeded(rebelTransport, millionMGLT)).toBe(11);

    });

    it("should tell us if it can't get pitstops needed", function() {
      var noConsumables = {
        "MGLT": "75"
      }, noMGLT = {
        "consumables": "1 week",
      }, unknownMGLT = {
        "consumables": "6 months",
        "MGLT": "unknown"
      },
      unknownConsumables = {
        "consumables" : "unknown",
        "MGLT": "50"
      },
      invalidMGLT = {
        "consumables": "6 months",
        "MGLT": "cat"
      },
      invalidConsumables = {
        "consumables": "cat",
        "MGLT": "20"
      },
      invalid = {
        "consumables": {},
        "MGLT": {}
      },
      empty = {
      };
      expect(starshipManager.getPitstopsNeeded(noConsumables, millionMGLT)).toBe(-1);
      expect(starshipManager.getPitstopsNeeded(noMGLT, millionMGLT)).toBe(-1);
      expect(starshipManager.getPitstopsNeeded(unknownConsumables, millionMGLT)).toBe(-1);
      expect(starshipManager.getPitstopsNeeded(invalidMGLT, millionMGLT)).toBe(-1);
      expect(starshipManager.getPitstopsNeeded(invalidConsumables, millionMGLT)).toBe(-1);
      expect(starshipManager.getPitstopsNeeded(invalid, millionMGLT)).toBe(-1);
      expect(starshipManager.getPitstopsNeeded(empty, millionMGLT)).toBe(-1);
    });
});

describe("StarshipManager starship loader", function() {
  var StarshipManager = require('../js/starshipManager.js');
  var starshipManager;
  var xhr;
  var urls;
  beforeEach(() => {
    starshipManager = new StarshipManager();
    xhr = {//create dummy XMLHttpRequest
      header: {},
      open: function(_type_, _url_) {
        xhr.status = urls[_url_].status;
        xhr.responseText = urls[_url_].responseText;
        xhr.statusText = urls[_url_].statusText;
      },
      send: function() {
        setTimeout(xhr.onload, 1);
      },
      setRequestHeader: function(header, value) {
      },
      onload: function(){},
      ontimeout: function(){}
    };
    urls = {};
      XMLHttpRequest = jasmine.createSpy(xhr).and.returnValue(xhr);
  });

  it("should provide starships", function(done) {
    var results = [{"name":"ships1"}];
    urls = {
      'https://swapi.co/api/starships/': {
        responseText: JSON.stringify({count:37,next:"https://swapi.co/api/starships/?page=2",previous:null,results:results}),
        status: 200
      }
    };
    starshipManager.loadMoreStarships().then(function(response) {
      expect(response).toEqual(results);
      done();
    }, function() {
      fail("Shouldn't reject promise");
    });
  });

  it("should change the starships it provides based on the next parameter", function(done) {
    var results1 = [{"name":"ships1"}];
    var results2 = [{"name":"ships2"}];
    urls = {
      "https://swapi.co/api/starships/": {
        responseText: JSON.stringify({count:37,next:"https://swapi.co/api/starships/?page=2",previous:null,results:results1}),
        status: 200
      },
      "https://swapi.co/api/starships/?page=2": {
        responseText: JSON.stringify({count:37,next:"https://swapi.co/api/starships/?page=3",previous:null,results:results2}),
        status: 200
      }
    };
    starshipManager.loadMoreStarships().then(function(response) {
      expect(response).toEqual(results1);
      starshipManager.loadMoreStarships().then(function(response) {
        expect(response).toEqual(results2);
        done();
      }, function() {
        fail("Shouldn't reject promise");
      });
    }, function() {
      fail("Shouldn't reject promise");
    });
  });

  it("Should provide the first set of starships if we reset it", function(done) {
    var results1 = [{"name":"ships1"}];
    var results2 = [{"name":"ships2"}];
    urls = {
      "https://swapi.co/api/starships/": {
        responseText: JSON.stringify({count:37,next:"https://swapi.co/api/starships/?page=2",previous:null,results:results1}),
        status: 200
      },
      "https://swapi.co/api/starships/?page=2": {
        responseText: JSON.stringify({count:37,next:"https://swapi.co/api/starships/?page=3",previous:null,results:results2}),
        status: 200
      }
    };
    starshipManager.loadMoreStarships(false).then(function(response) {
      expect(response).toEqual(results1);
      starshipManager.loadMoreStarships(true).then(function(response) {
        expect(response).toEqual(results1);
        done();
      });
    });
  });

  it("should tell us when there are no more starships to fetch", function(done) {
    var results1 = [{"name":"ships1"}];
    var results2 = [{"name":"ships2"}];
    urls = {
      "https://swapi.co/api/starships/": {
        responseText: JSON.stringify({count:37,next:null,previous:null,results:results1}),
        status: 200
      }
    };
    starshipManager.loadMoreStarships(false).then(function(response) {
      expect(response).toEqual(results1);
      var shouldBeNull = starshipManager.loadMoreStarships(false);
      expect(shouldBeNull).toBe(null);
      done();
    });
  });
/*
  it("should tell us if the reponse didn't have starships in it", function(done) {
    var results1 = [{"name":"ships1"}];
    var results2 = [{"name":"ships2"}];
    urls = {
      "https://swapi.co/api/starships/": {
        responseText: JSON.stringify({count:37,next:null,previous:null}),
        status: 200
      }
    };
    starshipManager.loadMoreStarships(false).then(function() {
      fail("Shouldn't resolve");
    }, function(response) {//rejected it's promise
      done();
    });

  });*/

});
