var app = angular.module('goBuild', []);

app.controller('MainController', function($scope, $http) {

    $scope.getReleaseCandidate = function(data){
        var bretton =  data[0].data;
        var signOff = data[1].data;
        var regression = data[2].data;
        var uat = data[3].data;
        var qa = data[4].data;

        var releaseCandidate = {};

        var revision = bretton.pipelines[0].build_cause.material_revisions[0].modifications[0].revision;
        var revisionId = $scope.getIdFromString(revision);
        releasedRegressionRevisionId = parseInt($scope.searchForLabel(revisionId, signOff.pipelines));
        
        var revision = regression.pipelines[0].label;
        revisionId = parseInt(revision);

        if (revisionId == releasedRegressionRevisionId)
        {
            releaseCandidate.approver = regression.pipelines[0].stages[0].approved_by;

            revision = regression.pipelines[0].build_cause.material_revisions[0].modifications[0].revision;
            revisionId = $scope.getIdFromString(revision);

            revisionId = $scope.searchForLabel(revisionId, uat.pipelines);
            revisionId = $scope.searchForLabel(revisionId, qa.pipelines);

            releaseCandidate.revisionId = revisionId;
        }

        return releaseCandidate;
    }

    $scope.getRelease = function(data, index){
        var bretton =  data[0].data;
        var signOff = data[1].data;
        var regression = data[2].data;
        var uat = data[3].data;
        var qa = data[4].data;

        var release = {};

        release.date = $scope.formatDate(bretton.pipelines[index].build_cause.material_revisions[0].modifications[0].modified_time);
        release.approver = bretton.pipelines[index].stages[0].approved_by;

        var revision = bretton.pipelines[index].build_cause.material_revisions[0].modifications[0].revision;
        var revisionId = $scope.getIdFromString(revision);

        revisionId = $scope.searchForLabel(revisionId, signOff.pipelines);
        revisionId = $scope.searchForLabel(revisionId, regression.pipelines);
        revisionId = $scope.searchForLabel(revisionId, uat.pipelines);
        revisionId = $scope.searchForLabel(revisionId, qa.pipelines);

        release.revisionId = revisionId;

        return release;
    }

    $scope.processData = function(data)
    {
        $scope.releaseCandidate = $scope.getReleaseCandidate(data);
        $scope.currentRelease = $scope.getRelease(data, 0);
        $scope.previousRelease = $scope.getRelease(data, 1);

        $scope.$apply();
        //setTimeout($scope.setDateAndName, 60000);
    }

    $scope.setDateAndName = function() {
        
        Promise.all([
            $http.get("/assets/lifeBre"),
            $http.get("/assets/lifeSignOff"),
            $http.get("/assets/lifeReg"),
            $http.get("/assets/lifeUat"),
            $http.get("/assets/lifeQa")
            ]).then($scope.processData);
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

        // split the date into parts [0] = mm, [1] = dd, [2] = yyyy
        var parts = formattedDate.split('/');
        // extract date components 
        var day = parts[1];
        var month = parts[0];
        var year = parts[2];
        // reassemble date
        var restructuredDate = day + '/' + month + '/' + year;
        //return restructure date
        return restructuredDate;
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

    $scope.setDateAndName();
});