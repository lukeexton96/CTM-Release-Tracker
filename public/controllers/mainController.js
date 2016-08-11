var app = angular.module('goBuild', []);

app.controller('MainController', function($scope, $http) {

    $scope.setDateAndName = function() {
        $http.get("/assets/lifeBre").success(function(response) {
            var dataResponse = response.pipelines;
            
    /***********
        Dates
    ************/

    // Current Release Date
            var currentDateFromData = dataResponse[0].build_cause.material_revisions[0].modifications[0].modified_time;
            // format the date
            var currentFormattedDate = $scope.formatDate(currentDateFromData);
            // assign the newly structure date to the $scope variable
            $scope.currentReleaseDate = $scope.restructureDate(currentFormattedDate);

    // Last Release Date
            var lastDateFromData = dataResponse[1].build_cause.material_revisions[0].modifications[0].modified_time;      
            // format the date 
            var lastFormattedDate = $scope.formatDate(lastDateFromData);
            // assign the newly structure date to the $scope variable
            $scope.lastReleaseDate = $scope.restructureDate(lastFormattedDate);

    /***********
        Names
    ************/

    // Current Release Name 
            var currentRelNameFromData = dataResponse[0].stages[0].approved_by;
            $scope.currentReleaseName = currentRelNameFromData; //here is where we assign the name

    // Last Release Name 
            var lastRelNameFromData = dataResponse[1].stages[0].approved_by;
            $scope.lastReleaseName = lastRelNameFromData; //here is where we assign the name
        });

        setTimeout($scope.setDateAndName, 50000);
    };

/************************ 
Get all appropriate data
*************************/



   $scope.getBreData = function() { 
       $http.get("/assets/lifeBre").success(function(response) {
        $scope.breData = response.pipelines;

    // Current Release Id
        $scope.currentReleaseId = $scope.getCurrentReleaseId();

    // Last Release Id
        $scope.lastReleaseId = $scope.getLastReleaseId();
     });

     setTimeout($scope.getBreData, 50000);
   };

    $scope.getSignOffData = function() {
        $http.get("/assets/lifeSignOff").success(function(response) {
            $scope.signOffData = response.pipelines;
        });

        setTimeout($scope.getSignOffData, 50000);
    };
    
    $scope.getRegData = function() { 
        $http.get("/assets/lifeReg").success(function(response) {
            $scope.regData = response.pipelines;
        });

        setTimeout($scope.getRegData, 50000);        
    };

    $scope.getLifeUatData = function() {
        $http.get("/assets/lifeUat").success(function(response) {
            $scope.uatData = response.pipelines;
        });

        setTimeout($scope.getLifeUatData, 50000);
    };

    $scope.getLifeQaData = function() { 
        $http.get("/assets/lifeQa").success(function(response) {
            $scope.qaData = response.pipelines;
        });

        setTimeout($scope.getLifeQaData, 50000);
    };

    $scope.getLifeCiData = function() {
        $http.get("/assets/lifeCi").success(function(response) {
            $scope.ciData = response.pipelines;
        });

        setTimeout($scope.getLifeCiData, 50000);
    };

/************************
   Release Numbers (ids)
 ************************/


   $scope.getCurrentReleaseId = function(){
    // assign variables to get labels
        var signOffString = $scope.breData[0].build_cause.material_revisions[0].modifications[0].revision;
    // split revision label from Life-Bretton data ready to search for in Life-Business-Signoff
        var businessSignOffId = $scope.getIdFromString(signOffString);

    // Here's the label I'm looking for, find me where that label is, then tell me the revision of that label, then pass it into next method
        // get the ID to search for in Regression data
        var regressionId = $scope.searchForLabel(businessSignOffId, $scope.signOffData);
        // get the ID to search for in UAT Data 
        var uatId =  $scope.searchForLabel(regressionId, $scope.regData);
        // get the ID to search for in QA Data 
        var qaId =  $scope.searchForLabel(uatId, $scope.uatData);
        // get the ID to search for in Ci Data 
        var ciId =  $scope.searchForLabel(qaId, $scope.qaData);        

        // assign Life-CI number (ID) to currentReleaseID variable
        var currentReleaseId = ciId;
    
    //return current sign off ID for angular to display
        return currentReleaseId;
    };

    $scope.getLastReleaseId = function(){       
    // assign variables to get labels
        var signOffString = $scope.breData[1].build_cause.material_revisions[0].modifications[0].revision;
    // split revision label from Life-Bretton data ready to search for in Life-Business-Signoff
        var businessSignOffId = $scope.getIdFromString(signOffString);

    // Here's the label I'm looking for, find me where that label is, then tell me the revision of that label, then pass it into next method
        // get the ID to search for in Regression data
        var regressionId = $scope.searchForLabel(businessSignOffId, $scope.signOffData);
        // get the ID to search for in UAT Data 
        var uatId =  $scope.searchForLabel(regressionId, $scope.regData);
        // get the ID to search for in QA Data 
        var qaId =  $scope.searchForLabel(uatId, $scope.uatData);
        // get the ID to search for in Ci Data 
        var ciId =  $scope.searchForLabel(qaId, $scope.qaData);        

        // assign Life-CI number (ID) to currentReleaseID variable
        var lastReleaseId = ciId;
    
    //return current sign off ID for angular to display
        return lastReleaseId;
    };

/************
   Helpers
 ************/

// Format date
    $scope.formatDate = function(data){
        // Take the unformatted date and assign it to Date() datatype then format
        var unformattedDate = new Date(data);
        // Shorten date to just mm/dd/yyyy
        var formattedDate = unformattedDate.toLocaleDateString();

        return formattedDate;
    };

// Restructure date
    $scope.restructureDate = function(date){
        // split the date into parts [0] = mm, [1] = dd, [2] = yyyy
        var parts = date.split('/');
        // extract date components 
        var day = parts[1];
        var month = parts[0];
        var year = parts[2];
        // reassemble date
        var restructuredDate = day + '/' + month + '/' + year;
        //return restructure date
        return restructuredDate
    };

// get build label from revision string from JSON model
    $scope.getIdFromString = function(stringData){
        var parts = stringData.split('/');
        var dataId = parts[1];

        return dataId;
    };

// find matching label 
    $scope.searchForLabel = function(wantedLabel, jsonData){

        var arrayIndex;

        for (var i = 0; i < jsonData.length; i++)
        {   
            if(jsonData[i].label == wantedLabel)
            {
                arrayIndex = i;
                break;
            }
        }

        // get next revision string from json data
        var nextRevisionString = jsonData[arrayIndex].build_cause.material_revisions[0].modifications[0].revision;
        // split and extract just the label number 
        var nextRevisionId = $scope.getIdFromString(nextRevisionString);
        //return the next label number 
        return nextRevisionId;
    };

    $scope.setup = function(){
        $scope.setDateAndName();
        setTimeout($scope.setDateAndName, 1000);

        $scope.getBreData();
        setTimeout($scope.getBreData, 1000);

        $scope.getSignOffData();
        setTimeout($scope.getSignOffData, 1000);

        $scope.getRegData();
        setTimeout($scope.getRegData, 1000);

        $scope.getLifeUatData();
        setTimeout($scope.getLifeUatData, 1000);

        $scope.getLifeQaData();
        setTimeout($scope.getLifeQaData, 1000);

        $scope.getLifeCiData();
        setTimeout($scope.getLifeCiData, 1000);

    };

    $scope.setup();
});