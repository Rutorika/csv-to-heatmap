/**
 * Validation rule for column name. Check is values of the selected column has less then 500 unique values.
 */
(function () {
  'use strict';

  angular.module('csvToHeatmap')
    .directive('filterColumn', filterColumn);

  /** @ngInject */
  function filterColumn(_) {
    return {
      require: 'ngModel',
      scope: {
        filterColumn: '='
      },
      link: function (scope, elm, attrs, ctrl) {
        ctrl.$validators.filterColumn = function (modelValue) {
          if (ctrl.$isEmpty(modelValue)) {
            return true;
          }

          return _.uniq(_.pluck(scope.filterColumn, modelValue)).length <= 500;
        };
      }
    };
  }
})();