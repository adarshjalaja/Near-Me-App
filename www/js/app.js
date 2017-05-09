//setup angular
var app = angular.module('scotch-todo', ['ionic', 'LocalStorageModule','ngCordova']);


 


  app.controller('main', function ($scope, $ionicModal,$ionicPlatform, localStorageService,$cordovaGeolocation,$http) { //store the entities name in a variable var taskData = 'task';





function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

 var posOptions = {timeout: 10000, enableHighAccuracy: true};

   $cordovaGeolocation
   .getCurrentPosition(posOptions)	
   .then(function (position) {
			      var lat  = position.coords.latitude
			      var long = position.coords.longitude
			      console.log(lat + '   ' + long)

			      //call http

			      var urlPlaceAPI = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+ lat + ',' + long +'&radius=500&type=restaurant&key=AIzaSyCW-5tzlsifSVVgS_4vyN8-H2HeI5CGLQo';
					 $http.get(urlPlaceAPI,{withCredentials: true})
			    .then(function(response) {
			        console.log(response);
			           if(response.data.results && response.data.results.length > 0) {
			           	   $.each(response.data.results, function( index, value ) {
  								
						var dist = getDistanceFromLatLonInKm(value.geometry.location.lat,value.geometry.location.lng,lat,long);
						//console.log(dist);
  								   $scope.nearItem = {

					        	title : value.name,
					        	content: value.vicinity,
					        	dist : dist.toFixed(1)
					        };
					          $scope.nearItems.push($scope.nearItem);
							});

					     
					      }

					       

					      });
			    


   }, function(err) {
      console.log(err)
   });

   var watchOptions = {timeout : 3000, enableHighAccuracy: false};
   var watch = $cordovaGeolocation.watchPosition(watchOptions);
	
   watch.then(
      null,
		
      function(err) {
         console.log(err)
      },
		
      function(position) {
         var lat  = position.coords.latitude
         var long = position.coords.longitude
         console.log(lat + '' + long)
      }
   );

   watch.clearWatch();


//initialize the tasks scope with empty array
$scope.nearItems = [];

//initialize the task scope with empty object
$scope.nearItem = {};



//configure the ionic modal before use
/*$ionicModal.fromTemplateUrl('new-task-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
}).then(function (modal) {
    $scope.newTaskModal = modal;
});*/

/*$scope.getTasks = function () {
          //fetches task from local storage
          if (localStorageService.get(taskData)) {
              $scope.tasks = localStorageService.get(taskData);
          } else {
              $scope.tasks = [];
          //}
   }

  $scope.openTaskModal = function() {
  	$scope.newTaskModal.show();
  }*/

/*$scope.createTask = function () {
	
	$scope.newTaskModal.hide();
          //creates a new task
          alert($scope.task);
          $scope.tasks.push($scope.task);
          localStorageService.set(taskData, $scope.tasks);
          alert(taskData);
          $scope.task = {};
          //close new task modal
          
   }
$scope.removeTask = function (index) {
          //removes a task
          $scope.tasks.splice(index, 1);
          localStorageService.set(taskData, $scope.tasks);
     }
$scope.completeTask = function (index) { 
 //updates a task as completed 
 if (index !== -1) {
  $scope.tasks[index].completed = true; 
 } 

  localStorageService.set(taskData, $scope.tasks); 
}*/
});
