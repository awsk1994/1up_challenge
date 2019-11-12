# 1up Take Home Code Challenge

Demo Link: https://oneup-challenge-t1.herokuapp.com/view1

## Steps

0. "Use CORS-anywhere": COR header is not set in response from server, thus, need to use cors-anywhere or CORS plugin on browser to bypass CORS policy. If not using CORS browser plugin, you need to check the box here.
1. "Get User": This will get all the existing user from upHealth
2. "Create User": Alternatively, you can create your own user. Creating a user with same name as existing will return an error.
3. "Get SystemId": This is for the 5th step (Authorize Epic Login). But because this is a demo system and we only have access to Epic, the system code is hard coded.
4. "Get AccessCode from Existing User": This button will retrieve access code (oAuth2) from upHealth. The access code is used to authorize access from Epic and retrieve Patient data.
5. "Authorize Epic Login": Redirects to Epic website to authorize access.
6. "Access Client Data": Todo
7. "Create Patient data": creates patient data. Creating new patient with id of existing ones will result in error.
8. "Get Patient Data": Get patient data given the patient id.

## Steps to install and run on local:
1. npm install
2. npm start

## Todo
 - Modularize the html code into directives.
 - Beautify the front-end
 - Save client id and client secret encrypted somewhere in local drive (rather than in the code)

=========================================================================

# My NodeJS-And-AngularJS-Heroku-Seed Application

A barebones Node.js with AngularJS and MongoDB app.

This Application is meant to be deployed onto and run on [Heroku](https://www.heroku.com/).

Check it out live [Here](https://nodejs-angularjs-seed.herokuapp.com/)

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

1. Git bash at the directory.
2. Type "npm install"
3. Type "heroku local"

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Directory Layout

```
server.js					        --> server configuration file
app/                    	--> all of the source files for the application
  index.html				      --> app layout file (the main html template file of the app)
  css/           			    --> stylesheet location
    app.css					      --> default stylesheet
	bootstrap.min.css		    -->	bootstrap's css
	bootstrap-theme.min.css	--> bootstraps's theme css
  fonts/                	--> glyphicons for bootstrap
  js/                		  --> javascript files
    app.js              	--> main application module
	controllers/			      --> all controllers should be placed here
		NavbarController.js	  --> the main page controller
		View1Controller.js	  --> the controller for view1
		View2Controller.js	  --> the controller for view2
	directives/				      --> create and place directive files here
	services/				        --> create and place service files here
  lib/						        --> tools and frameworks should be placed here
  	angular/				        --> angularjs files
  		bootstrap.js		      --> bootstrap latest version (update if needed)
  		bootstrap.min.js	    -->	bootstrap latest version (update if needed)
  		jquery-1.12.0.js	    -->	jquery latest version (update if needed)
  models/					        --> create and place all model files here
  templates/				      --> all fiew files (html) should be placed here
  	main.html				        --> html template for the main page
  	view1.html				      --> html template for view1
  	view2.html				      --> html template for view2
```

## Documentation

Check out [The Wiki](https://github.com/yotamHak/NodeJS-And-AngularJS-Heroku-Seed/wiki) to get started and connect your Database.
