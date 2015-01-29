describe('<%= componentModuleName %>', function () {

  var $scope;

  beforeEach(module('<%= componentModuleName %>'));
  beforeEach(module('<%= componentTplDir %>/<%= componentId %>.html'));

  beforeEach(inject(function ($rootScope) {
    $scope = $rootScope;
  }));

  // http://jasmine.github.io/2.0/introduction.html

  describe("this thing", function () {
    it("should be true", function () {
      expect(true).toBe(true);
    });

  });


});
