app.directive('command', function() { 
	return { 
    	restrict: 'E',  
	    templateUrl:'./directives/command/command.html',
	    controller: 'CommandCtrl',
  	}; 
})

app.controller('CommandCtrl', 
	function($scope, userService, commandService, dashboardService, $interval, $window,$mdToast,$element){

	$scope.email = userService.getUserEmail();
	$scope.mission = dashboardService.getCurrentMission();

    $scope.isLoaded = false;
	$scope.sent = false;
    var screenToaster1 = $element[0].getElementsByTagName("span")["commandNametoaster"];
    var screenToaster2 = $element[0].getElementsByTagName("span")["commandArgtoaster"];
    var screenToaster3 = $element[0].getElementsByTagName("span")["commandArgsToaster"];

	// var temp1 = $element[0].getElementsByTagName("div")[1];
    var screenToaster1 = $element[0].getElementsByTagName("span")[0];
    var screenToaster2 = $element[0].getElementsByTagName("span")[1];
    var screenToaster3 = $element[0].getElementsByTagName("span")[2];

    console.log($element[0].getElementsByTagName("span"));

	$scope.initialise = function(){
		$scope.cmd = "";
		$scope.arguments = "";
		$scope.entered =  false;
		$scope.locked = false;
		$scope.disableEnter = false;
		$scope.disableInput = false;
		$scope.disableLock = true;

		$scope.command = {
			name : "",
			arguments : "",
			sent_timestamp : "",
			time : ""
		};
	}

    $scope.enter = function(){
    	if($scope.cmd && $scope.arguments) {
			$scope.command.name = $scope.cmd;
		    $scope.command.arguments = $scope.arguments;
		   	$scope.entered = true;
		   	$scope.disableEnter = true;
	    } else if($scope.cmd.length === 0 && $scope.arguments.length > 0) {
            if($window.innerWidth >= 1024){
	    		$scope.toasterposition = "top left";
            	$scope.toasterqueryId = screenToaster1;
            	$scope.toasterdelay = false;
            	$scope.toasterusermessage = "Please enter the command.";
            	var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay); 
            }else {
                $scope.toasterposition = "top left";
                $scope.toasterqueryId = screenToaster3;
                $scope.toasterdelay = false;
                $scope.toasterusermessage = "Please enter the command.";
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay);
            }
	    } else if($scope.cmd.length > 0 && $scope.arguments.length === 0){
	    	if($window.innerWidth >= 1024){
	    		$scope.toasterposition = "top right";
            	$scope.toasterqueryId = screenToaster2;
            	$scope.toasterdelay = false;
            	$scope.toasterusermessage = "Please enter the argument values.";
            	var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay);
            }else {
            	$scope.toasterposition = "top right";
            	$scope.toasterqueryId = screenToaster3;
            	$scope.toasterdelay = false;
            	$scope.toasterusermessage = "Please enter the argument values.";
            	var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay);
            }
	    } else if($scope.cmd.length === 0 && $scope.arguments.length === 0){
	    	$scope.toasterposition = "top left";
           	$scope.toasterqueryId = screenToaster3;
            $scope.toasterdelay = false;
            $scope.toasterusermessage = "Please enter the command and argument values.";
            var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay); 
	    }
    }

    $scope.lockCommand = function(){
    	if($scope.command.name && $scope.entered) {
	    	$scope.locked = true;
	    	$scope.disableInput = true;
	    	$scope.disableLock = true;
	    } else {
	    	$scope.toasterposition = "top left";
           	$scope.toasterqueryId = screenToaster3;
            $scope.toasterdelay = false;
            $scope.toasterusermessage = "Please enter the command and arguments before locking.";
            var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay);
	    }
    }

    $scope.changeInput = function(){
    	if($scope.entered) {
    		$scope.entered = false;
    		$scope.disableEnter = false;
    	} else {
    		$scope.disableEnter = false;
    		$scope.disableLock = false;
    	}
    }

    $scope.sendCommand = function(){   	
    	var time = dashboardService.getTime(0);
    	var systemTime = new Date();
    	var cmdId = systemTime.getTime();
    	$scope.command.sent_timestamp = cmdId;
    	$scope.command.time = time.utc;

    	commandService.saveCommand($scope.email, $scope.command, $scope.mission.missionName)
    	.then(function(response) {
	        if(response.status == 200){
	        	$scope.initialise();
	        }
	    });
    }

	$scope.updateCommandlog = function(){
		commandService.getCommandLog($scope.mission.missionName)
		.then(function(response) {
	        if(response.status == 200) {
	            $scope.commandLog = response.data;

	            //get all the responses of a command
	            //find the response with the max timestamp
	            //assign the status and data to a the commandLog variable
	            var commandLen = $scope.commandLog.length;

	            for(var i=0;i<commandLen;i++){
	            	//call function to get the max date;
	            	//loop through the responses and find the response which matches that response
	            	//assign to a variable used to display in the command log
	            	var maxTime = getMaxTime($scope.commandLog[i].response,"gwp_timestamp");
	            	var responsesLen = $scope.commandLog[i].response.length;
	            	for(var j=0;j<responsesLen;j++){
	            		var dateformat = new Date($scope.commandLog[i].response[j].gwp_timestamp);
	            		if(dateformat.getTime() === maxTime.getTime()){
	            			$scope.commandLog[i].responseStatus = $scope.commandLog[i].response[j].status;
	            			$scope.commandLog[i].responseData = $scope.commandLog[i].response[j].metadata_data;
	            		}
	            	}
	            }
	        }
	    });
	}

	function getMaxTime(responses,filter){
		var timestampArray = [];
		var maxTime;
		for(var j=0;j<responses.length;j++){
	        var dateformat = new Date(responses[j][filter]);
	        timestampArray.push(dateformat);
	    }
	    maxTime = new Date(Math.max.apply(null,timestampArray));
	    return maxTime;
	}

	$scope.initialise();

    $scope.interval = $interval($scope.updateCommandlog, 1000);

	$scope.$on("$destroy", 
		function(event) {
			$interval.cancel( $scope.interval );
		}
	);
});

