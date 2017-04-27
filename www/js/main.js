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
  $scope.charType = ["Villager","Werewolf","Seer","Witch","Hunter"]
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
  $scope.iteration = 1;
  $scope.day = false;
  $scope.huntNum = 0;
  $scope.huntState = 1;
  $scope.witchNum = 0;
  $scope.witchState = 1;
  $scope.disc = 0;
  
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
    if ($scope.num_villagers>4 && total>6){
      for(var i=0;i<$scope.num_villagers-3;i++){
        $scope.player_selection.push(0);
      }
      $scope.player_selection.push(4);
    }
    else{
      for(var i=0;i<$scope.num_villagers-2;i++){
        $scope.player_selection.push(0);
      }
    }

    for(var i=0;i<$scope.num_werewolf;i++){
      $scope.player_selection.push(1);
    }

    $scope.player_selection.push(2);
    $scope.player_selection.push(3);
    $scope.shuffle();
	console.log($scope.player_selection);	
    //find the players who are wolves, initiate player status
    console.log("wolves")
    
    for (var i = 0; i<total; i++){
      if ($scope.player_selection[i] == 1){
        $scope.wolf.push(i+1) //index starts with 0, but players start with player 1
        console.log(i+1)
      }
      $scope.status[i] = 1;
    }
      
    //find the players who is hunter, initiate player status
    console.log("Hunter")
    for (var i = 0; i<total; i++){
      if ($scope.player_selection[i] == 4){
        $scope.huntNum = i+1;
        console.log(i+1)
      }
      else if ($scope.player_selection[i] == 3){
        $scope.witchNum = i+1;
      }
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
    } else if($scope.player_selection[$scope.player_num-1]==3){
      $("#witch_img").fadeIn(500);
    } else{
      $("#hunter_img").fadeIn(500);
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
      $("#hunter_img").hide();
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

  
  //Hunter action
  $scope.hunterAction = function(){
    setTimeout(function(){
      $("#hunter_actions").fadeOut(400);
      $scope.createVote();		
      var confirm_btn = document.createElement("div");
      confirm_btn.setAttribute("class","front_btn");
      confirm_btn.innerHTML = "Confirm";
      confirm_btn.setAttribute("id","hunter_act")
      confirm_btn.setAttribute("ng-click", "hunter_kill()") 
      confirm_btn.setAttribute("style","text-align:center")
      document.getElementById("vote").appendChild(confirm_btn);
      setTimeout(function(){
        compile(document.getElementById("hunter_act"));
      }, 500)
      $("#vote").fadeIn(800);
    },2000)
  }
  
  $scope.hunterNoAction = function(){
    $("#hunter_actions").fadeOut('fast');
    if ($scope.disc == 0){
      $scope.discuss();
    }
    else{
      setTimeout(function(){
        console.log("finish one iteration")
        $scope.start()
      },600)
    }
  }

  
  //////// voting box initialization /////////
  $scope.createVote = function(){
    // $scope.status[4] = 0;
    var name = "vote";
    
    while(document.getElementById(name).hasChildNodes()) {
      document.getElementById(name).removeChild(document.getElementById(name).lastChild);
    }
     
    var total_players = $scope.num_werewolf + $scope.num_villagers;
    var num_added = 0;

    // evenly distrubute the voting box accordingly to the number of player left
    for(var i=0;i<total_players/3;i++){
      var votebox = document.createElement("center");
      votebox.setAttribute("class","box_row2");
      for(var j=0;j<3;j++){
        if(num_added<total_players){
          var vote = document.createElement("div");
          var vote_txt = document.createElement("center");
          var x_img = document.createElement("img");
          
          var playerNumber = i*3+j+1;
          vote_txt.innerHTML = "Player " + playerNumber; 
          vote.setAttribute("id","player" + playerNumber); 
          vote.setAttribute("class","votechar");
          vote_txt.setAttribute("class","votechar_txt");
          vote.setAttribute("ng-click","vote_pend("+playerNumber+")"); 

          x_img.setAttribute("class","x");
          x_img.setAttribute("width","90px");
          x_img.setAttribute("src","img/x.png");
          x_img.setAttribute("id","x"+playerNumber);
          x_img.setAttribute("style", "");

          vote.appendChild(vote_txt);
          vote.appendChild(x_img);
          
          //need iteration >1 to make sure other gods don't know who died during the night
          var skull_img = document.createElement("img");
          skull_img.setAttribute("class","skull");
          skull_img.setAttribute("width","80px");
          skull_img.setAttribute("src","img/skull.png");
          skull_img.setAttribute("id","skull"+playerNumber);
          skull_img.setAttribute("style", "");
          vote.appendChild(skull_img);  
          
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
      setTimeout(function(){
        //new_add
        for (var playerNumber=1; playerNumber<total_players+1; playerNumber++){
          if ($scope.iteration > 1 || $scope.day == true){
            if($scope.status[playerNumber-1] == 0){
              // console.log("detected player "+playerNumber+" dead")
              $("#skull"+playerNumber).css("z-index",3);
            }
          } 
        }
      }, 200)
    },400);
  }

  
  // display an "x" on the voting box to indicate selection
  function showVote(playerNumber){
    $("#x"+playerNumber).css("z-index",3);
  }
    
  function hideVote(playerNumber){
    $("#x"+playerNumber).css("z-index",-1);
  }

    
  // allow players to switch between voting selections 
  // (ensures only one target is selected)
  $scope.vote_pend = function(playerNumber){
    // console.log("target")
    // console.log(playerNumber);
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
    console.log($scope.status)
    for (var i=0; i<$scope.num_werewolf; i++){
      if ($scope.status[$scope.wolf[i]-1] == 1){
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
    if (vil_alive <= wol_alive){
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
  }
	

  /*  werwolf to seer transition  */ /* need timer for when seer is dead */
  $scope.wolf_to_seer = function(){
    // update victim
    if($scope.target != 0){
      setTimeout(function(){
        $scope.target = 0;
      }, 2000)
      
      $scope.victim = $scope.target;
      console.log("victim")
      console.log($scope.victim)
      
      // fade out all wolf actions and transit to seer action
      $("#vote").fadeOut(600);
      setTimeout(function(){
        $("#char_close").fadeIn(400);
        setTimeout(function(){
          var wolf_close = document.getElementById('bg3');
          wolf_close.play();    
          setTimeout(function(){
            $("#char_close").fadeOut(400);
            wolf_close.pause();
            setTimeout(function(){
              // update next character up
              $scope.$apply(function(){
                $scope.curr_char = 2;
              });
              setTimeout(function(){
                var seer_open = document.getElementById('bg6');
                seer_open.play();
                $("#char_open").fadeIn(400);
                setTimeout(function(){
                  $("#seer1").fadeIn(400);
                  setTimeout(function(){
                    $("#seer2").fadeIn(400);
                    setTimeout(function(){
                      $("#char_open").fadeOut(400);
                      $("#seer1").fadeOut(400); 
                      $("#seer2").fadeOut(400);
                      seer_open.pause();
                      setTimeout(function(){
                        $scope.createVote();		
                        var confirm_btn = document.createElement("div");
                        confirm_btn.setAttribute("class","front_btn");
                        confirm_btn.innerHTML = "Confirm";
                        confirm_btn.setAttribute("id","check")
                        confirm_btn.setAttribute("ng-click", "seer_to_witch()") 
                        confirm_btn.setAttribute("style","text-align:center")
                        //end
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
        }, 800);
      },1000);
    }
  }

  
  /*  seer to witch transition  */
  $scope.seer_to_witch = function(){
    // flag for correct guess on the suspect 
    var test = 0;
    // update suspect 
    if($scope.target != 0){
      setTimeout(function(){
        $scope.target = 0;
      }, 2000)
      $scope.seer_check = $scope.target;

      console.log("seer guess")
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
            var seer_close = document.getElementById('bg7');
            seer_close.play();
            $("#char_close").fadeIn(400);
            setTimeout(function(){
              $("#char_close").fadeOut(400);
              seer_close.pause();
              setTimeout(function(){
                // update next-up charater
                $scope.$apply(function(){
                  $scope.curr_char = 3;
                });    
                // witch actions
                setTimeout(function(){
                  var witch_open = document.getElementById('bg4');
                  witch_open.play();
                  $("#char_open").fadeIn(400);
                  setTimeout(function(){
                    $("#witch1").fadeIn(400);
                    setTimeout(function(){
                      $("#witch2").fadeIn(400);
                      setTimeout(function(){
                        $("#char_open").fadeOut(400);
                        $("#witch1").fadeOut(400); 
                        $("#witch2").fadeOut(400);
                        $scope.status[$scope.victim-1] = 0;
                        witch_open.pause();
                        setTimeout(function(){
                          $("#CharOpen").fadeOut('fast');
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
  }
 
  
  ///////   witch actions -- save   ///////// 
  $scope.save = function() {
    $("#witch_actions").fadeOut(400);
    // check if there is any med left to use
    if ($scope.witchState == 1){    
      if ($scope.med == 1){
        if ($scope.victim != 0){
          $scope.status[$scope.victim-1] = 1;
          $scope.victim = 0;
          $scope.med = 0;
          console.log("victim is saved by witch")
          $scope.nothing();
        }
        else{
          $("#CharOpen").fadeOut('fast');
          $("#warn3").fadeIn(400)
          setTimeout(function(){
            $("#warn3").fadeOut(400)
            $("#CharOpen").fadeOut('fast');
            setTimeout(function(){
              $("#witch_actions").fadeIn(600)
            }, 500)
          }, 2000)
        }
      }
      else{
        $("#CharOpen").fadeIn('fast');
        $("#warn").fadeIn(400)
        setTimeout(function(){
          $("#warn").fadeOut(400)
          $("#CharOpen").fadeOut('fast');
          setTimeout(function(){
            $("#witch_actions").fadeIn(600)
          }, 500)
        }, 2000)
      }
    }
    else{
        $("#CharOpen").fadeIn('fast');
        $("#warn2").fadeIn(400)
        setTimeout(function(){
          $("#warn2").fadeOut(400)
          $("#CharOpen").fadeOut('fast');
          setTimeout(function(){
            $("#witch_actions").fadeIn(600)
          }, 500)
        }, 2000)
    }
  }

  
  ///////   witch actions -- poison   ///////// 
  $scope.poison_someone = function() {
    setTimeout(function(){
      $("#witch_actions").fadeOut(400);
      if ($scope.witchState == 1){    
        if ($scope.poison == 1){
          $scope.createVote();		
          var confirm_btn = document.createElement("div");
          confirm_btn.setAttribute("class","front_btn");
          confirm_btn.innerHTML = "Confirm";
          confirm_btn.setAttribute("id","poison")
          confirm_btn.setAttribute("ng-click", "vote_poison()") 
          confirm_btn.setAttribute("style","text-align:center")
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
      }
      else{
        $("#CharOpen").fadeIn('fast');
        $("#warn2").fadeIn(400)
        setTimeout(function(){
          $("#warn2").fadeOut(400)
          $("#CharOpen").fadeOut('fast');
          setTimeout(function(){
            $("#witch_actions").fadeIn(600)
          }, 500)
        }, 2000)
      }
    }, 700)
  }
	
  $scope.vote_poison = function(){
    if($scope.target != 0){
      $scope.po_victim = $scope.target;
      $scope.target = 0;
      console.log("poisoned")
      console.log($scope.po_victim)
			
      $scope.nothing();
    }
  }
    

  ///////   witch actions -- do nothing   ///////// 
  $scope.nothing = function(){
    $("#vote").fadeOut(400);
    $("#witch_actions").fadeOut(400);	
    $("#CharOpen").fadeIn('fast');
    setTimeout(function(){
      var witch_close = document.getElementById('bg5');
      witch_close.play();
      $("#char_close").fadeIn(400);
      console.log("witch close eyes")
      setTimeout(function(){
        $("#char_close").fadeOut(400);
        witch_close.pause();
        //day sequence
        var all_open = document.getElementById('bg8');
        all_open.play();
        $("#CharOpen").fadeOut('fast');
        $("#night_alt").fadeOut(400);
        setTimeout(function(){
          $("#morning_alt").fadeIn('fast');
          $("#morning_seq").fadeIn('slow');
          console.log("morning coming")
          setTimeout(function(){
            $("#morning_seq").fadeOut(400);
            setTimeout(function(){
              all_open.pause();
              $("#announce_victim").fadeIn(400);
              console.log("announce victim come")
              $("#fat").fadeIn('slow');
              $("#show_victim").fadeIn('fast');
            }, 600)
          }, 4000)
        }, 3000)
      }, 6000)
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

  
  ///////////  Day Sequence -- show victim(s) //////////////
  $scope.show_vic = function(){
    //new_add
    $scope.iteration++;
    $scope.day = true;
    $("#show_victim").fadeOut(400);

    setTimeout(function(){
      if($scope.victim != 0){
        $("#vic").fadeIn(400);
        if ($scope.witchNum == $scope.victim){
          $scope.witchState = 0;
        }
      }
      if($scope.po_victim != 0){
        $("#poisoned").fadeIn(400);
        $scope.status[$scope.po_victim-1] = 0;
        if ($scope.witchNum == $scope.po_victim){
          $scope.witchState = 0;
        }
      }
      else if($scope.victim == 0 && $scope.po_victim == 0){
        $("#safe_night").fadeIn(400);
      }
      $scope.victim = 0;
      $scope.po_victim = 0;
      setTimeout(function(){
        $("#fat").fadeOut(400)
        $("#vic").fadeOut(400);
        $("#poisoned").fadeOut(400);
        $("#safe_night").fadeOut(400);
        if ($scope.huntNum != 0 && $scope.status[$scope.huntNum-1] == 0 && $scope.huntState == 1){
          setTimeout(function(){
            $("#hunter_actions").fadeIn(400);
            $scope.huntState = 0;
          }, 600);
        }
        else{
          $scope.discuss();
        }
      },5000)
    }, 2000)
  }//end of show_vic
		
  
  //Vote suspect function, related to discuss function
  $scope.vote_suspect = function(){
    $scope.disc = 1;
    $scope.status[$scope.target-1] = 0;
    console.log("suspect killed by voting")
    console.log($scope.target)
    setTimeout(function(){
      $("#vote").fadeOut(400)
      if ($scope.target == $scope.huntNum && $scope.huntNum != 0){
        $scope.target = 0;
        setTimeout(function(){
          $("#hunter_actions").fadeIn(400);
          $scope.huntState = 0;
        }, 600);
      }
      else{
        if ($scope.witchNum == $scope.target){
          $scope.witchState = 0;
        }
        setTimeout(function(){
          console.log("finish one iteration")
          $scope.start()
        },600)
      }
    },600)
  }
  
  
  //Hunter kill function, related to hunterAction function
  $scope.hunter_kill = function(){
    $scope.status[$scope.target-1] = 0;
    if ($scope.witchNum == $scope.target){
      $scope.witchState = 0;
    }
    console.log("suspect killed by hunter")
    console.log($scope.target)
    $scope.target = 0;
    setTimeout(function(){
      $("#vote").fadeOut(400)
      $scope.hunterNoAction();
    },600);
  }
 
  
  ///////////  Day Sequence -- discussion //////////////
  $scope.discuss = function(){
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
        confirm_btn.setAttribute("style","text-align:center")
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
  }
  
  
  /////////// game logic (start with night) ///////////
  $scope.start = function() {
    if ($scope.iteration == 1){
      console.log("Game start");
    }
    // console.log($("#ann1").show());
    // $("#main_container").fadeOut(400); 

    $scope.check_winning()
		
    setTimeout(function(){
      if($scope.winningCondition == true){
        //show winner
        console.log("Winning condition fit");
        console.log($scope.winner);
        //end
        setTimeout(function(){
          $("#winner").fadeIn(400);
          // $("#reveal_identity").fadeIn(1000)
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
        //new_add
        $scope.day = false;
        $scope.victim = 0;
        $scope.target = 0;
        setTimeout(function(){
          $("#night_alt").fadeIn('fast'); //start night
          $("#night_seq").fadeIn('fast');
          console.log("night_alt fade");
          setTimeout(function(){
            var all_close = document.getElementById('bg1');
            all_close.play();
            setTimeout(function(){
              $("#night_seq").fadeOut(700);
              all_close.pause();
              $("#CharOpen").fadeIn('fast');
              setTimeout(function(){
                  $("#char_open").fadeIn(400); //start werewolf
                  setTimeout(function(){
                    var wolf_open = document.getElementById('bg2');
                    wolf_open.play();
                    setTimeout(function(){
                      $("#wolf1").fadeIn(400); //que werewolf dialogue
                      setTimeout(function(){
                        $("#wolf2").fadeIn(400); //que werewolf dialogue
                        setTimeout(function(){
                          $("#char_open").fadeOut(400);
                          $("#wolf1").fadeOut(400); 
                          $("#wolf2").fadeOut(400);
                          wolf_open.pause();
                          setTimeout(function(){
                            $scope.createVote();
                            var confirm_btn = document.createElement("div");
                            confirm_btn.setAttribute("class","front_btn");
                            confirm_btn.innerHTML = "Confirm";
                            confirm_btn.setAttribute("id","kill");
                            confirm_btn.setAttribute("ng-click", "wolf_to_seer()") ;
                            confirm_btn.setAttribute("style","text-align:center")
                            document.getElementById("vote").appendChild(confirm_btn);
                            setTimeout(function(){
                              compile(document.getElementById("kill"));
                            }, 500)
                            $("#vote").fadeIn(400);
                          },1300);
                        },700);
                      },2000);
                    },2800);
                  }, 800);
              },2000); //night_alt close
            },4000); //time after what night_seq disappear
          }, 800);
        },500);	
      } //end of else for winning condition not met, game continues
    }, 4000) //end of winning checking
  } //end of start()

});