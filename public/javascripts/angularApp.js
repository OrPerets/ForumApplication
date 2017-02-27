var app = angular.module('forum', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
        // ensure posts are loaded
        postPromise: ['posts', function(posts) {
          return posts.getAll();
        }]
      }
    })
    .state('posts', {
       url: '/posts/{id}', // id is the router parameter
      templateUrl: '/posts.html',
      controller: 'PostsCtrl',
      resolve: {
      post: ['$stateParams', 'posts', function($stateParams, posts) {
        return posts.get($stateParams.id);
      }]
      }
    });

  $urlRouterProvider.otherwise('home');
}]);

// factory and service are instance of provider
app.factory('posts', ['$http', function($http){
  var all = {
    posts: []
  };
  all.getAll = function() {
    return $http.get('/posts').success(function(data) {
      //create a deep copy
      angular.copy(data, all.posts);      
    });
  }

  all.create = function(post) {
    return $http.post('/posts', post).success(function(data){
      all.posts.push(data);
    });
  };

  all.upvote = function(post) {
    return $http.put('/posts/'+ post._id + '/upvote').success(function(data){
      post.upvotes +=1;
    });
  };

  all.get = function(id) {
    return $http.get('/posts/' + id).then(function(res){
      return res.data;
    });
  };

  all.addComment = function(id, comment) {
    return $http.post('/posts/' + id + '/comments', comment);
  };

  all.upvoteComment = function(post, comment) {
    return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
    .success(function(data){
      comment.upvotes += 1;
    });
  };

  return all;
}]);

app.controller('MainCtrl', [
'$scope',
'posts',
function($scope, posts){
$scope.posts = posts.posts;
$scope.addPost = function(){
  if(!$scope.title || $scope.title === '') { return; }
  posts.create({
    title: $scope.title,
    link: $scope.link,
  });
  $scope.title = '';
  $scope.link = '';
};
$scope.incrementUpvotes = function(post) {
  //post passing by reference
  posts.upvote(post);
};
}]);

app.controller('PostsCtrl', [
  '$scope',
  'posts',
  'post',
  function($scope, posts, post) {
    $scope.post = post;
    $scope.addComment = function(){
      posts.addComment(post._id, {
        body: $scope.body,
        author: 'user',
      }).success(function(comment) {
        $scope.post.comments.push(comment);
      });
      $scope.body = '';
    };
    $scope.incrementUpvotes = function(comment) {
      posts.upvoteComment(post, comment);
    };
}]);
