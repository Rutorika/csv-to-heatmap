/**
 * Attribute directive for the file input. Parse selected csv file and update model value with the result.
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