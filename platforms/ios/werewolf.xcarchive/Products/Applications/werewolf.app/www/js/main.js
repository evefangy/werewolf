var app = angular.module('werewolf', ["ngRoute"]);
  app.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl: "/views/main.html"
  })
  .when("/game", {
    templateUrl: "/views/game.html"
  })
  .when("/settings", {
    templateUrl: "/views/settings.html"
  })
  .when("/showchar", {
    templateUrl: "/views/showchar.html"
  })
});

app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);

app.controller('werewolf_ctrl', function($scope) {
  $scope.num_villagers = 4;
  $scope.num_werewolf = 1;
  $scope.warning = "";
  $scope.player_selection = [];
  $scope.charType = ["Villager","Werewolf","Seer","Witch"]
  $scope.curr_char = 1;
  $scope.victim = 0;
	$scope.target = 0;
	$scope.po_victim = 0;
  $scope.player_num = 1;
	$scope.wolf = []
	$scope.med = 1;
	$scope.poison = 1;
	
  //modify people
  $scope.decreaseV = function(){ if($scope.num_villagers>0) $scope.num_villagers--; }
  $scope.decreaseW = function(){ if($scope.num_werewolf>0) $scope.num_werewolf--; }
  $scope.increaseV = function(){ $scope.num_villagers++; }
  $scope.increaseW = function(){ $scope.num_werewolf++; }

  //navigation
  $scope.tutorial = function() {
    $("#main_container").fadeOut(500);
    setTimeout(function(){
      $("#game_container").fadeIn(500);
    },600);
  } 

  //shuffles the player_selection array
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

  //generate shuffled array for player_selection array
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
		
		
		//find the players who are wolfs, initiate player status
		console.log("wolves")
		for (var i = 0; i<total; i++){
			if ($scope.player_selection[i] == 1){
				$scope.wolf.push(i+1) //index starts with 0, but players start with player 1
				console.log(i+1)
			}
			$scope.status[i] = 1;
		}
		
		
		setTimeout(function(){
			
		}, 500)
 }
  
  //setup characters for players
  $scope.game_setup = function() {
    if($scope.num_werewolf<1){
      $scope.warning = "Select at least four villagers and one werewolf";
    } else if($scope.num_villagers<4 ){
      $scope.warning = "Select at least four villagers and one werewolf";
    } else if($scope.num_werewolf>=$scope.num_villagers) {
      $scope.warning = "There should be more people than werewolf(s)";
    } else if($scope.num_werewolf + $scope.num_villagers > 9) {
      $scope.warning = "This game currently supports 9 characters maximum";
    } else {
      $scope.warning = "";
      $("#second_container").fadeOut(500);
      setTimeout(function(){
        $("#character_container").fadeIn(500);
      },600);  
    }
    $scope.player_num = 1;
    $scope.random_generate();
  }
  
  //show the character card
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
  
  //hide current character, move to next character
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
          $("#character_container").fadeIn(500);
        else 
          $("#game_container").fadeIn(300);
      },400);
    },500);   
  }

  $scope.status = []; //player_selection is identity, index of the array is the player number

  function compile(element){
    var el = angular.element(element);    
    $scope = el.scope();
    $injector = el.injector();
    $injector.invoke(function($compile){
      $compile(el)($scope)
    });     
  }

	
	/*  create vote  */
 $scope.createVote = function(){
    console.log("clicked");
    var name = "vote";
    
    while(document.getElementById(name).hasChildNodes()) {
      document.getElementById(name).removeChild(document.getElementById(name).lastChild);
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

          vote_txt.innerHTML = "Player " + (i*3+j+1); 
          vote.setAttribute("id","player" + (i*3+j+1)); 
          vote.setAttribute("class","votechar");
          vote_txt.setAttribute("class","votechar_txt");
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
        }
        num_added++;	
      }

      document.getElementById(name).appendChild(votebox);
    }
		//compile btns for selecting targets
		setTimeout(function(){
			var total = $scope.num_villagers+$scope.num_werewolf;
			for(var i=0;i<$scope.num_villagers+$scope.num_werewolf;i++){
				for(var j=0;j<3;j++){
					if(total>0){
						compile(document.getElementById("player"+(i*3+j+1)));
						total--;
					}
				}
			}
		},500);
  }

	function showVote(playerNumber){
    $("#x"+playerNumber).css("z-index",3);
  }

  function hideVote(playerNumber){
    $("#x"+playerNumber).css("z-index",-1);
  }

  $scope.vote_pend = function(playerNumber){
    console.log("target")
		console.log(playerNumber);
    if ($scope.target != playerNumber){
      hideVote($scope.target);
			
				$scope.target = playerNumber;
			
    }
										
		$scope.target = playerNumber;
	
    showVote(playerNumber);
  }

	
	
	/*  werwolf to seer transition  */ /* need timer for when seer is dead */
  $scope.kill = function(){
		$scope.victim = $scope.target;
//		console.log("here");
		
    $scope.status[$scope.victim] = 0;	
//    $("#wolf3").fadeOut(600);
    $("#vote").fadeOut(600);
    setTimeout(function(){
      $("#char_close").fadeIn(400);
      setTimeout(function(){
        $("#char_close").fadeOut(400);
          setTimeout(function(){
          
					$scope.$apply(function(){
						$scope.curr_char = 2;
					});

          setTimeout(function(){
//            console.log("curr_char ");
//            console.log($scope.charType[$scope.curr_char]);
            $("#char_open").fadeIn(400);
            setTimeout(function(){
              $("#seer1").fadeIn(400);
              setTimeout(function(){
                $("#seer2").fadeIn(400);
                setTimeout(function(){
                  $("#char_open").fadeOut(400);
                  $("#seer1").fadeOut(400); 
                  $("#seer2").fadeOut(400);
                  setTimeout(function(){
                     $scope.createVote();		
                    var confirm_btn = document.createElement("div");
                    confirm_btn.setAttribute("class","front_btn");
                    confirm_btn.innerHTML = "Confirm";
                    confirm_btn.setAttribute("id","check")
                    confirm_btn.setAttribute("ng-click", "check()") 
                    document.getElementById("vote").appendChild(confirm_btn);
                    setTimeout(function(){
                      compile(document.getElementById("check"));
                    }, 500)
                    $("#vote").fadeIn(800);
                  },1300);
                },2000);
              },2000);
            },2000);
          },800);
        },600);
      },3000);
    },1000);
  }

  
	$scope.check = function(){
		console.log("seer check");
		var test = 0;
		$scope.seer_check = $scope.target;

		console.log($scope.seer_check)
		console.log("wolf_id")
		
		
		for (var i = 0; i<$scope.wolf.length; i++){
			console.log($scope.wolf[i])
			if ($scope.seer_check == $scope.wolf[i]){
				test = 1;
				console.log("here")
			}
		}
		$("#vote").fadeOut(600);
		setTimeout(function(){
			if(test == 1){
				$("#seer_y").fadeIn(400);
			}
			else{
				$("#seer_n").fadeIn(400);
			}
				
			setTimeout(function(){
					$("#seer_y").fadeOut(400);
					$("#seer_n").fadeOut(400);
					setTimeout(function(){
					$("#char_close").fadeIn(400);
					setTimeout(function(){
						$("#char_close").fadeOut(400);
							setTimeout(function(){

							$scope.$apply(function(){
								$scope.curr_char = 3;
							});

							setTimeout(function(){
								$("#char_open").fadeIn(400);
								setTimeout(function(){
									$("#witch1").fadeIn(400);
									setTimeout(function(){
										$("#witch2").fadeIn(400);
										setTimeout(function(){
											$("#char_open").fadeOut(400);
											$("#witch1").fadeOut(400); 
											$("#witch2").fadeOut(400);
											setTimeout(function(){
													$("#witch_actions").fadeIn(400);
												}, 600)
											},1300);
										},2000);
									},2000);
								},2000);
							},800);
						},600);
					},3000);
				},1000);
		},2000);
		
	}
							 
							 
						 
							 
	
  $scope.winningCondition = false;
	$scope.winner = "";
  $scope.currentlyPlaying = false;
	$scope.check_winning = function(){
		var wol_alive = 0;
		var tot_alive = 0;
		for (var i=0; i<$scope.wolf.length; i++){
			if ($scope.status[i] == 1){
				wol_alive += 1
			}
		}
		for (var j=0; j<$scope.status.length; j++){
			if ($scope.status[j] == 1){
				tot_alive += 1
			}
		}
		var vil_alive = tot_alive-wol_alive;
//		console.log(vil_alive)
//		console.log(wol_alive)
		
		
		if (vil_alive == wol_alive){
			$scope.winningCondition = true;
			$scope.winner = "WEREWOLVES"
		}
		else if(wol_alive == 0){
			$scope.winningCondition = true;
			$scope.winner = "VILLAGERS"
		} 
		
		console.log($scope.winner)
	}
	
  
  
  $scope.start = function() {
//    console.log("start");
    
    
//    console.log($("#ann1").show());
    
    
    
    
    
//    $("#main_container").fadeOut(400); 
//    console.log("hello");
		
		$scope.check_winning()
		
		setTimeout(function(){
			if($scope.winningCondition){
				//show winner
//				$("vote").fadeOut(400)
				console.log("winning condition fit");
				setTimeout(function(){
					$("#winner").fadeIn(400);
          setTimeout(function(){
            $("#winner").fadeIn(400);
          },2000);
				},1000);
				$scope.currentlyPlaying = false;
				/* add more details about the game: identities, etc.   Provide options to go back to title page*/

			} 
			else {
					if(!$scope.currentlyPlaying){
						$("#game_container").fadeOut(400);
						$("#main_container").fadeOut(400);
						$("#morning_everyone").fadeOut(400); 
					} 
	//				else {
	//				//fade
	//				}

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
											$("#char_open").fadeOut(1000);
											$("#wolf1").fadeOut(1000); 
											$("#wolf2").fadeOut(1000);
											setTimeout(function(){
												$scope.createVote();
												var confirm_btn = document.createElement("div");
												confirm_btn.setAttribute("class","front_btn");
												confirm_btn.innerHTML = "Confirm";
												confirm_btn.setAttribute("id","kill");
												confirm_btn.setAttribute("ng-click", "kill()") ;
												document.getElementById("vote").appendChild(confirm_btn);
												setTimeout(function(){
													compile(document.getElementById("kill"));
												}, 500)
												$("#vote").fadeIn(400);
											},1300);
										},700);
									},2000);
								},2400);
							},600); //night_everyone close
						},3000); //night_everyone------change back
					},500);	
					$scope.currentlyPlaying = true;
				} //end of else for winning condition not met
			}, 1000) //end of winning checking
  } //end of start()
  
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
	
	$scope.save = function() {
		$("#witch_actions").fadeOut(400);
		if ($scope.med == 1){
			$scope.status[$scope.victim] = 1;
			$scope.victim = 0;
			$scope.med = 0;
			
		}
		else{
			$scope.warning = "You don't have any medicine left";
			$("#witch_actions").fadeIn(400);
		}
		$scope.nothing();
	}
	
	$scope.poison = function() {
			$("#witch_actions").fadeOut(400);
			if ($scope.poison == 1){
				$scope.poison = 0;
				// still need implemnet
				 $scope.createVote();		
				var confirm_btn = document.createElement("div");
				confirm_btn.setAttribute("class","front_btn");
				confirm_btn.innerHTML = "Confirm";
				confirm_btn.setAttribute("id","check")
				confirm_btn.setAttribute("ng-click", "vote_poison()") 
				document.getElementById("vote").appendChild(confirm_btn);
				setTimeout(function(){
					compile(document.getElementById("check"))
				},500);
			}
			else{
				$scope.warning = "You don't have any poison left";
				$("#witch_actions").fadeIn(400);
			}
		}
	
		$scope.vote_poison = function(){
			$scope.po_victim = $scope.target;
			$scope.nothing();
		}
		
		$scope.nothing = function(){
			$("#witch_actions").fadeOut(400);
			$("vote").fadeOut(400);
		
			//day
			setTimeout(function(){
				$("#morning_everyone").fadeIn(400);
				setTimeout(function(){
					$("#morning_seq").fadeOut(400);
					setTimeout(function(){
						$("#announce_victim").fadeIn(400);
						},600)
					}, 2000)
			},3000)
		}
			


		$scope.fatalities = [
			"A body has been found with deep bite marks.",
			"Someone has been found in a puddle of blood, wait it's just ketchup",
			"Someone has been found roasting in an oven",
			"A body has been found, stuffed with veggies",
			"A body was found with half a bite, must've tasted bad."
		];

		$scope.show_vic = function(){
			$("#show_victim").fadeOut(400);
			if($scope.victim != 0){
				$("#vic").fadeIn(400);
			}
			if($scope.po_victim != 0){
				$("#poisoned").fadeIn(400);
				$scope.po_victim = 0
			}
			
			if($scope.victim == 0 && $scope.po_victim == 0){
				$("#safe_night").fadeIn(400);
			}
			
			setTimeout(function(){
				$("#announce_victim").fadeOut(400)
				$("#vic").fadeOut(400);
				$("#poisoned").fadeOut(400);
				$("#safe_night").fadeOut(400);
					setTimeout(function(){
//						$("#announce_victim").fadeOut(400);
						$("#discuss").fadeIn(400);
							setTimeout(function(){
								$("#discuss").fadeOut(400);
								 $scope.createVote();
								var confirm_btn = document.createElement("div");
								confirm_btn.setAttribute("class","front_btn");
								confirm_btn.innerHTML = "Confirm";
								confirm_btn.setAttribute("id","vote_suspect")
								confirm_btn.setAttribute("ng-click", "vote_suspect()") 
								document.getElementById("vote").appendChild(confirm_btn);
								setTimeout(function(){
									compile(document.getElementById("vote_suspect"));
								}, 500)
								$("#vote").fadeIn(800);
							},2000)
						},800)
			}, 7000)
		}//end of show_vic
		
		$scope.vote_suspect = function(){
			$scope.status[$scope.target] = 0;
			setTimeout(function(){
				$("#vote").fadeOut(400)
				setTimeout(function(){
					$scope.start()
				},600)
			},600)
		}
		
});