app
.component('leftSidebar', {
  	templateUrl: "./components/leftSidebar/left_sidebar.html",
  	controller: function(sidebarService) {
  		var vm = this;
        vm.post = {id: null}; //object to store the input id value

  		getData();

        vm.selectData = function(data){
            if(data.nodes.length == 0){
                sidebarService.setData(data.value);
            } else {
                data.active = !data.active;
            }
        }

        //Function to search data menu using id
        vm.searchData = function(id){

            var vehs = angular.copy(vm.vehicles);//creates a copy of the vehicles object
            var vehMenu = angular.copy(vm.vehicleMenu);//creates a copy of vehicle menu status
            var newObj = {};

            //loops through the vehicles and its configuration data and 
            //closes any open list
            for(var i=0;i<vehs.length;i++){
                for(var j=0;j<vehs[i].config.length;j++){
                    for(var k=0;k<vehs[i].config[j].values.length;k++){
                        if(vehs[i].config[j].active = true){
                            vehs[i].config[j].active = false;
                            vehs[i].config[j].datastatus[k] = false;
                            vm.vehicleMenu = false;
                        }else {
                            vehs[i].config[j].active;
                            vm.vehicleMenu = false;
                        }
                    }
                }
            }

            //loops through the vehicles and its configuration data and 
            //finds match to show
            var matchStatus = false;
            for(var i=0;i<vehs.length;i++){ 
               // console.log("i"+ i);
                for(var j=0;j<vehs[i].config.length;j++){
                 //   console.log("j"+ j);
                    for(var k=0;k<vehs[i].config[j].values.length;k++){
                     //   console.log("k"+ k);
                        if(id != undefined && id !== '' && id != '' && id.length > 0){
                             if(vehs[i].config[j].values[k].search(id) !== -1 ){
                                vehMenu = true;
                                vehs[i].active = true;
                                vehs[i].config[j].active = true;
                                vehs[i].config[j].datastatus[k] = true;
                                newObj = JSON.stringify(vehs);
                                vm.vehicleMenu = vehMenu;
                                vm.vehicles = JSON.parse(newObj)
                                matchStatus = true;
                            } else if(matchStatus === false && i === vehs.length-1 && j=== vehs[i].config.length-1 && k===vehs[i].config[j].values.length-1 )  {
                                     alert("No match found!");
                            }
                        }else {

                                vehMenu = false;
                                vehs[i].active = false;
                                vehs[i].config[j].active = false;
                                vehs[i].config[j].datastatus[k] = true;
                                newObj = JSON.stringify(vehs);
                                vm.vehicleMenu = vehMenu;
                                vm.vehicles = JSON.parse(newObj);

                                if(k === vehs[i].config[j].values.length-1 && j === vehs[i].config.length-1 && i === vehs.length-1  ){
                                    alert("You should enter an input value to search!");
                                }
                        } 
                    }
                }             
            }
        }
        //End of searchData function

        //get the configuration contents from database
        function getData(){
            sidebarService.getConfig()
            .then(function(response) {
                if(response.data) {
                    vm.dataTree = getDataTree(response.data);
                }
            });

        }

        //recursive function to create the tree structure data
        function getDataTree(data, cKey){
            var tree = [];
            for(var key in data) {
                if(data.hasOwnProperty(key)) {
                    var nodes = [];
                    var newKey = (cKey ? cKey + "." + key : key);

                    if(typeof data[key] === 'object'){
                        nodes = getDataTree(data[key], newKey);
                    }

                    if(nodes.length != 0) {
                        key = initCaps(key);
                    }

                    var node = {
                        'name' : key,
                        'nodes' : nodes,
                        'value' : newKey,
                        'active' : false
                    };

                    tree.push(node)
                }
            }
            return tree;
        }

        //function to capitalise the first letter of a string
        function initCaps(str){
            words = str.split(' ');

            for(var i = 0; i < words.length; i++) {
                var letters = words[i].split('');
                letters[0] = letters[0].toUpperCase();
                words[i] = letters.join('');
            }
            return words.join(' ');
        }
        
	}
});
