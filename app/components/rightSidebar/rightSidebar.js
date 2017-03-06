app
.component('rightSidebar', {
  	templateUrl: "./components/rightSidebar/right_sidebar.html",
  	controller: function(gridService, dashboardService, $controller) {
        var vm = this;
  		vm.name = dashboardService.name;
        vm.addWidget = function() {
            gridService.addWidget();
        };

        vm.clear = function() {
            gridService.clear();
        };

        vm.addWidgets = function(widget) {
            gridService.addWidgets(widget);
        };

        vm.widgetDefinitions = gridService.widgetDefinitions;
        vm.QwidgetMenu =  false;
        vm.addMenu = false;

        vm.showQwidgetMenu = function(){
            vm.QwidgetMenu = !vm.QwidgetMenu;
        }

        vm.showAddMenu = function(){
            vm.addMenu = !vm.addMenu;
        }
	}
})