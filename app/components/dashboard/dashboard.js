angular.module('app')
.component('dashboard', {
	transclude: true,
  	scope: true,
   	bindToController: true,
  	templateUrl: "./components/dashboard/dashboard.html",
  	controller: function(dashboardService, $interval, $mdSidenav, $scope, $window) {
  		var vm = this;
  		var theInterval = $interval(function(){
	    	vm.clock = dashboardService.startTime();
	    	getData();
            //console.log(vm.telemetry);
	   	}.bind(vm), 1000); 

  		vm.clock = dashboardService.startTime();
  		vm.name = dashboardService.name;
  		vm.email = dashboardService.email;

	  	vm.icons = [
	  		{
			    image:"/media/icons/status_icons-05.png",
			   	id: "i5"
			},
			{
		    	image:"/media/icons/status_icons-06.png",
		    	id: "i6"
		    },
		    {
		    	image:"/media/icons/status_icons-07.png",
		    	id: "i7"
		    },
		    {
		    	image:"/media/icons/status_icons-08.png",
		    	id:"i8"
		    }
	    ];

	    function getData(){
  			dashboardService.getTelemetry()
  			.then(function(response) {
  				vm.telemetry = response.data;
       		});
  		}

  		vm.openRightNav = function(){
	    	if ($window.innerWidth < 1400){
	    		$mdSidenav('right').open();
	    	} else {
	    		$scope.lockRight = !$scope.lockRight;
	    	}
	    }

	   	// vm.openLeftNav = function(){
	    // 	if ($window.innerWidth < 1400){
	    // 		$mdSidenav('left').open();
	    // 	} else {
	    // 		$scope.lockLeft = !$scope.lockLeft;
	    // 	}
	    // }
	}
})