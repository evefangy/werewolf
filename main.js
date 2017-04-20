/*********************************/
/*     main file for the game    */
/********************************/

/////// app initiation ///////
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

/////// game logic ///////
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
  $scope.winningCondition = false;
	$scope.winner = "";
  $scope.currentlyPlaying = true; // determine if a round of game is over
	$scope.status = []; //player_selection is identity, index of the array is the player number
  $scope.fat =""; //randomly generate a fatality
  
  //modify people
  $scope.decreaseV = function(){ if($scope.num_villagers>2) $scope.num_villagers--; }
  $scope.decreaseW = function(){ if($scope.num_werewolf>1) $scope.num_werewolf--; }
  $scope.increaseV = function(){ if($scope.num_villagers<10) $scope.num_villagers++; }
  $scope.increaseW = function(){ if($scope.num_werewolf<5) $scope.num_werewolf++; }

  //navigation
  $scope.tutorial = function() {
    $("#main_container").fadeOut(500);
    location.href = "https://xd.adobe.com/view/80a3607b-4daf-4a85-b788-9cac4060e527/screen/2952f8ab-26da-4617-99f1-51ef52695a70/Tutorial";
    setTimeout(function(){
      $("#game_container").fadeIn(500);
    },600);
  } 

  
  ////// Radomly assign a character to each player /////
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

  //generate shuffled array for player_selection array and record werewolves
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

  //show player identities (ng-click function)
  $scope.viewCharacters = function() {
  $("#game_container").fadeOut(400);
  $scope.player_num = 1;
  setTimeout(function(){
    $("#character_container").fadeIn(400);
  },500);
  }

  //go back to the main title (ng-click function)
  $scope.goBack = function() {
    $("#game_container").fadeOut(400);
    $scope.player_num = 1;
    $scope.player_selection = [];

    setTimeout(function(){
      $("#main_container").fadeIn(400);
    },500);
  }

  
  
  //function to help update a variable
  function compile(element){
    var el = angular.element(element);    
    $scope = el.scope();
    $injector = el.injector();
    $injector.invoke(function($compile){
      $compile(el)($scope)
    });     
  }

	
	//////// voting box initialization /////////
 $scope.createVote = function(){
//    console.log("clicked");
    var name = "vote";
    
    while(document.getElementById(name).hasChildNodes()) {
      document.getElementById(name).removeChild(document.getElementById(name).lastChild);
    }

    var total_players = $scope.num_werewolf + $scope.num_villagers;
    var num_added = 0;

//   evenly distrubute the voting box accordingly to the number of player left
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

// display an "x" on the voting box to indicate selection
	function showVote(playerNumber){
    $("#x"+playerNumber).css("z-index",3);
  }

  function hideVote(playerNumber){
    $("#x"+playerNumber).css("z-index",-1);
  }

//   allow players to switch between voting selections 
//  (ensures only one target is selected)
  $scope.vote_pend = function(playerNumber){
//    console.log("target")
//		console.log(playerNumber);
    if ($scope.target != playerNumber){
      hideVote($scope.target);
		  $scope.target = playerNumber;
    }							
		$scope.target = playerNumber;
    showVote(playerNumber);
  }

							 

  //////// check winning conditions //////////
	$scope.check_winning = function(){
		// calcalate number of villagers (including gods) and wolves that are alive
    var wol_alive = 0;
		var tot_alive = 0;
		for (var i=0; i<$scope.wolf.length; i++){
			if ($scope.status[$scope.wolf[i]] == 1){
				wol_alive += 1
			}
		}
		for (var j=0; j<$scope.status.length; j++){
			if ($scope.status[j] == 1){
				tot_alive += 1
			}
		}
		var vil_alive = tot_alive-wol_alive;

    // wolf win
		if (vil_alive == wol_alive){
			$scope.winningCondition = true;
      $scope.$apply(function(){
        $scope.winner = "WEREWOLVES"
      });
		}
		else if(wol_alive == 0){
			$scope.winningCondition = true;
      $scope.$apply(function(){
        $scope.winner = "VILLAGERS"
      });
		} 
		console.log("Winning condition done checking")
		console.log($scope.winner)
	}
	

  /*  werwolf to seer transition  */ /* need timer for when seer is dead */
  $scope.wolf_to_seer = function(){
    // update victim
		$scope.victim = $scope.target;
    $scope.status[$scope.victim] = 0;	
    console.log("victim")
    console.log($scope.victim)
    // fade out all wolf actions and transit to seer action
    $("#vote").fadeOut(600);
    setTimeout(function(){
      var player = document.getElementById('bg3');
      player.play();
      $("#char_close").fadeIn(400);
      setTimeout(function(){
        $("#char_close").fadeOut(400);
        player.pause();
          setTimeout(function(){
            // update next character up
            $scope.$apply(function(){
              $scope.curr_char = 2;
            });
            setTimeout(function(){
              var player1 = document.getElementById('bg6');
              player1.play();
              $("#char_open").fadeIn(400);
              setTimeout(function(){
                $("#seer1").fadeIn(400);
                setTimeout(function(){
                  $("#seer2").fadeIn(400);
                  setTimeout(function(){
                    $("#char_open").fadeOut(400);
                    $("#seer1").fadeOut(400); 
                    $("#seer2").fadeOut(400);
                    player1.pause();
                    setTimeout(function(){
                      $scope.createVote();		
                      var confirm_btn = document.createElement("div");
                      confirm_btn.setAttribute("class","front_btn");
                      confirm_btn.innerHTML = "Confirm";
                      confirm_btn.setAttribute("id","check")
                      confirm_btn.setAttribute("ng-click", "seer_to_witch()") 
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

  /*  seer to witch transition  */
	$scope.seer_to_witch = function(){
		// flag for correct guess on the suspect 
    var test = 0;
    // update suspect
		$scope.seer_check = $scope.target;

    console.log("seer_guess")
		console.log($scope.seer_check)
		
		// check if the proposed suspect is any of the wolves
		for (var i = 0; i<$scope.wolf.length; i++){
			if ($scope.seer_check == $scope.wolf[i]){
				test = 1;
			}
		}
		$("#vote").fadeOut(600);
		setTimeout(function(){
      // report result according to seer's guess
			if(test == 1){
				$("#seer_y").fadeIn(400);
			}
			else{
				$("#seer_n").fadeIn(400);
			}
      
      // fade out seer actions and switch to witch actions
			setTimeout(function(){
					$("#seer_y").fadeOut(400);
					$("#seer_n").fadeOut(400);
					setTimeout(function(){
                    var player2 = document.getElementById('bg7');
                    player2.play();
					$("#char_close").fadeIn(400);
					setTimeout(function(){
						$("#char_close").fadeOut(400);
                        player2.pause();
							setTimeout(function(){
                // update next-up charater
                $scope.$apply(function(){
                  $scope.curr_char = 3;
                });
                
                // witch actions
                setTimeout(function(){
                  var player3 = document.getElementById('bg4');
                  player3.play();
                  $("#char_open").fadeIn(400);
                  setTimeout(function(){
                    $("#witch1").fadeIn(400);
                    setTimeout(function(){
                      $("#witch2").fadeIn(400);
                      setTimeout(function(){
                        $("#char_open").fadeOut(400);
                        $("#witch1").fadeOut(400); 
                        $("#witch2").fadeOut(400);
                        player3.pause();
                        setTimeout(function(){
                            $("#witch_actions").fadeIn(400);
                          }, 600)
                        },1300);
                      },2000);
                    },2000);
                  },2000);
							},800);
						},3000);
					},2000);
				},1000);
		},2000);
	}
  
  
  
 
 ///////   witch actions  ///////// 
	$scope.save = function() {
		$("#witch_actions").fadeOut(400);
		// check if there is any med left to use
    if ($scope.med == 1){
			$scope.status[$scope.victim] = 1;
			$scope.victim = 0;
			$scope.med = 0;
      console.log("victim is saved by witch")
      $scope.nothing();
		}
		else{
      $("#warn").fadeIn(400)
      setTimeout(function(){
        $("#warn").fadeOut(400)
        setTimeout(function(){
          $("#witch_actions").fadeIn(600)
        }, 500)
      }, 2000)
		}
	}
	
	$scope.poison_someone = function() {
    setTimeout(function(){
      $("#witch_actions").fadeOut(400);
			if ($scope.poison == 1){
				$scope.createVote();		
				var confirm_btn = document.createElement("div");
				confirm_btn.setAttribute("class","front_btn");
				confirm_btn.innerHTML = "Confirm";
				confirm_btn.setAttribute("id","poison")
				confirm_btn.setAttribute("ng-click", "vote_poison()") 
				document.getElementById("vote").appendChild(confirm_btn);
				setTimeout(function(){
					compile(document.getElementById("poison")) 
				},500);
        $scope.poison = 0;
        setTimeout(function(){
          $("#vote").fadeIn(400);
        },600) 
			}
			else{
        $("#warn").fadeIn(400)
        setTimeout(function(){
          $("#warn").fadeOut(400)
          setTimeout(function(){
            $("#witch_actions").fadeIn(600)
          }, 500)
        }, 2000)
			}
    }, 700)
			
  }
	
		$scope.vote_poison = function(){
			$scope.po_victim = $scope.target;
      console.log("poisoned")
      console.log($scope.po_victim)
			$scope.nothing();
		}
		
		$scope.nothing = function(){
      $("vote").fadeOut(400);
			$("#witch_actions").fadeOut(400);
			
      setTimeout(function(){
        var player4 = document.getElementById('bg5');
        player4.play();
        $("#char_close").fadeIn(400);
        setTimeout(function(){
          $("#char_close").fadeOut(400);
          player4.pause();
          //day sequence
            var player7 = document.getElementById('bg8');
            player7.play();
    		  $("#night_alt").fadeOut(400);
          setTimeout(function(){
            $("#morning_alt").fadeIn(600);
            setTimeout(function(){
              $("#morning_seq").fadeOut(400);
              setTimeout(function(){
                player7.pause();
                $("#announce_victim").fadeIn(400);
              }, 600)
            }, 2000)
          }, 2000)
        }, 2000)
      }, 2000)
		}
			
    // just for fun /* needs to be implemented*/

		$scope.fatalities = [
			"A body has been found with deep bite marks.",
			"Someone has been found in a puddle of blood... or ketchup?",
			"Someone has been found roasting in an oven",
			"A body has been found, stuffed with veggies",
			"A body was found with half a bite, must've tasted bad."
		];

    ///////////  Day Sequence //////////////
		$scope.show_vic = function(){
      $("#show_victim").fadeOut(400);

      setTimeout(function(){
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
          $("#fat").fadeOut(400)
          $("#vic").fadeOut(400);
          $("#poisoned").fadeOut(400);
          $("#safe_night").fadeOut(400);
          setTimeout(function(){
              $("#discuss").fadeIn(400);
              setTimeout(function(){
                $("#discuss").fadeOut(400);
                $scope.createVote();
                var confirm_btn = document.createElement("div");
                confirm_btn.setAttribute("class","front_btn");
                confirm_btn.innerHTML = "Confirm";
                confirm_btn.setAttribute("id","vote_sus")
                confirm_btn.setAttribute("ng-click", "vote_suspect()") 
                document.getElementById("vote").appendChild(confirm_btn);
                setTimeout(function(){
                  compile(document.getElementById("vote_sus"));
                }, 500)
                $("#vote").fadeIn(800);
                // change curr_char back to werewolf
                $scope.$apply(function(){
                  $scope.curr_char = 1;
                });
              },2000)
          },4000)
        },5000)
      }, 2000)
			
		}//end of show_vic
		
		$scope.vote_suspect = function(){
			$scope.status[$scope.target] = 0;
      console.log("suspect killed by voting")
      console.log($scope.target)
			setTimeout(function(){
				$("#vote").fadeOut(400)
				setTimeout(function(){
          console.log("finish one iteration")
          $scope.start()
				},600)
			},600)
		}
  
  
  
  
  
  /////////// game logic (start with night) ///////////
  $scope.start = function() {
    console.log("Game start");
//    console.log($("#ann1").show());
//    $("#main_container").fadeOut(400); 

		$scope.check_winning()
		
		setTimeout(function(){
			if($scope.winningCondition == true){
				//show winner
				console.log("Winning condition fit");
				setTimeout(function(){
					$("#winner").fadeIn(400);
//          $("#reveal_identity").fadeIn(1000)
				},1000);
				/* add more details about the game: identities, etc.   Provide options to go back to title page*/
			} 
			else {
					
            //hide welcome page, character page, morning sequence
						$("#game_container").fadeOut(400);
						$("#main_container").fadeOut(400);
						$("#morning_alt").fadeOut(400); 
            //night sequence starts
            $scope.$apply(function(){
              $scope.fat = $scope.fatalities[Math.floor((Math.random() * 4))];
            })
            setTimeout(function(){
              $("#night_alt").fadeIn(700); //start night
            
              setTimeout(function(){
                $("#night_seq").fadeOut(700);
                var player5 = document.getElementById('bg1');
                player5.pause();
                setTimeout(function(){
                  var player6 = document.getElementById('bg2');
                  player6.play();          
                  $("#char_open").fadeIn(400); //start werewolf
                  setTimeout(function(){
                    $("#wolf1").fadeIn(400); //que werewolf dialogue
                    setTimeout(function(){
                      $("#wolf2").fadeIn(400); //que werewolf dialogue
                      setTimeout(function(){
                        $("#char_open").fadeOut(400);
                        $("#wolf1").fadeOut(400); 
                        $("#wolf2").fadeOut(400);
                        player6.pause();
                        setTimeout(function(){
                          $scope.createVote();
                          var confirm_btn = document.createElement("div");
                          confirm_btn.setAttribute("class","front_btn");
                          confirm_btn.innerHTML = "Confirm";
                          confirm_btn.setAttribute("id","kill");
                          confirm_btn.setAttribute("ng-click", "wolf_to_seer()") ;
                          document.getElementById("vote").appendChild(confirm_btn);
                          setTimeout(function(){
                            compile(document.getElementById("kill"));
                          }, 500)
                          $("#vote").fadeIn(400);
                        },1300);
                      },700);
                    },2000);
                  },2400);
                },2000); //night_alt close
              },700); //time after what night_seq disappear
            },500);	
          } //end of else for winning condition not met, game continues
        }, 4000) //end of winning checking
      } //end of start()
    

	
		
});