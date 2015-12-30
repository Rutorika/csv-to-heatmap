(function() {
  'use strict';

  angular
    .module('csvToHeatmap')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
