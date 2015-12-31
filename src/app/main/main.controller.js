/**
 * @name Main
 * @type MainController
 */
(function () {
  'use strict';

  angular
    .module('csvToHeatmap')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($log, leafletData, L, _) {
    var vm = this;

    vm.csvRows = [];
    vm.pointIntensity = 8;
    vm.header = [];
    vm.latitudeColumn = null;
    vm.longitudeColumn = null;
    vm.filterByColumn = null;
    vm.filterOptions = null;
    vm.filterOptionsSelected = null;

    vm.csvChanged = csvChanged;
    vm.filterByColumnChanged = filterByColumnChanged;
    vm.renderHeatmap = renderHeatmap;
    vm.isFilterSelected = isFilterSelected;
    vm.toggleFilterSelected = toggleFilterSelected;
    vm.setFilterSelected = setFilterSelected;

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


    var heatmap;

    /**
     * Listen to csv changed, update header columns and reset file related options
     */
    function csvChanged() {
      vm.header = Object.keys(vm.csvRows[0]);


      vm.latitudeColumn = null;
      vm.longitudeColumn = null;
      vm.filterByColumn = null;
      vm.filterOptions = null;
      vm.filterOptionsSelected = null;
    }

    function renderHeatmap(form) {
      if (!form.$valid) {
        return;
      }

      if (vm.filterOptionsSelected !== null) {
        var filteredRows = vm.csvRows.filter(function (row) {
          return _.contains(vm.filterOptionsSelected, row[vm.filterByColumn]);
        });

        _renderHeatmap(filteredRows);
      } else {
        _renderHeatmap(vm.csvRows);
      }
    }

    function _renderHeatmap (rows) {
      leafletData.getMap().then(function (map) {

        // Recreate heatmap
        if (heatmap) {
          map.removeLayer(heatmap);
        }
        heatmap = new L.TileLayer.WebGLHeatMap(vm.heatmapOptions);

        rows.forEach(function (row) {
          var point = parseRow(row);
          heatmap.addDataPoint.apply(heatmap, point);
        });

        map.addLayer(heatmap);
      });
    }

    function filterByColumnChanged() {
      if (vm.filterByColumn) {
        vm.filterOptions = _.uniq(_.pluck(vm.csvRows, vm.filterByColumn)).sort();
        vm.filterOptionsSelected = angular.copy(vm.filterOptions);
      }
    }

    /**
     * @param row
     * @returns {*[]}
     */
    function parseRow(row) {
      return [row[vm.latitudeColumn], row[vm.longitudeColumn], vm.pointIntensity];
    }

    function isFilterSelected(value) {
      return _.contains(vm.filterOptionsSelected, value);
    }

    function toggleFilterSelected(value) {
      if (_.contains(vm.filterOptionsSelected, value)) {
        vm.filterOptionsSelected = _.without(vm.filterOptionsSelected, value);
      } else {
        vm.filterOptionsSelected.push(value);
      }
    }

    function setFilterSelected(filters) {
      vm.filterOptionsSelected = angular.copy(filters);
    }
  }
})();
