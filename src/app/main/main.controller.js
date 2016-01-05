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
  function MainController(leafletData, L, _) {
    var vm = this;

    vm.csvRows = []; // parsed rows
    vm.pointIntensity = 8; // @see
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
    vm.fitBounds = fitBounds;

    vm.map = {
      center: {
        lat: 51.4768219,
        lng: -0.0006172,
        zoom: 14
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
     * Listen to csv change, update header columns and reset file related options
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

      // if filtering used then filter rows and show, otherwise just show all
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

    /**
     * When changed column to filter by
     *
     * @param column
     */
    function filterByColumnChanged(column) {
      if (vm.filterByColumn && column.$valid) {
        vm.filterOptions = _.uniq(_.pluck(vm.csvRows, vm.filterByColumn)).sort();
        vm.filterOptionsSelected = angular.copy(vm.filterOptions);
      }
    }

    /**
     * get [lat, lng, intesity] from row by columns
     *
     * @param row
     * @returns {*[]}
     */
    function parseRow(row) {
      return [row[vm.latitudeColumn], row[vm.longitudeColumn], vm.pointIntensity];
    }

    /**
     * check is filter selected to show checked checkbox icon
     *
     * @param value
     * @returns {boolean}
     */
    function isFilterSelected(value) {
      return _.contains(vm.filterOptionsSelected, value);
    }

    /**
     * check/uncheck filter
     *
     * @param value
     */
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

    /**
     * On lat/lng column change trying to fit map to points. checks both columns has been set and valid
     *
     * @param latColumn
     * @param lngColumn
     */
    function fitBounds(latColumn, lngColumn) {

      if (!vm.latitudeColumn || !vm.longitudeColumn || !latColumn.$valid || !lngColumn.$valid) {
        return;
      }

      var bounds = [];
      vm.csvRows.forEach(function (row) {
        var point = parseRow(row);
        bounds.push([point[0], point[1]]);
      });
      leafletData.getMap().then(function (map) {
        map.fitBounds(bounds);
      });
    }
  }
})();
