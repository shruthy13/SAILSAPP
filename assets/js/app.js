var myApp = angular.module("myApp",['ui.router','720kb.datepicker','ui.timepicker']);
myApp.factory('theService', function() {  
	return {
		details : {
      id : "",
			name : "",
      email: "",
      phone: "",
      source: "",
      destination: ""
		}
	};
});

myApp.directive("myMaps", function(){
	return {
		restrict:'E',
		template:'<div></div>',
		replace:true,
		link:function(scope, element, attrs){
      
       //alert("Test 1sai")
		
			  }
			
		};
	});

myApp.controller('calculateDistanceController',function($scope, $http, $location, $state,theService)
{
   //alert("Test 2")
$scope.GetRoute = function() {
             theService.details.source = document.getElementById("txtSource").value;
             theService.details.destination = document.getElementById("txtDestination").value;
             
           // var mumbai = new google.maps.LatLng(18.9750, 72.8258);
            var mapOptions = {
                zoom: 7
                
            };
            map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
            directionsDisplay.setMap(map);
            directionsDisplay.setPanel(document.getElementById('dvPanel'));

            //*********DIRECTIONS AND ROUTE**********************//
            source = document.getElementById("txtSource").value;
            destination = document.getElementById("txtDestination").value;
            var modeTravel = google.maps.DirectionsTravelMode.DRIVING;
            var request = {
                origin: source,
                destination: destination,
                travelMode: modeTravel
            };
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                }
            });

            //*********DISTANCE AND DURATION**********************//
            var service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix({
                origins: [source],
                destinations: [destination],
                travelMode: modeTravel,
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false
            }, function (response, status) {
                if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
                    var distance = response.rows[0].elements[0].distance.text;
                    theService.details.distance = distance;
                    var duration = response.rows[0].elements[0].duration.text;
                    var dvDistance = document.getElementById("dvDistance");
                  
                    var totalCost = parseFloat(distance)*15;
                 // alert(parseInt(distance)*15+"Test");
                    dvDistance.innerHTML = "";
                    dvDistance.innerHTML += "Distance: " + distance + "<br />";
                    dvDistance.innerHTML += "Duration:" + duration  + "<br />";
                    dvDistance.innerHTML += "You Pay:" + totalCost;
                } else {
                    alert("Unable to find the distance via road.");
                }
            });
        };
});
myApp.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/employee");
  //
  // Now set up the states
  $stateProvider
    .state('employee', {
      url: "/employee",
      templateUrl: "templates/Taxi_Index.html",
      controller : "angEmployeeController"
    })
   .state('distcalc', {
      url: "/distcalc",
      templateUrl: "templates/DistanceCalculator.html",
      controller : "calculateDistanceController"
    })
    .state('confirmBook', {
      url: "/confirmBooking",
      templateUrl: "templates/ConfirmBooking.html",
      controller : "confirmBookingController"
    })
});

myApp.controller('angEmployeeController',function($scope, $http, $location, $state,theService){
 function resetItem(){
   $scope.employee = {
      name : '',
       email : '',
      phone : '',
       id : ''
   };             
   $scope.displayForm = '';
}
resetItem();
   $scope.addItem = function () {
   resetItem();
//   // $scope.displayForm = true;
 }
 
 
 $scope.saveItem = function () {
  
   var emp = $scope.employee;
       if (emp.id.length == 0){
            $http.get('/employee/create?name=' + emp.name + '&email=' +  emp.email + '&phone='+ emp.phone+ '&source=' + emp.source + '&destination' + emp.destination + '&distance' + emp.distance).success(function(data) {
              //  alert(emp.name+ "angEmpCtroller");
               theService.details=data;
             //   theService.details.name=emp.name;
              //  alert(theService.details.source+ "angEmpCtroller");
              $scope.items.push(data);
             
             
              //alert("Check"+data.name+data.source+data.destination);
            //  $scope.displayForm = '';
              resetItem();
               //removeModal();
            }).
  error(function(data, status, headers, config) {
               // alert("Check Error");
    alert(data.summary);
  });
         }
          else{
            $http.get('/employee/update/'+ emp.id +'?name=' + emp.name + '&email=' +  emp.email + '&phone='+ emp.phone+ '&source=' + emp.source + '&destination' + emp.destination + '&distance' + emp.distance).success(function(data) {
              $scope.displayForm = '';
               removeModal();
             }).
  error(function(data, status, headers, config) {
    alert(data.summary);
 });
          }
         };
 
 $scope.editItem = function (data) {      
         $scope.employee = data;
        $scope.displayForm = true;
 }
 
        $scope.removeItem = function (data) {
           if (confirm('Do you really want to delete?')){
             $http['delete']('/employee/' + data.id).success(function() {
              $scope.items.splice($scope.items.indexOf(data), 1);
            });
          }
        };
 
       /*  $http.get('/employee/find').success(function(data) {
           for (var i = 0; i < data.length; i++) {
            data[i].index = i;
          }
          $scope.items = data;
        });*/
 
        function removeModal(){
          $('.modal').modal('hide');         
       }
      
     $scope.goNext = function (hash) { 
 $location.path(hash);
       
  }
   });

