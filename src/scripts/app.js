
var ecApp = angular.module('ecApp',['ngRoute']);
ecApp.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/goods', {
      templateUrl: '/partials/goods.html',
      controller: 'goodsController'
    })
    .when('/search', {
      templateUrl: '/partials/search.html',
      controller: 'searchController'
    })
    .when('/add', {
      templateUrl: '/partials/add.html',
      controller: 'addController'
    })
    .when('/user', {
      templateUrl: '/partials/user.html',
      controller: 'userController'
    })
    .when('/searchuser', {
      templateUrl: '/partials/searchuser.html',
      controller: 'searchUserController'
    })
    .otherwise({
      redirectTo: '/goods'
    })
}]);
ecApp.controller('indexController',['$scope' ,'$http',  function($scope,$http){
  //获取导航数据
  $http({
    url: '/mock/list.json'
  })
  .then(function(res){
    $scope.lists = res.data;
  }, function(){
    ;
  });
  //获取品牌列表数据
  $http({
    url: '/mock/url.json'
  })
  .then(function(res){
    $scope.urls = res.data;
  }, function(){
    ;
  });
  //导航  维护数据index
  $scope.index = 0;
  $scope.change = function(el){
    $scope.index = el;
  }
  $scope.$on('changeindex',function(event, id){
    $scope.index = id.index;
  });
  //页内查找
  $scope.keywords = "";
  $scope.search = function() {
    if ($scope.keywords) {
      console.log(0);
    }
  };
}]);

ecApp.controller('goodsController',['$scope', '$http', function($scope,$http){
  $scope.index = 0;
  $scope.$emit('changeindex',$scope);

  //远端数据进行本地存储
  $http({
    url: '/mock/goods.json'
  })
  .then(function(res){
    var strGoods = JSON.stringify(res.data);
    localStorage.setItem('goods',strGoods);
  }, function(){
    ;
  });
  //加载本地存储的数据
  var edit=[];
  var arrgoods = JSON.parse(localStorage.getItem('goods'));
  for(var i=0; i<arrgoods.length; i++){
    edit[i]= true;
  }
  $scope.goods = arrgoods;
  $scope.edit = edit;


  //点击修改
  $scope.alter = function(el){
    $scope.edit[el] = false;
  }
  //修改后保存
  $scope.save =function(el){
    $scope.edit[el] = true;
    arrgoods[el].id = $scope.goods[el].id;  //保存修改的信息
    arrgoods[el].name = $scope.goods[el].name;
    arrgoods[el].imgsrc = $scope.goods[el].imgsrc;
    arrgoods[el].price = $scope.goods[el].price;
    arrgoods[el].count = $scope.goods[el].count;
    localStorage.setItem('goods',JSON.stringify(arrgoods));
  }
  //删除
  $scope.del = function(el){
    arrgoods.splice(el,1);
    localStorage.setItem('goods',JSON.stringify(arrgoods));
  }
}]);

ecApp.controller('searchController',['$scope', '$http', function($scope,$http){
  $scope.index = 1;
  $scope.$emit('changeindex',$scope);
  //实现查找功能
  var goodlist = JSON.parse(localStorage.getItem('goods'));
  $scope.goodlist = goodlist;
  $scope.notseen = true;  //查询结果不可见
  $scope.edit = true;
  $scope.value = '';
  $scope.search = function(){
    $scope.agood = [];
    if($scope.goodlist[$scope.value*1-1]){
      $scope.notseen = false;
      $scope.agood = $scope.goodlist[$scope.value*1-1];
    }
    else{
      console.log(1);
      $('#myModal').modal();
    }
  };
  //修改
  $scope.alter = function(){
    $scope.edit = false;
  }
  //修改后保存
  $scope.save =function(){
    goodlist[$scope.value*1-1] = $scope.agood;  //修改后的对象 存入数组对应项
    $scope.edit = true;
    localStorage.setItem('goods',JSON.stringify(goodlist));
  }
  //删除
  $scope.del = function(el){
    arrgoods.splice(el,1);
    localStorage.setItem('goods',JSON.stringify(arrgoods));
  }
}]);

