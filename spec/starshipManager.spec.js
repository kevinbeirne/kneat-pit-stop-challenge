var StarshipManager = require('../js/starshipManager.js');


describe("StarshipManager", function() {

  var starshipManager = new StarshipManager();
  var millionMGLT = 1000000;
  beforeEach(function() {


    //jasmine.getFixtures().fixturesPath = 'fixtures/';
    //jasmine.getFixtures().load('main.html');
    //main = new Main();
  });

  it("should load starships", function() {
    //starshipManager.
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

  it("shouldn't convert to hours?", function() {
  var HOURS_PER_YEAR = 8766;
    expect(starshipManager.convertToHours(1, "weeks").toBe(HOURS_PER_YEAR / 52));
  });

});
