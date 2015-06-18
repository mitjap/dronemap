
angular.module('drone-supervisor-app', ['ngMaterial', 'ui.router', 'uiGmapgoogle-maps', 'geolocation'])
.config(function($stateProvider, $urlRouterProvider, $mdIconProvider) {
	$urlRouterProvider.otherwise('/map');
	
  	$stateProvider.state('map', {
      url: '/map',
	  controller: 'main',
      templateUrl: 'partials/main.html'
    });
  
    $mdIconProvider
      .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
      .defaultIconSet('img/icons/sets/core-icons.svg', 24);
})
.run(function($rootScope, $location, $window){
	$rootScope.$on('$stateChangeSuccess', function(event){
		if (!$window.ga) return;
		$window.ga('send', 'pageview', { page: $location.path() });
	});
})
.controller('main', function($scope, uiGmapGoogleMapApi, geolocation) {
    $scope.center = { latitude: 45, longitude: -73 };
	$scope.zoom = 8;
  
    $scope.drawingManagerControl = {};
    $scope.options = {scrollwheel: false};
  
    $fab = {
      isOpen: false
    }
    
    $scope.draw = function(mode) {
      var modeMap = {
        circle: google.maps.drawing.OverlayType.CIRCLE,
        polygon: google.maps.drawing.OverlayType.POLYGON,
        rectangle: google.maps.drawing.OverlayType.RECTANGLE
      }
      
      var manager = $scope.drawingManagerControl.getDrawingManager()
      manager.setDrawingMode(modeMap[mode]);
      google.maps.event.addListener(manager, 'circlecomplete', $scope.disableDraw);
      google.maps.event.addListener(manager, 'rectanglecomplete', $scope.disableDraw);
      google.maps.event.addListener(manager, 'polygoncomplete', $scope.disableDraw);
    };
  
    $scope.disableDraw = function(event) {
      console.log('disabledraw', event);
      console.log('$scope.drawingManagerControl', $scope.drawingManagerControl);
      $scope.drawingManagerControl.getDrawingManager().setDrawingMode(undefined);  
    }
	

	uiGmapGoogleMapApi.then(function(maps) {

      $scope.drawingManagerOptions = {
        circleOptions: {
          editable: true  
        },
        polygonOptions: {
          editable: true  
        },
        rectangleOptions: {
          editable: true  
        }
      };
    }).then(function() {

    });
	
	geolocation.getLocation().then(function(data) {
		$scope.fit = false;	
		$scope.center = {
		  latitude: data.coords.latitude,
		  longitude: data.coords.longitude
	  	};
      	$scope.zoom = 14;
    });
});