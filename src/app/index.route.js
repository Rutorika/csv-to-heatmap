(function() {
  'use strict';

  angular
    .module('csvToHeatmap')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'Main'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
