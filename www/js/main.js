var app = angular.module('werewolf', []);
app.controller('werewolf_ctrl', function($scope) {
  $scope.num_villagers = 4;
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
      $("#game_container").fadeIn(500);
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
  $scope.charType = ["Villager","Werewolf","Seer","Witch"]
  $scope.curr_char = 1;
	
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
    var total = $scope.num_villagers + $scope.num_werewolf;
		for(var i=0;i<$scope.num_villagers-2;i++){
      $scope.player_selection.push(0);
    }
    
    for(var i=0;i<$scope.num_werewolf;i++){
      $scope.player_selection.push(1);
    }
		
		$scope.player_selection.push(2);
		$scope.player_selection.push(3);
		
    $scope.shuffle();
  }
  
  
  $scope.startgame = function() {
    if($scope.num_werewolf<1){
      $scope.warning = "Select at least four villagers and one werewolf";
    } else if($scope.num_villagers<4 ){
      $scope.warning = "Select at least four villagers and one werewolf";
    } else if($scope.num_werewolf>=$scope.num_villagers) {
      $scope.warning = "There should be more people than werewolf(s)";
    } else if($scope.num_werewolf + $scope.num_villagers > 9) {
      $scope.warning = "This game currently supports 9 characters maximum";
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
    } else if($scope.player_selection[$scope.player_num-1]==1){
      $("#wolf_img").fadeIn(500);
    } else if($scope.player_selection[$scope.player_num-1]==2){
      $("#seer_img").fadeIn(500);
    } else {
			$("#witch_img").fadeIn(500);
		}

    $("#sideB").fadeIn(500);
  }
	
  $scope.showNextChar = function() {	    
    $("#character_container").fadeOut(0);
    $scope.player_num++;
    
    setTimeout(function(){
      $("#wolf_img").hide();
      $("#monk_img").hide();
      $("#seer_img").hide();
      $("#witch_img").hide();
      $("#sideB").hide();  
      setTimeout(function(){
       
        if($scope.player_num-1<$scope.player_selection.length)
          $("#character_container").fadeIn(400);
        else 
          $("#game_container").fadeIn(300);
      },400);
    },500);   
  }
  
  $scope.winningCondition = false;
	$scope.currentlyPlaying = false;
  $scope.start = function() {
		if($scope.winningCondition){
			//show winner
		} else {
			if(!currentlyPlaying)
				$("#game_container").fadeOut(400);
			else {
				//fade
			}
			
			
			//night
			setTimeout(function(){
      	$("#night_everyone").fadeIn(400);
						
				setTimeout(function(){
					$("#night_everyone").fadeOut(400);

					setTimeout(function(){
						$("#open_eyes").fadeIn(400);
						setTimeout(function(){
						$("#open_eyes").fadeOut(400);
									$("#open_eyes").fadeOut(400);
							
						},5000);
						},5000);
					},500);
					
				},5000);
				
				
				
				
			
    	},500);
			
			
			
			
		}
		$scope.currentlyPlaying = true;
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