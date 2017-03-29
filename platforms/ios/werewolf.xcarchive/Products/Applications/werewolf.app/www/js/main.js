var second = false;
var third = false;

function tutorial() {
  $("#main_container").fadeOut(500);
  
  second = true;
  third = false;
  setTimeout(function(){
    $("#third_container").fadeIn(500);
  },500);
} 

function newgame() {
  $("#main_container").fadeOut(500);
  
  second = true;
  third = false;
  setTimeout(function(){
    $("#second_container").fadeIn(500);
  },500);
} 

function back() {
  $("#third_container").fadeOut(500);
  $("#second_container").fadeOut(500);

  setTimeout(function(){
    $("#main_container").fadeIn(500);
  },500);
}

function startgame() {
  if(third)
    $("#third_container").animate({width: 'toggle'},'fast');
  if(second)
    $("#second_container").animate({width: 'toggle'},'fast');
  
  setTimeout(function(){
    $("#main_container").animate({width: 'toggle'},'fast');
  },800); 
}