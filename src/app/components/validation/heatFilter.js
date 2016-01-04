/**
 * Attribute directive for the file input. Parse selected csv file and update model value with the result.
 */
(function () {
  'use strict';

  angular.module('csvToHeatmap')
    .directive('heatfilter', heatfilter);

  /** @ngInject */
  function heatfilter(_) {
    return {
      require: 'ngModel',
      scope: {
        heatfilter: '='
      },
      link: function (scope, elm, attrs, ctrl) {
        ctrl.$validators.heatfilter = function (modelValue) {
          if (ctrl.$isEmpty(modelValue)) {
            return true;
          }

          return _.uniq(_.pluck(scope.heatfilter, modelValue)).length <= 500;
        };
      }
    };
  }
})();