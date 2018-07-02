import {Main} from '../src/js/main.js';

describe("Main", function() {
  var main;
  beforeEach(function() {
    main = new Main();
  });

  it("should say it's working", function() {


    expect(main.isWorking("App")).toBe(true);
  });
});
