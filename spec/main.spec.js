//require('../js/starshipManager.js');


describe("Main", function() {
  var main = require('../js/main.js');
  beforeEach(function() {
    console.log("main");
    console.log(main);
    //jasmine.getFixtures().fixturesPath = 'fixtures/';
    //jasmine.getFixtures().load('main.html');
    //main = new Main();
  });

  it("should say it's working", function() {

    expect(main.isWorking("App")).toBe(true);
  });
});
