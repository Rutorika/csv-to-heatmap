!function(){"use strict";angular.module("csvToHeatmap",["ngAnimate","ngCookies","ngTouch","ngSanitize","ngMessages","ui.router","ui.bootstrap","toastr","ui-leaflet"])}(),function(){"use strict";function e(e){return{require:"ngModel",scope:{heatfilter:"="},link:function(t,n,l,i){i.$validators.heatfilter=function(n){return i.$isEmpty(n)?!0:e.uniq(e.pluck(t.heatfilter,n)).length<=500}}}}e.$inject=["_"],angular.module("csvToHeatmap").directive("heatfilter",e)}(),function(){"use strict";function e(e){return{restrict:"A",require:"?ngModel",link:function(t,n,l,i){function o(){var t=new FileReader,l=n.get(0).files[0];t.onload=function(){var n=new e(t.result,{header:!0});i.$setViewValue(n.parse())},t.readAsText(l)}function a(){i.$setValidity("required",""!=n.val())}i&&(a(),n.on("change",function(){a(),t.$evalAsync(o)}))}}}e.$inject=["CSV"],angular.module("csvToHeatmap").directive("csvReader",e)}(),function(){"use strict";function e(e,t,n,l){function i(){f.header=Object.keys(f.csvRows[0]),f.latitudeColumn=null,f.longitudeColumn=null,f.filterByColumn=null,f.filterOptions=null,f.filterOptionsSelected=null}function o(e){if(e.$valid)if(null!==f.filterOptionsSelected){var t=f.csvRows.filter(function(e){return l.contains(f.filterOptionsSelected,e[f.filterByColumn])});a(t)}else a(f.csvRows)}function a(e){t.getMap().then(function(t){g&&t.removeLayer(g),g=new n.TileLayer.WebGLHeatMap(f.heatmapOptions),e.forEach(function(e){var t=s(e);g.addDataPoint.apply(g,t)}),t.addLayer(g)})}function r(e){f.filterByColumn&&e.$valid&&(f.filterOptions=l.uniq(l.pluck(f.csvRows,f.filterByColumn)).sort(),f.filterOptionsSelected=angular.copy(f.filterOptions))}function s(e){return[e[f.latitudeColumn],e[f.longitudeColumn],f.pointIntensity]}function c(e){return l.contains(f.filterOptionsSelected,e)}function u(e){l.contains(f.filterOptionsSelected,e)?f.filterOptionsSelected=l.without(f.filterOptionsSelected,e):f.filterOptionsSelected.push(e)}function d(e){f.filterOptionsSelected=angular.copy(e)}function m(){if(f.latitudeColumn&&f.longitudeColumn){var e=[];f.csvRows.forEach(function(t){var n=s(t);e.push([n[0],n[1]])}),t.getMap().then(function(t){t.fitBounds(e)})}}var f=this;f.csvRows=[],f.pointIntensity=8,f.header=[],f.latitudeColumn=null,f.longitudeColumn=null,f.filterByColumn=null,f.filterOptions=null,f.filterOptionsSelected=null,f.csvChanged=i,f.filterByColumnChanged=r,f.renderHeatmap=o,f.isFilterSelected=c,f.toggleFilterSelected=u,f.setFilterSelected=d,f.fitBounds=m,f.map={center:{lat:51.4768219,lng:-6172e-7,zoom:14},defaults:{},layers:{baselayers:{googleRoadmap:{name:"Google Streets",layerType:"ROADMAP",type:"google"}}}},f.heatmapOptions={size:750,autoresize:!0};var g}e.$inject=["$log","leafletData","L","_"],angular.module("csvToHeatmap").controller("MainController",e)}(),function(){"use strict";function e(e){e.debug("runBlock end")}e.$inject=["$log"],angular.module("csvToHeatmap").run(e)}(),function(){"use strict";function e(e,t){e.state("home",{url:"/",templateUrl:"app/main/main.html",controller:"MainController",controllerAs:"Main"}),t.otherwise("/")}e.$inject=["$stateProvider","$urlRouterProvider"],angular.module("csvToHeatmap").config(e)}(),function(){"use strict";angular.module("csvToHeatmap").constant("CSV",CSV).constant("L",L).constant("_",_).constant("moment",moment)}(),function(){"use strict";function e(e,t){e.debugEnabled(!0),t.allowHtml=!0,t.timeOut=3e3,t.positionClass="toast-top-right",t.preventDuplicates=!1,t.progressBar=!1}e.$inject=["$logProvider","toastrConfig"],angular.module("csvToHeatmap").config(e)}(),angular.module("csvToHeatmap").run(["$templateCache",function(e){e.put("app/main/main.html",'<div class="row"><div class="col-md-8" style="margin-bottom: 2em;"><leaflet defaults="Main.map.defaults" layers="Main.map.layers" lf-center="Main.map.center" height="400px" width="100%"></leaflet><div ng-if="Main.filterByColumn" style="margin: 1em 0;"><a class="btn btn-default btn-sm" ng-click="Main.setFilterSelected(Main.filterOptions)">Select all</a> <a class="btn btn-default btn-sm" ng-click="Main.setFilterSelected([])">Select none</a></div><table class="table table-condensed table-hover" ng-if="Main.filterByColumn"><tbody><tr ng-repeat="filterValue in Main.filterOptions" ng-click="Main.toggleFilterSelected(filterValue)" style="cursor: pointer" class="no-text-select"><td style="width: 1%"><i class="glyphicon glyphicon-unchecked" ng-show="!Main.isFilterSelected(filterValue)"></i> <i class="glyphicon glyphicon-check" ng-show="Main.isFilterSelected(filterValue)"></i></td><td>{{ ::filterValue }}</td><td></td></tr></tbody></table></div><div class="col-md-4" style="margin-bottom: 2em;"><form name="csvForm" ng-submit="Main.renderHeatmap(csvForm)"><div class="form-group" ng-class="{\'has-error\': csvForm.$submitted && csvForm.csv.$invalid}"><label class="control-label" for="csv">CSV File</label> <input ng-model="Main.csvRows" type="file" name="csv" ng-change="Main.csvChanged()" csv-reader="" id="csv"><div ng-messages="csvForm.csv.$error" ng-show="csvForm.$submitted"><div ng-messages-include="error-messages"></div></div></div><div class="form-group"><label class="control-label" for="intensity">Point intensity (%)</label> <input type="number" name="intensity" min="0" max="100" ng-model="Main.pointIntensity" class="form-control" id="intensity"></div><div class="form-group"><label class="control-label" for="radius">Point radius (meters)</label> <input name="radius" type="number" min="0" max="10000" ng-model="Main.heatmapOptions.size" class="form-control" id="radius"></div><div class="form-group" ng-class="{\'has-error\': csvForm.$submitted && csvForm.latitudeColumn.$invalid}"><label class="control-label" for="latitudeColumn">Latitude column</label><select name="latitudeColumn" class="form-control" ng-model="Main.latitudeColumn" required="" id="latitudeColumn" ng-change="Main.fitBounds()"><option ng-repeat="headerName in Main.header">{{ headerName }}</option></select><div ng-messages="csvForm.latitudeColumn.$error" ng-show="csvForm.$submitted"><div ng-messages-include="error-messages"></div></div></div><div class="form-group" ng-class="{\'has-error\': csvForm.$submitted && csvForm.longitudeColumn.$invalid}"><label class="control-label" for="longitudeColumn">Longitude column</label><select name="longitudeColumn" class="form-control" ng-model="Main.longitudeColumn" required="" id="longitudeColumn" ng-change="Main.fitBounds()"><option ng-repeat="headerName in Main.header">{{ headerName }}</option></select><div ng-messages="csvForm.longitudeColumn.$error" ng-show="csvForm.$submitted"><div ng-messages-include="error-messages"></div></div></div><div class="form-group" ng-class="{\'has-error\': csvForm.filterByColumn.$invalid}"><label class="control-label" for="filterByColumn">Filter by column (optional)</label><select name="filterByColumn" class="form-control" ng-model="Main.filterByColumn" id="filterByColumn" ng-change="Main.filterByColumnChanged(csvForm.filterByColumn)" heatfilter="Main.csvRows"><option ng-repeat="headerName in Main.header">{{ headerName }}</option></select><div ng-messages="csvForm.filterByColumn.$error"><div ng-messages-include="error-messages"></div></div></div><button type="submit" class="btn btn-primary">Render heatmap</button></form></div></div>'),e.put("app/components/csv-reader/csv-reader.html",'<input type="file" name="csv">')}]);
//# sourceMappingURL=../maps/scripts/app-aae9fb228d.js.map