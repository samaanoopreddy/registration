var app=angular.moddule('webApps',['ngRoute']);
app.controller('registerController',registerController);
function registerController($scope){
	$scope.users = [{name:'',password:'',email:''}];
	$scope.register = function(){
		$scope.users.push({name:$scope.name,password:$scope.password,email:$scope.email});


	}
}