//requirements
var request = require('request');
var express = require('express');
var jsonfile = require('jsonfile');
var open = require('open');
var fs = require('fs');

var jsonData = require('./config.json');

var app = express();
var port = 3000;

var urls = ['http://'+ jsonData.loginDetails.username + ':' + jsonData.loginDetails.password + '@' + jsonData.loginDetails.ctmGoServer + '/go/api/pipelines/Life-Bretton/history', 
            'http://'+ jsonData.loginDetails.username + ':' + jsonData.loginDetails.password + '@' + jsonData.loginDetails.ctmGoServer + '/go/api/pipelines/Life-Business-Signoff/history',
            'http://'+ jsonData.loginDetails.username + ':' + jsonData.loginDetails.password + '@' + jsonData.loginDetails.ctmGoServer + '/go/api/pipelines/Life-Regression/history',
            'http://'+ jsonData.loginDetails.username + ':' + jsonData.loginDetails.password + '@' + jsonData.loginDetails.ctmGoServer + '/go/api/pipelines/Life-UAT/history',
            'http://'+ jsonData.loginDetails.username + ':' + jsonData.loginDetails.password + '@' + jsonData.loginDetails.ctmGoServer + '/go/api/pipelines/Life-QA/history',
            'http://'+ jsonData.loginDetails.username + ':' + jsonData.loginDetails.password + '@' + jsonData.loginDetails.ctmGoServer + '/go/api/pipelines/Life-CI/history',];

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/src/views'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

var setup = function(){
  getLifeBreData();
  setTimeout(getLifeBreData, 1000);

  getLifeSignOffData();
  setTimeout(getLifeSignOffData, 1000);

  getLifeRegData();
  setTimeout(getLifeRegData, 1000);

  getLifeUatData();
  setTimeout(getLifeUatData, 1000);

  getLifeQaData();
  setTimeout(getLifeQaData, 1000);

  getLifeCiData();
  setTimeout(getLifeCiData, 1000);
};

/***********************************
** Fire off API calls for GOcd data
************************************/

// Get Life-Bretton json data and post to localhost:3000/assets/lifeBre
var getLifeBreData = function(){

    request.get(urls[0], function(err, res) {
      if(err) console.log(err);
      
      var response = res;

      //use express and send response to localhost:3000
      app.get('/assets/lifeBre', function (req, res) {
        var jsonResponse = JSON.parse(response.body);
        res.send(jsonResponse);   
    });
  });

  setTimeout(getLifeBreData, 50000);
};

// Get Life-Business-Signoff json data and post to localhost:3000/assets/lifeSignOff
var getLifeSignOffData = function() {
    request.get(urls[1], function(err, res) {
      if(err) console.log(err);
      
      var response = res;

      //use express and send response to localhost:3000
      app.get('/assets/lifeSignOff', function (req, res) {
        var jsonResponse = JSON.parse(response.body);
        res.send(jsonResponse);   
    });
  });

  setTimeout(getLifeSignOffData, 50000);
};

// Get Life-Regression json data and post to localhost:3000/assets/lifeReg
var getLifeRegData = function(){
    request.get(urls[2], function(err, res) {
      if(err) console.log(err);
      
      var response = res;

      //use express and send response to localhost:3000
      app.get('/assets/lifeReg', function (req, res) {
        var jsonResponse = JSON.parse(response.body);
        res.send(jsonResponse);   
    });
  });

  setTimeout(getLifeRegData, 50000);
};

// Get Life-UAT json data and post to localhost:3000/assets/lifeUat
var getLifeUatData = function() {
    request.get(urls[3], function(err, res) {
      if(err) console.log(err);
      
      var response = res;

      //use express and send response to localhost:3000
      app.get('/assets/lifeUat', function (req, res) {
        var jsonResponse = JSON.parse(response.body);
        res.send(jsonResponse);   
    });
  });

  setTimeout(getLifeUatData, 50000);
};

// Get Life-QA json data and post to localhost:3000/assets/lifeQa
var getLifeQaData = function() {
    request.get(urls[4], function(err, res) {
      if(err) console.log(err);
      
      var response = res;

      //use express and send response to localhost:3000
      app.get('/assets/lifeQa', function (req, res) {
        var jsonResponse = JSON.parse(response.body);
        res.send(jsonResponse);   
    });
  });

  setTimeout(getLifeQaData, 50000);
};

// Get Life-CI json data and post to localhost:3000/assets/lifeCi
var getLifeCiData = function() {
    request.get(urls[5], function(err, res) {
      if(err) console.log(err);
      
      var response = res;

      //use express and send response to localhost:3000
      app.get('/assets/lifeCi', function (req, res) {
        var jsonResponse = JSON.parse(response.body);
        res.send(jsonResponse);   
    });
  });

  setTimeout(getLifeCiData, 50000);
};

/************************************
** Send app to http://localhost:3000
*************************************/

setup();

app.listen(port, function (err) {
  console.log('Example app listening on port: ' + port);
});

open('http://localhost:3000');

