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
	$scope.victim = 0;
	
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
		
		for(var i=0;i<$scope.num_werewolf+2;i++){
			$scope.status.push(1); //player is alive
		}
		
  }
  
  
  $scope.startgame = function() {
//		createVote();
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
  
	

	status = []; //player_selection is identity, index of the array is the player number
	
	function compile(element){
		var el = angular.element(element);    
		$scope = el.scope();
			$injector = el.injector();
			$injector.invoke(function($compile){
				 $compile(el)($scope)
			})     
	}
	
	function createVote(){
		while(document.getElementById("vote").hasChildNodes()) {
			document.getElementById("vote").removeChild(document.getElementById("vote").lastChild);
		}

		var total_players = $scope.num_werewolf + $scope.num_villagers;
		var num_added = 0;

		for(var i=0;i<total_players/3;i++){
			var votebox = document.createElement("center");
			votebox.setAttribute("class","box_row");
			for(var j=0;j<3;j++){
				if(num_added<total_players){
					var vote = document.createElement("div");
					var vote_txt = document.createElement("center");
					var x_img = document.createElement("img");
//					var playerNumber = i*3+j+1;
					
					vote_txt.innerHTML = "Player " + (i*3+j+1); 
					vote.setAttribute("id","player" + (i*3+j+1)); 
					vote.setAttribute("class","votechar");
					vote_txt.setAttribute("class","votechar_txt");
//					vote.setAttribute("id",i*3+j+1)
					var playerNumber = i*3+j+1;
					vote.setAttribute("ng-click","vote_pend("+playerNumber+")"); 
					
					x_img.setAttribute("class","x");
					x_img.setAttribute("width","90px");
					x_img.setAttribute("src","img/x.png");
					x_img.setAttribute("id","x"+(i*3+j+1));
					x_img.setAttribute("style", "");
					
					vote.appendChild(vote_txt);
					vote.appendChild(x_img);
					votebox.appendChild(vote);
					
//					setTimeout(function(){
//						compile(document.getElementById("player"+(i*3+j+1)));
//					},5000);
				}
				num_added++;
				
			}

			document.getElementById("vote").appendChild(votebox);
		}
			var confirm_btn = document.createElement("div");
			confirm_btn.setAttribute("class","front_btn");
			confirm_btn.innerHTML = "Confirm";
//			confirm_btn.setAttribute("ng-click", "") different sinarios
			
			votebox.appendChild(confirm_btn);
	}
	
	function kill(){
		
		status[victim] = 0;	
	}
	
	
	function showVote(playerNumber){
		$("#x"+playerNumber).css("z-index",3);
	}
	
	function hideVote(playerNumber){
		$("#x"+playerNumber).css("z-index",-1);
	}
	
	$scope.vote_pend = function(playerNumber){
		console.log(playerNumber);
		if ($scope.victim != playerNumber){
			hideVote($scope.victim);
			$scope.victim = playerNumber;
		}
		$scope.victim = playerNumber;
		showVote(playerNumber);
	}
	
	createVote();
	var nums=0;
	setTimeout(function(){
		for(var i=0;i<($scope.num_werewolf + $scope.num_villagers);i++){
			for(var j=0;j<3;j++){
				if(nums<($scope.num_werewolf + $scope.num_villagers)){
					
					console.log("player"+(i*3+j+1));
					compile(document.getElementById("player"+(i*3+j+1)));
				}
				nums++;
			}
		}
		
		
	},2000);
	
//	
	
	
	

//	createVote();
	
	
  $scope.winningCondition = false;
	$scope.currentlyPlaying = false;
  $scope.start = function() {
		$("#main_container").fadeOut(400);
		console.log("hello");
		if($scope.winningCondition){
			//show winner
		} else {
			if(!$scope.currentlyPlaying){
				$("#game_container").fadeOut(400);
				$("#main_container").fadeOut(400);
			}
			else {
				//fade
			}
			
			//night
			setTimeout(function(){
      	$("#night_everyone").fadeIn(400); //start night
						
				setTimeout(function(){
					$("#night_seq").fadeOut(500);

					setTimeout(function(){
						$("#char_open").fadeIn(400); //start werewolf
						setTimeout(function(){
							$("#wolf1").fadeIn(400); //que werewolf dialogue
							setTimeout(function(){
								$("#wolf2").fadeIn(400); //que werewolf dialogue
								
								
								setTimeout(function(){
									$("#char_open").fadeOut(400);
									$("#wolf1").fadeOut(400); 
									$("#wolf2").fadeOut(400);
									setTimeout(function(){
										createVote();		
										$("#vote").fadeIn(400);
									},1000);
													 },700);
							},1700);
						},1900);
					},600); //night_everyone close
					
				},2000); //night_everyone------change back
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