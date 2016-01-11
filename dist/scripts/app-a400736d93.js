!function(){"use strict";angular.module("csvToHeatmap",["ngAnimate","ngCookies","ngTouch","ngSanitize","ngMessages","ui.router","ui.bootstrap","toastr","ui-leaflet"])}(),function(){"use strict";function e(e){return{require:"ngModel",scope:{filterColumn:"="},link:function(n,t,l,o){o.$validators.filterColumn=function(t){return o.$isEmpty(t)?!0:e.uniq(e.pluck(n.filterColumn,t)).length<=500}}}}e.$inject=["_"],angular.module("csvToHeatmap").directive("filterColumn",e)}(),function(){"use strict";function e(){return{require:"ngModel",scope:{coordinateColumn:"="},link:function(e,n,t,l){l.$validators.coordinateColumn=function(n){return l.$isEmpty(n)||!e.coordinateColumn?!0:isFinite(e.coordinateColumn[n])}}}}angular.module("csvToHeatmap").directive("coordinateColumn",e)}(),function(){"use strict";function e(e){return{restrict:"A",require:"?ngModel",link:function(n,t,l,o){function i(){var n=new FileReader,l=t.get(0).files[0];n.onload=function(){var t=new e(n.result,{header:!0});o.$setViewValue(t.parse())},n.readAsText(l)}function a(){o.$setValidity("required",""!=t.val())}o&&(a(),t.on("change",function(){a(),n.$evalAsync(i)}))}}}e.$inject=["CSV"],angular.module("csvToHeatmap").directive("csvReader",e)}(),function(){"use strict";function e(){return{restrict:"E",transclude:!0,require:"^form",templateUrl:"app/components/control-group/control-group.html",scope:{fieldLabel:"@",fieldName:"@",labelWidth:"@"},link:function(e,n,t,l){e.form=l}}}angular.module("csvToHeatmap").directive("controlGroup",e)}(),function(){"use strict";function e(e,n,t){function l(){d.header=Object.keys(d.csvRows[0]),d.latitudeColumn=null,d.longitudeColumn=null,d.filterByColumn=null,d.filterOptions=null,d.filterOptionsSelected=null}function o(e){if(e.$valid)if(null!==d.filterOptionsSelected){var n=d.csvRows.filter(function(e){return t.contains(d.filterOptionsSelected,e[d.filterByColumn])});i(n)}else i(d.csvRows)}function i(t){e.getMap().then(function(e){f&&e.removeLayer(f),f=new n.TileLayer.WebGLHeatMap(d.heatmapOptions),t.forEach(function(e){var n=r(e);f.addDataPoint.apply(f,n)}),e.addLayer(f)})}function a(e){d.filterByColumn&&e.$valid&&(d.filterOptions=t.uniq(t.pluck(d.csvRows,d.filterByColumn)).sort(),d.filterOptionsSelected=angular.copy(d.filterOptions))}function r(e){return[e[d.latitudeColumn],e[d.longitudeColumn],d.pointIntensity]}function s(e){return t.contains(d.filterOptionsSelected,e)}function u(e){t.contains(d.filterOptionsSelected,e)?d.filterOptionsSelected=t.without(d.filterOptionsSelected,e):d.filterOptionsSelected.push(e)}function c(e){d.filterOptionsSelected=angular.copy(e)}function m(n,t){if(d.latitudeColumn&&d.longitudeColumn&&n.$valid&&t.$valid){var l=[];d.csvRows.forEach(function(e){var n=r(e);l.push([n[0],n[1]])}),e.getMap().then(function(e){e.fitBounds(l)})}}var d=this;d.csvRows=[],d.pointIntensity=8,d.header=[],d.latitudeColumn=null,d.longitudeColumn=null,d.filterByColumn=null,d.filterOptions=null,d.filterOptionsSelected=null,d.csvChanged=l,d.filterByColumnChanged=a,d.renderHeatmap=o,d.isFilterSelected=s,d.toggleFilterSelected=u,d.setFilterSelected=c,d.fitBounds=m,d.map={center:{lat:51.4768219,lng:-6172e-7,zoom:14},defaults:{},layers:{baselayers:{googleRoadmap:{name:"Google Streets",layerType:"ROADMAP",type:"google"}}}},d.heatmapOptions={size:750,autoresize:!0};var f}e.$inject=["leafletData","L","_"],angular.module("csvToHeatmap").controller("MainController",e)}(),function(){"use strict";function e(e){e.debug("runBlock end")}e.$inject=["$log"],angular.module("csvToHeatmap").run(e)}(),function(){"use strict";function e(e,n){e.state("home",{url:"/",templateUrl:"app/main/main.html",controller:"MainController",controllerAs:"Main"}),n.otherwise("/")}e.$inject=["$stateProvider","$urlRouterProvider"],angular.module("csvToHeatmap").config(e)}(),function(){"use strict";angular.module("csvToHeatmap").constant("CSV",CSV).constant("L",L).constant("_",_).constant("moment",moment)}(),function(){"use strict";function e(e,n){e.debugEnabled(!0),n.allowHtml=!0,n.timeOut=3e3,n.positionClass="toast-top-right",n.preventDuplicates=!1,n.progressBar=!1}e.$inject=["$logProvider","toastrConfig"],angular.module("csvToHeatmap").config(e)}(),angular.module("csvToHeatmap").run(["$templateCache",function(e){e.put("app/main/main.html",'<div class="row"><div class="col-md-8" style="margin-bottom: 2em;"><leaflet defaults="Main.map.defaults" layers="Main.map.layers" lf-center="Main.map.center" height="400px" width="100%"></leaflet><div ng-if="Main.filterByColumn" style="margin: 1em 0;"><a class="btn btn-default btn-sm" ng-click="Main.setFilterSelected(Main.filterOptions)">Select all</a> <a class="btn btn-default btn-sm" ng-click="Main.setFilterSelected([])">Select none</a></div><table class="table table-condensed table-hover" ng-if="Main.filterByColumn"><tbody><tr ng-repeat="filterValue in Main.filterOptions" ng-click="Main.toggleFilterSelected(filterValue)" style="cursor: pointer" class="no-text-select"><td style="width: 1%"><i class="glyphicon glyphicon-unchecked" ng-show="!Main.isFilterSelected(filterValue)"></i> <i class="glyphicon glyphicon-check" ng-show="Main.isFilterSelected(filterValue)"></i></td><td>{{ ::filterValue }}</td><td></td></tr></tbody></table></div><div class="col-md-4" style="margin-bottom: 2em;"><form name="csvForm" ng-submit="Main.renderHeatmap(csvForm)"><control-group field-label="CSV File" field-name="csvFile"><input name="csvFile" type="file" ng-model="Main.csvRows" ng-change="Main.csvChanged()" csv-reader=""></control-group><control-group field-label="Point intensity (%)" field-name="intensity"><input name="intensity" type="number" min="0" max="100" ng-model="Main.pointIntensity" class="form-control"></control-group><control-group field-label="Point radius (meters)" field-name="radius"><input name="radius" type="number" min="0" max="10000" ng-model="Main.heatmapOptions.size" class="form-control"></control-group><control-group field-label="Latitude column" field-name="latitudeColumn"><select name="latitudeColumn" ng-model="Main.latitudeColumn" required="" ng-change="Main.fitBounds(csvForm.latitudeColumn, csvForm.longitudeColumn)" coordinate-column="Main.csvRows[0]" class="form-control"><option ng-repeat="headerName in Main.header">{{ headerName }}</option></select></control-group><control-group field-label="Longitude column" field-name="longitudeColumn"><select name="longitudeColumn" ng-model="Main.longitudeColumn" required="" ng-change="Main.fitBounds(csvForm.latitudeColumn, csvForm.longitudeColumn)" coordinate-column="Main.csvRows[0]" class="form-control"><option ng-repeat="headerName in Main.header">{{ headerName }}</option></select></control-group><control-group field-label="Filter by column (optional)" field-name="filterByColumn"><select name="filterByColumn" ng-model="Main.filterByColumn" ng-change="Main.filterByColumnChanged(csvForm.filterByColumn)" filter-column="Main.csvRows" class="form-control"><option value="">---None---</option><option ng-repeat="headerName in Main.header">{{ headerName }}</option></select></control-group><button type="submit" class="btn btn-primary" ng-disabled="csvForm.$invalid && csvForm.$submitted">Render heatmap</button></form></div></div>'),e.put("app/components/control-group/control-group.html",'<div class="form-group" ng-class="{ \'has-error\': (form[fieldName].$dirty || form.$submitted) && form[fieldName].$invalid }"><label ng-if="fieldLabel" class="control-label">{{ fieldLabel }}</label><ng-transclude></ng-transclude><div ng-messages="form[fieldName].$error" ng-if="form[fieldName].$dirty || form.$submitted"><div ng-messages-include="app/components/control-group/messages.html"></div></div></div>'),e.put("app/components/control-group/messages.html",'<p ng-message="required" class="help-block">This field is required</p><p ng-message="filterColumn" class="help-block">This column has over 500 different values, so you can\'t filter by it</p><p ng-message="coordinateColumn" class="help-block">This CSV has invalid cooardinates in this column</p>')}]);
//# sourceMappingURL=../maps/scripts/app-a400736d93.js.map