myApp.controller('confirmBookingController',function($scope, $http, $location, $state,theService)
{
   $scope.sendMail = function (){
    // alert("Am here");
     var nodemailer = require("/node_modules/nodemailer/src/nodemailer.js");

    var smtpTransport = nodemailer.createTransport("SMTP",{
       service: "Gmail",
       auth: {
           user: "ndnancy643@gmail.com",
           pass: "eewwee"
       }
    });
     
           smtpTransport.sendMail({
         from: "Test <ndnancy643@gmail.com>", // sender address
         to: "shruthy <shruthyv@visualbi.com>", // comma separated list of receivers
         subject: "Hello ✔", // Subject line
         text: "Hello world ✔" // plaintext body
      }, function(error, response){
         if(error){
             console.log(error);
           alert(error + "Hi")
         }else{
             console.log("Message sent: " + response.message);
            alert(response.message + "YEs")
         }
      });
   }
});
//var module = angular.module("angular-google-maps-example", ["google-maps"]);
	
// myApp.controller("angEmployeeController",angEmployeeController);
// //myApp.controllers(controllers);
// myApp.controller('calcController', function($scope) {
//   console.log("Test wer ewrwer");
//          alert("Sai BABA blesses you FINALLY")
    // });
    // configure our routes
//     myApp.config(['$routeProvider',function($routeProvider) {
     
//         $routeProvider

//             // route for the home page
//             .when('/employee', {
//                 templateUrl : 'templates/Taxi_Index.html',
//                 controller  : 'angEmployeeController'
//             })

//             // route for the about page
//             .when('/distcalc', {
           
//                 templateUrl : '/templates/DistanceCalculator.html',
//                 controller  : 'calcController'
//             })
//          .otherwise({
//         redirectTo: '/employee'
//       });
//     }]);

//   var angEmployeeController=function($scope, $http, $location, $state){
// function resetItem(){
//    $scope.employee = {
//       name : '',
//       email : '',
//      phone : '',
//       id : ''
//    };             
//    $scope.displayForm = '';
   
// }
// resetItem();
 
//  $scope.addItem = function () {
//    resetItem();
//   // $scope.displayForm = true;
//  }
 
 
// $scope.saveItem = function () {
//   var emp = $scope.employee;
//       if (emp.id.length == 0){
//             $http.get('/employee/create?name=' + emp.name + '&email=' +  emp.email + '&phone='+ emp.phone).success(function(data) {
//               $scope.items.push(data);
//             //  $scope.displayForm = '';
//               resetItem();
//               //removeModal();
//             }).
//   error(function(data, status, headers, config) {
//     alert(data.summary);
//   });
//           }
//           else{
//             $http.get('/employee/update/'+ emp.id +'?name=' + emp.name + '&email=' +  emp.email + '&phone='+ emp.phone  ).success(function(data) {
//               $scope.displayForm = '';
//               removeModal();
//             }).
//   error(function(data, status, headers, config) {
//     alert(data.summary);
//   });
//           }
//         };
 
// $scope.editItem = function (data) {      
//         $scope.employee = data;
//         $scope.displayForm = true;
// }
 
//         $scope.removeItem = function (data) {
//           if (confirm('Do you really want to delete?')){
//             $http['delete']('/employee/' + data.id).success(function() {
//               $scope.items.splice($scope.items.indexOf(data), 1);
//             });
//           }
//         };
 
//         $http.get('/employee/find').success(function(data) {
//           for (var i = 0; i < data.length; i++) {
//             data[i].index = i;
//           }
//           $scope.items = data;
//         });
 
//         function removeModal(){
//           $('.modal').modal('hide');         
//       }
      
//     $scope.goNext = function (hash) { 
// $location.path(hash);
//       alert("Sai BABA blesses you");
//  }
//   };
// myApp.controller("angEmployeeController",angEmployeeController);
// //myApp.controllers(controllers);
// myApp.controller('calcController', function($scope) {
//   console.log("Test wer ewrwer");
//          alert("Sai BABA blesses you FINALLY")
//     });
