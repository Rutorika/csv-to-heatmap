/**
 * Validate input as coordinate (latitude or longitude)
 */
(function () {
  'use strict';

  angular.module('csvToHeatmap')
    .directive('coordinateColumn', coordinateColumn);

  /** @ngInject */
  function coordinateColumn() {
    return {
      require: 'ngModel',
      scope: {
        coordinateColumn: '='
      },
      link: function (scope, elm, attrs, ctrl) {
        ctrl.$validators.coordinateColumn = function (modelValue) {

          if (ctrl.$isEmpty(modelValue) || !scope.coordinateColumn) {
            return true;
          }

          return isFinite(scope.coordinateColumn[modelValue]);
        };
      }
    };
  }
})();