app
.directive('linesettings', function() { 
  	return { 
    	restrict: 'EA', 
		templateUrl: './directives/lineplot/linesettings.html',
		controller: 'lineController',
		link: function(scope, element, attributes) {

		}
	}
});	

app.controller('lineController', ['$scope', 'd3Service', 'datatableSettingsService','$mdSidenav','$window','dashboardService','sidebarService', function($scope, d3, datatableSettingsService, $mdSidenav, $window, dashboardService, sidebarService){

	$scope.vehicle =[];
	
	// Table
	$scope.checkedValues = datatableSettingsService.getValues();
		
	$scope.table = {"rows":{
                    "data":[
                                [
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedId"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedName"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedAlow"
                                    }
								]
							]
						}
					}

	$scope.getTelemetrydata = function($event,$index){
        var arrow = $event.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild;
        arrow.style.color = "red";

        if ($window.innerWidth < 1400){
            $mdSidenav('left').open();
        } else {
            $scope.lock = dashboardService.getLock();
            $scope.lock.lockLeft = !$scope.lock.lockLeft;
            dashboardService.setLeftLock($scope.lock.lockLeft);
        }
    }

    $scope.getValue = function($event,$index){

        var vehicle = sidebarService.getVehicleInfo();
        var arrow = $event.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild;
		console.log($scope.$id)
        $scope.table.rows.data[$index][0].value = vehicle.id;
		$scope.vehicle = vehicle.vehicle;
		
        if ($window.innerWidth >= 1400){
            $scope.lock.lockLeft = !$scope.lock.lockLeft;
            dashboardService.setLeftLock($scope.lock.lockLeft);          
        } 

        if(vehicle.id === '') {
            arrow.style.color = "red";
        } else {
            arrow.style.color = "#b3b3b3";  
        } 
    }
	
    $scope.addRowAbove = function($index){
        $scope.table.rows.data.splice($index,0,[{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedId"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedName"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAlow"}]);
    }

    $scope.addRowBelow = function($index){
        $scope.table.rows.data.splice($index+1,0,[{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedId"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedName"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAlow"}]);
    }

    $scope.deleteRow = function($index){
        $scope.table.rows.data.splice($index, 1);
    }

    $scope.moveRowUp = function($index){
        $scope.table.rows.data[$index-1] = $scope.table.rows.data.splice($index, 1, $scope.table.rows.data[$index-1])[0];
    }

    $scope.moveRowDown = function($index){
        $scope.table.rows.data[$index+1] = $scope.table.rows.data.splice($index, 1, $scope.table.rows.data[$index+1])[0];
    }

    $scope.convertHeader = function($index){
        $scope.table.rows.data[$index] = [{"value":"","checked":"false","style":"text-align:right;background-color:#1072A4;","colshow":"true","colspan":"9","class":"header","placeholder":"Click here to edit"}];
    } 

    $scope.convertToReadonly = function($index){
        $scope.table.rows.data[$index]["checked"] = "true";
    }
	// End of Table
	
	// Close
	$scope.closeWidget = function(widget){
		widget.main = true;
		widget.settings = false;
	}
	
	// Save
	$scope.saveWidget = function(widget){
		widget.main = true;
		widget.settings = false;
}	
}]);