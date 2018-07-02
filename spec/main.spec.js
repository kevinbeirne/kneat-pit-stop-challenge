//require('../js/swApiManager.js');
//require('../js/main.js');

describe("Main", function() {
  var main;
  beforeEach(function() {
    console.log("jasmine");
    console.log(jasmine);
    jasmine.getFixtures().fixturesPath = 'fixtures/';
    jasmine.getFixtures().load('main.html');
    main = new Main();
  });

  it("should say it's working", function() {


    expect(main.isWorking("App")).toBe(true);
  });
});