ecApp.controller('addController',['$scope',function($scope){
  $scope.index = 2;
  $scope.$emit('changeindex',$scope);
  $scope.add = function(){
    var goodlist = JSON.parse(localStorage.getItem('goods'));
    if(goodlist[$scope.addgood.id*1]){
         $('#addModal').modal();
      }
      else{
        goodlist.push($scope.addgood);
        localStorage.setItem('goods',JSON.stringify(goodlist));
        $('#successModal').modal();
        $scope.addgood=[];
      }
  }
}]);

ecApp.controller('userController',['$scope', '$http', '$timeout', function($scope,$http,$timeout){
  $scope.index = 3;
  $scope.$emit('changeindex',$scope);

  //远端数据进行本地存储
  $http({
    url: '/mock/user.json'
  })
  .then(function(res){
    var strUsers = JSON.stringify(res.data);
    localStorage.setItem('users',strUsers);
  }, function(){
    ;
  });
  //加载本地存储的数据
  var edit=[];
  var arrusers = JSON.parse(localStorage.getItem('users'));
  for(var i=0; i<arrusers.length; i++){
    edit[i]= true;
  }
  $scope.users = arrusers;
  $scope.edit = edit;
  $scope.show = false;  //未登录时不显示用户

  //点击修改
  $scope.alter = function(el){
    $scope.edit[el] = false;
  }
  //修改后保存
  $scope.save =function(el){
    $scope.edit[el] = true;
    arrusers[el].id = $scope.users[el].userid;  //保存修改的信息
    arrusers[el].name = $scope.users[el].username;
    arrusers[el].imgsrc = $scope.users[el].usertype;
    arrusers[el].price = $scope.users[el].userpass;
    arrusers[el].count = $scope.users[el].email;
    localStorage.setItem('users',JSON.stringify(arrusers));
  }
  //删除
  $scope.del = function(el){
    arrusers.splice(el,1);
    localStorage.setItem('users',JSON.stringify(arrusers));
  }
  $timeout(function(){
    $('#myModal').modal();
  },0)
  $scope.login = function(){
    var info = JSON.parse(localStorage.getItem('userinfo'));
    if($scope.admin.name == info.id&&$scope.admin.pass ==info.pass){
        $scope.show = true;  //登陆成功后显示用户列表
    }
  }

}]);

ecApp.controller('searchUserController',['$scope','$timeout', function($scope,$timeout){
  $scope.index = 4;
  $scope.$emit('changeindex',$scope);
  var userinfo = {
    id: "admin",
    pass: "admin123"
  }
  localStorage.setItem('userinfo',JSON.stringify(userinfo));
  $timeout(function(){
    $('#loginModal').modal();
  },0)
  $scope.login = function(){
    var info = JSON.parse(localStorage.getItem('userinfo'));
    if($scope.admin.name == info.id&&$scope.admin.pass ==info.pass){

    }
  }

  var userlist = JSON.parse(localStorage.getItem('users'));
  $scope.userlist = userlist;
  $scope.notseen = true;  //查询结果不可见
  $scope.edit = true;
  $scope.value = '';
  $scope.search = function(){
    $scope.user = [];
    if($scope.userlist[$scope.value*1-1]){
      $scope.notseen = false;
      $scope.user = $scope.userlist[$scope.value*1-1];
    }
    else{
      console.log(1);
      $('#myModal').modal();
    }
  };
  //修改
  $scope.alter = function(){
    $scope.edit = false;
  }
  //修改后保存
  $scope.save =function(){
    userlist[$scope.value*1-1] = $scope.user;  //修改后的对象 存入数组对应项
    $scope.edit = true;
    localStorage.setItem('users',JSON.stringify(userlist));
  }
  //删除
  $scope.del = function(el){
    arrgoods.splice(el,1);
    localStorage.setItem('goods',JSON.stringify(arrgoods));
  }
}]);
