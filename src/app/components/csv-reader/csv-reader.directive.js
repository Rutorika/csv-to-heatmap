(function () {
  'use strict';

  angular.module('csvToHeatmap')
    .directive('csvReader', csvReader);

  /** @ngInject */
  function csvReader(CSV, $log) {

    return {
      restrict: 'A',
      require: '?ngModel',
      link: function (scope, element, attrs, ngModel) {
        if (!ngModel) return;

        element.on('change', function () {
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
      }
    };

  }
})();