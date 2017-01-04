(function () {
'use strict';

angular.module('MenuCategoriesApp', [])
.controller('MenuCategoriesController', MenuCategoriesController)
.service('MenuCategoriesService', MenuCategoriesService)
.constant('ApiBasePath', "http://davids-restaurant.herokuapp.com")
.directive('foodListItems', FoodListItemsDirective);

function FoodListItemsDirective() {
   var ddo = {
     templateUrl:'foodListItemsDirective.html',
     scope: {
     items: '<',
     myTitle: '@itemName',
     onRemove: '&'
     },
    controller: FoodListItemsDirectiveController,
    controllerAs: 'list',
    bindToController: true
  };

  return ddo;
}

function FoodListItemsDirectiveController() {
  var list = this;
  list.myTitle='algo';

  list.items = function (shortName) {
    var promise = MenuCategoriesService.getMenuForCategory(shortName);

    promise.then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    })
  };
}

MenuCategoriesController.$inject = ['$filter','MenuCategoriesService'];
function MenuCategoriesController($filter,MenuCategoriesService) {
  var menu = this;
  var itemName='';

  menu.getMenuCategories=function(Palabra){

    var promise = MenuCategoriesService.getMenuCategories();
      promise.then(function (response) {
        menu.categories= $filter('filter')(response.data, Palabra);
      })
      .catch(function (error) {
        console.log("Something went terribly wrong.");
      });
  }


  // menu.logMenuItems = function (shortname) {
  //   var promise = MenuCategoriesService.getMenuForCategory(shortname);
  //
  //   promise.then(function (response) {
  //     console.log(response.data);
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   })
  // };

}


MenuCategoriesService.$inject = ['$http','ApiBasePath'];
function MenuCategoriesService($http,ApiBasePath) {
  var service = this;

  service.getMenuCategories = function () {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/categories.json")
    });

    return response;
  };


  service.getMenuForCategory = function (shortName) {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json"),
      params: {
        category: shortName
      }
    });

    return response;
  };

}

})();
