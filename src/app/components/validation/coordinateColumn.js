/**
 * Attribute directive for the file input. Parse selected csv file and update model value with the result.
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