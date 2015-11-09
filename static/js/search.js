angular.module('app', [])
  .controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {

    // Map instance
    var map;

    /*
    get map bounds of the given Service Area. it's used to center map based on a Service Area
     */
    function getBoundsOfArea(area) {
      var coords = area.path.coordinates;
      var bounds = new google.maps.LatLngBounds();
      var point;
      for (var i = 0; i < coords.length; i++) {
        for (var j = 0; j < coords[i].length; j++) {
          point = coords[i][j];
          bounds.extend(new google.maps.LatLng(point[1], point[0]));
        }
      }
      return bounds;
    }

    var polygonInstances = [];

    $scope.init = function(defaultArea) {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.7578149, lng: -122.5078115},
        zoom: 14
      });

      google.maps.event.addListener(map, 'click', function (e) {
        var lat = e.latLng.lat();
        var lng = e.latLng.lng();
        var url = '/api/service_areas/?lat=' + lat + '&lng=' + lng;
        $http.get(url).then(
          function successCallback(response) {
            $scope.areas = response.data;
          },
          function errorCallback() {
            alert('Oops, something went wrong. Please try again.');
          }
        );
      });

      if (defaultArea) {
        var bounds = getBoundsOfArea(defaultArea);
        map.fitBounds(bounds);
        $scope.areas = [defaultArea];
      } else {
        $scope.areas = [];
      }

      $scope.$watch('areas', function () {
        drawServiceAreas();
      });

    }

    /*
    draw the polygons related with the service areas from $scope.areas
     */
    function drawServiceAreas() {
      // remove existent polygons from the map
      for (var i = 0; i < polygonInstances.length; i++) {
        polygonInstances[i].setMap(null);
      }
      polygonInstances = [];

      // draw new polygons for each service area
      var cursor;
      for (var i = 0; i < $scope.areas.length; i++) {
        cursor = $scope.areas[i];
        var polygon = null;
        for (var j = 0; j < cursor.path.coordinates.length; j++) {
          polygon = cursor.path.coordinates[j];
          var point = null;
          var coords = [];
          for (var k = 0; k < polygon.length; k++) {
            point = polygon[k];
            coords.push({
              lat: point[1],
              lng: point[0]
            })
          }

          // Construct the polygon.
          var shape = new google.maps.Polygon({
            paths: coords,
            strokeColor: '#000000',
            strokeWeight: 2,
            fillColor: '#000000',
            fillOpacity: 0.1,
            clickable: false // don't handle click event on the overlay
          });
          shape.setMap(map);
          polygonInstances.push(shape);
        }

      }
    }

  }]);

function onGoogleReady() {
  angular.bootstrap(document, ['app']);
}
