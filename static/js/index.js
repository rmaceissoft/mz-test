angular.module('app', [])
  .controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {

    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 37.7578149, lng: -122.5078115},
      zoom: 14
    });

    var drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.POLYGON
        ]
      },
      polygonOptions: {
        fillColor: '#000000',
        fillOpacity: 0.1,
        strokeWeight: 2,
        clickable: false,
        editable: true,
        zIndex: 1
      }
    });
    drawingManager.setMap(map);

    // scope variables
    $scope.coordinates;
    $scope.drawing = true;
    var shape = null;

    function resetDrawingControls() {
      $scope.drawing = true;
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
      drawingManager.setOptions({
        drawingControl: true
      });
      // remove shape from map
      shape.setMap(null);
      $scope.coordinates = [];
    }

    function arrayToWKT(value) {
      var cursor;
      var strResult = 'POLYGON ( (';
      for (var i = 0; i < value.length; i++) {
        cursor = value[i];
        strResult += cursor.lng() + ' ' + cursor.lat() + ', '
      }
      cursor = value[0];
      strResult += cursor.lng() + ' ' + cursor.lat() + ') )';
      return strResult;
    }

    function arrayToGeoJSON(value) {
      var vertices = [];
      for (var i = 0; i < value.length; i++) {
        vertices.push([value[i].lng(), value[i].lat()]);
      }
      vertices.push([value[0].lng(), value[0].lat()])
      return {
        type: 'Polygon',
        coordinates: [vertices]
      }
    }

    /*
    click handlers for cancel button
     */
    $scope.cancel = function() {
      resetDrawingControls();
    }

    /*
    click handler for submit button
     */
    $scope.submit = function() {
      var polygonWKT = arrayToGeoJSON($scope.coordinates);
      $http.post('/api/service_areas/', {
        path: polygonWKT
      }).then(
          function successCallback() {
            resetDrawingControls();
          },
          function errorCallback() {
            alert('Oops, something went wrong. Please try again.');
          }
        );
    }

    /*
    refresh $scope.coordinates based on a given shape's path
     */
    function refreshCoordinates(path) {
      var coords = path.getArray();
      $scope.coordinates = coords;
      $scope.$apply();
    }

    google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
      shape = polygon;
      $scope.drawing = false;
      drawingManager.setDrawingMode(null);
      drawingManager.setOptions({
        drawingControl: false
      });
      refreshCoordinates(polygon.getPath());

      google.maps.event.addListener(polygon.getPath(), 'set_at', function(e) {
        refreshCoordinates(this);
      });

      google.maps.event.addListener(polygon.getPath(), 'insert_at', function(e) {
        refreshCoordinates(this);
      });

    });

  }]);

function onGoogleReady() {
  angular.bootstrap(document, ['app']);
}
