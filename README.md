# Kneat Coding Challenge
This is Kevin Beirne's submission for the kneat coding challenge.

This is a web app that will calculate the number of pit stops different kinds of starships will need to travel a mega light distance provided by the user. There is an additional option to ignore any ships whose number of pit stops we cannot calculate.

## Technology
- This app was compiled with browserify and served with express (nodejs)
- The tests were run with jasmine (using javascript)
- The docs were generated with jsdoc
- The project is built and served using npm

## Installation
You can run this application by building it with npm. If you don't wish to use node you can also [download](https://drive.google.com/open?id=1cBBlprGDxPBrTRRymXBh1A0-ltruFl9X) a version with the app, docs and tests precompiled.
### To build it yourself
- Make sure you have a working version of [node](https://nodejs.org)
- Clone this repository
- Open the repository folder and run 
``npm install``
``npm run build``
  - To run the app: 
``npm start`` 
 and then either navigate to localhost:3000 or open index.html file in a browser directly (either will work)
 
  - To run the tests:
``npm run tests``

  - To build the docs:
``npm run docs``
then open the docs/index.html folder to see the compiled docs

### To access the precompiled version
- Download the zip file [here](https://drive.google.com/open?id=1cBBlprGDxPBrTRRymXBh1A0-ltruFl9X) and extract it somewhere
- To see the app running open index.html
- To run the tests open jasmine/specRunner.html
- To view the docs open docs/index.html
- **NOTE:** You will not be able to rebuild the app, tests or docs with this precompiled version

## Navigating
* The code most pertinent to the project requirements is contained in js/starshipManager.js
* The code for the app which uses StarshipManager to display the results is in js/main.js
* The corresponding html is in index.html
* CSS is in css/
* Tests can be found in spec/
* **NOTE:** If you downloaded the precompiled version of this application, ignore the specs in /jasmine/spec as these have been are compiled versions


## Other notes
* If I were to extend this webapp any further I would likely use a web framework, a CSS preprocessor, an es compiler and more. (We can discuss my experience with these technologies in interview.) However, I have used as few libraries as possible to reduce the project's complexity and to demonstrate my core javascript skills.