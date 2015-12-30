(function () {
  'use strict';

  angular
    .module('csvToHeatmap')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($log, leafletData, toastr) {
    var vm = this;

    vm.csvRows = [];

    vm.csvChanged = csvChanged;
    vm.renderHeatmap = renderHeatmap;

    vm.map = {
      center: {
        lat: 42.34,
        lng: -71.1,
        zoom: 11
      },
      defaults: {},
      layers: {
        baselayers: {
          googleRoadmap: {
            name: 'Google Streets',
            layerType: 'ROADMAP',
            type: 'google'
          }
        }
      }
    };

    vm.heatmapOptions = {
      size: 750,
      autoresize: true
    };

    vm.pointIntensity = 8;
    vm.header = [];
    vm.latitudeColumn = null;
    vm.longitudeColumn = null;

    var heatmap;

    function csvChanged() {
      vm.header = Object.keys(vm.csvRows[0]);
    }

    function renderHeatmap(form) {

      if (!form.$valid) {
        $log.debug('invalid');
        return;
      }


      leafletData.getMap().then(function (map) {

        clearHeatmap(map, heatmap);

        heatmap = new L.TileLayer.WebGLHeatMap(vm.heatmapOptions);
        vm.csvRows.forEach(function (row) {
          var point = parseRow(row);
          heatmap.addDataPoint.apply(heatmap, point);
        });

        map.addLayer(heatmap);
        $log.debug('Done');
      });
    }

    function clearHeatmap(map, heatmap) {
      if (heatmap) {
        map.removeLayer(heatmap);
        $log.debug('Removed');
      }
    }

    function parseRow(row) {
      return [row[vm.latitudeColumn], row[vm.longitudeColumn], vm.pointIntensity];
    }
  }
})();
