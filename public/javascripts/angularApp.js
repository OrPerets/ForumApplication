var app = angular.module('forum', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl'
    })
    .state('posts', {
       url: '/posts/{id}', // id is the router parameter
      templateUrl: '/posts.html',
      controller: 'PostsCtrl'
    })

  $urlRouterProvider.otherwise('home');
}]);

// factory and service are instance of provider
app.factory('posts', [function(){
  var all = {
    posts: []
  };
  return all;
}]);

app.controller('PostsCtrl', [
  '$scope',
  '$stateParams',
  'posts',
  function($scope, $stateParams, posts) {
    $scope.post = posts.posts[$stateParams.id];
    $scope.addComment = function(){
      if($scope.body === '') { return; }
      $scope.post.comments.push({
        body: $scope.body,
        author: 'user',
        upvotes: 0
      });
      $scope.body = '';
};
  }]);


app.controller('MainCtrl', [
'$scope',
'posts',
function($scope, posts){
$scope.posts = posts.posts;
$scope.addPost = function(){
  if(!$scope.title || $scope.title === '') { return; }
  $scope.posts.push({
    title: $scope.title,
    link: $scope.link,
    upvotes: 0,
    comments: []
  });
  $scope.title = '';
  $scope.link = '';
};
$scope.incrementUpvotes = function(post) {
  //post passing by reference
  post.upvotes += 1;
};
}]);