/* global moment:false, CSV:false, L:false, _:false */
(function() {
  'use strict';

  angular
    .module('csvToHeatmap')
    .constant('CSV', CSV)
    .constant('L', L)
    .constant('_', _)
    .constant('moment', moment);

})();
