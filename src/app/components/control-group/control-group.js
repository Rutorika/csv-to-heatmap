/**
 * directive for bootstrap form-group
 */
(function () {
  'use strict';

  angular.module('csvToHeatmap')
    .directive('controlGroup', controlGroup);

  /** @ngInject */
  function controlGroup() {

    return {
      restrict: 'E',
      transclude: true,
      require: '^form',
      templateUrl: 'app/components/control-group/control-group.html',
      scope: {
        fieldLabel: '@',
        fieldName: '@',
        labelWidth: '@'
      },
      link: function (scope, el, attrs, formCtrl) {
        scope.form = formCtrl;
      }
    };
  }
})();