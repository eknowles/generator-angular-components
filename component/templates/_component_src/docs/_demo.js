angular.module('<%= _.camelize(libraryName) %>Demo').controller('<%= classedName %>DemoCtrl', function ($scope) {
  $scope.demoControllerVar = 'I am a demo controller var';
});
