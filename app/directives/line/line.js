app.directive('graph', function() {
    return {
        restrict: 'EA',
        template: "<div class='graph-container'></div>",
        controller : "LineCtrl"
    }
});

app.controller("LineCtrl", function($scope, $element, $interval, $window, dashboardService, d3Service) {
    var telemetry = dashboardService.telemetry;
    var parseTime = d3Service.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
    var prevSettings;
            
    $scope.data = [[0]];
    $scope.opts = { 
        axes: {
            x: {
                drawGrid: true
            },
            y: {
                drawAxis: true
            }
        }, 
        //dateWindow: [0, 1], 
        legend: "always",
        xlabel: "timestamp", 
        axisLabelWidth : 70,
        xLabelHeight : 16,
        yLabelWidth : 16,
    };

    var graph = new Dygraph($element[0].firstChild, $scope.data, $scope.opts );

    $scope.interval = $interval(updatePlot, 1000);   

    $scope.plotData =[];

    function updatePlot() {
        graph.resize();

        if($scope.widget.settings.data){
            if($scope.widget.settings.data.value !== "" && $scope.widget.settings.data.vehicles.length > 0) {
                var paramY = $scope.widget.settings.data.value;
                var vehicles = $scope.widget.settings.data.vehicles;
                var labels = ["time"];
                var series = {};
                var typeFlag = false;
                if(telemetry['time']){
                    var tTemp = parseTime(telemetry['time']);
                    var plotPoint = [tTemp];

                    //reset plotData when there is a change in settings
                    if (JSON.stringify(prevSettings) !== JSON.stringify($scope.widget.settings.data)){
                        if(!$scope.plotData){
                            $scope.plotData = new Array();
                        } else {
                            $scope.plotData = [];
                        }
                    }

                    for(var v in vehicles){
                        var vehicle = vehicles[v];

                        if(telemetry[vehicle.name] !== undefined){  
                            var currentData = dashboardService.getData(vehicle.key);
                            if(currentData){
                                if(typeof(currentData.value) == "number") {
                                    var xTemp = parseFloat(currentData.value.toFixed(4));
                                    var category = currentData.category;
                                    var yUnits = currentData.units;
                                    plotPoint.push(xTemp);
                                } else {
                                    typeFlag = true;
                                    break;
                                }
                            }
                        }

                        $scope.plotData.push(plotPoint)
                        labels.push(vehicle.name);
                        series[vehicle.name] = {
                            color : vehicle.color
                        };

                        if ($scope.plotData.length > 100) {
                            $scope.plotData.shift();
                        };
                    }

                    if(category && paramY){
                        var ylabel = category+" [ "+paramY+ " ] " + yUnits + " "
                    }

                    if(typeFlag){
                        //reset to an empty plot as selected ID is not of type number
                        graph.updateOptions({
                            file: [[0]],
                            axes: {
                                x: {
                                    drawGrid: true
                                },
                                y: {
                                    drawAxis: true
                                }
                            },
                            legend: "always",
                            xlabel: "timestamp",
                            axisLabelWidth : 70,
                            xLabelHeight : 16,
                            yLabelWidth : 16,
                        });
                        //reset settings data
                        $scope.widget.settings.data = {
                            vehicles : [],
                            value : "",
                            key: ""
                        };
                        $window.alert(paramY + " is of datatype " + typeof(currentData.value) + 
                            ". Please select another ID from data menu.");
                    } else {
                        graph.updateOptions({
                            file: $scope.plotData,
                            ylabel: ylabel,
                            xlabel: "timestamp",
                            labels: labels,
                            axes: {
                                y: {
                                    //drawGrid: true,
                                    valueFormatter: function(y) {
                                        return parseFloat(y.toFixed(4));
                                    },
                                    axisLabelFormatter: function(y) {
                                        return parseFloat(y.toFixed(2));
                                    }
                                }
                            },
                            drawPoints: true,
                            //yRangePad: 200,
                            series: series
                        });
                    }
                }

                prevSettings = angular.copy($scope.widget.settings.data);
            }
        }
    }

    $scope.$on("$destroy", 
        function(event) {
            $interval.cancel( $scope.interval );
        }
    );
});