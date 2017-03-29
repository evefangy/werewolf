var app = angular.module('werewolf', []);
app.controller('werewolf_ctrl', function($scope) {
  $scope.num_villagers = 2;
  $scope.num_werewolf = 1;

  //modify people
  $scope.decreaseV = function(){
    if($scope.num_villagers>0) $scope.num_villagers--;
  }
  $scope.decreaseW = function(){
    if($scope.num_werewolf>0) $scope.num_werewolf--;
  }
  $scope.increaseV = function(){
    $scope.num_villagers++;
  }
  $scope.increaseW = function(){
    $scope.num_werewolf++;
  }
  
  
  //navigation
  $scope.tutorial = function() {
    $("#main_container").fadeOut(500);
    setTimeout(function(){
      $("#third_container").fadeIn(500);
    },600);
  } 

  $scope.newgame = function() {
    $("#main_container").fadeOut(500);

    setTimeout(function(){
      $("#second_container").fadeIn(500);
    },600);
  } 
  
  $scope.back = function() {
    $("#third_container").fadeOut(500);
    $("#second_container").fadeOut(500);

    setTimeout(function(){
      $("#main_container").fadeIn(500);
    },600);
  }

  $scope.warning = "";
  $scope.player_selection = [];
  $scope.charType = ["Villager","Werewolf"]
  $scope.player_num = 1;
  
  $scope.shuffle = function(){
    var currentIndex = $scope.player_selection.length;
    var temp;
    var randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex!==0) {  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temp = $scope.player_selection[currentIndex];
      $scope.player_selection[currentIndex] = $scope.player_selection[randomIndex];
      $scope.player_selection[randomIndex] = temp;
    }
  }
  
  $scope.random_generate = function() {
    for(var i=0;i<$scope.num_villagers;i++){
      $scope.player_selection.push(0);
    }
    
    for(var i=0;i<$scope.num_werewolf;i++){
      $scope.player_selection.push(1);
    }
    $scope.shuffle();
  }
  
  
  $scope.startgame = function() {
    if($scope.num_werewolf==0){
      $scope.warning = "Select at least two villagers and one werewolf";
    } else if($scope.num_villagers==0){
      $scope.warning = "Select at least two villagers and one werewolf";
    } else if($scope.num_werewolf>=$scope.num_villagers) {
      $scope.warning = "There should be more people than werewolf(s)";
    } else {
      $scope.random_generate();
      $scope.warning = "";
      $("#second_container").fadeOut(500);
      setTimeout(function(){
        $("#character_container").fadeIn(500);
      },600);  
    }
  }
	
  
	
  $scope.showChar = function() {
    if($scope.player_selection[$scope.player_num-1]==0){
      $("#monk_img").fadeIn(500);
    }
    else {
      $("#wolf_img").fadeIn(500);
    }

    $("#sideB").fadeIn(500);
  }
	
  $scope.showNextChar = function() {	    
    $("#character_container").fadeOut(0);
    $scope.player_num++;
    
    setTimeout(function(){
      $("#wolf_img").hide();
      $("#monk_img").hide();
      $("#sideB").hide();  
      setTimeout(function(){
       
        if($scope.player_num-1<$scope.player_selection.length)
          $("#character_container").fadeIn(400);
        else 
          $("#game_container").fadeIn(300);
      },300);
    },500);   
  }
  
  
  $scope.start = function() {
    
  }
  
  $scope.viewCharacters = function() {
    $("#game_container").fadeOut(400);
    $scope.player_num = 1;
    setTimeout(function(){
      $("#character_container").fadeIn(400);
    },500);
  }
  
  $scope.goBack = function() {
    $("#game_container").fadeOut(400);
    $scope.player_num = 1;
    $scope.player_selection = [];
    
    setTimeout(function(){
      $("#main_container").fadeIn(400);
    },500);
    
  }
});