/**
 * Attribute directive for the file input. Parse selected csv file and update model value with the result.
 */
(function () {
  'use strict';

  angular.module('csvToHeatmap')
    .directive('csvReader', csvReader);

  /** @ngInject */
  function csvReader(CSV) {

    return {
      restrict: 'A',
      require: '?ngModel',
      link: function (scope, element, attrs, ngModel) {
        if (!ngModel) return;
        updateValidity();

        element.on('change', function () {
          updateValidity();
          scope.$evalAsync(read);
        });

        function read() {
          var reader = new FileReader();
          var file = element.get(0).files[0];

          reader.onload = function () {
            var csv = new CSV(reader.result, {header: true});
            ngModel.$setViewValue(csv.parse());
          };

          reader.readAsText(file);
        }

        function updateValidity() {
          ngModel.$setValidity('required', element.val() != '');
        }
      }
    };

  }
})();