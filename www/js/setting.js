$(document).ready(function(){
  $("#main_container").fadeIn(500);
  $("#second_container").fadeIn(1000);
  $("#character_container").fadeIn(1000);
//  load_werewolf();
  
});
//
//
//function waitIn(el,num){
//  setTimeout(function(){
//    $(el).fadeIn(500);
//  },num)
//}
//
//function waitOut(el,num){
//  setTimeout(function(){
//    $(el).fadeOut(500);
//  },num)
//}
//
//function load_werewolf(){
//  $("#ann1").fadeIn(1000);
//  waitOut("#ann1",3000); 
//  
//  waitIn("#wolf1",4000);
//  waitIn("#wolf2",5000);
//  waitIn("#wolf3",6000);
//  waitIn("#cont1",7500);
//}
//
//function load_seer(){
//  $("#wolf_close").fadeIn(1000);
//  waitOut("#wolf_close",3000); 
//  
//  waitIn("#seer1",4000);
//  waitIn("#seer2",5000);
//  waitIn("#seer3",6000);
//  waitIn("#cont3",7500);
//}
//
//function load_witch(){
//  $("#seer_close").fadeIn(1000);
//  waitOut("#seer_close",3000); 
//  
//  waitIn("#witch1",4000);
//  waitIn("#witch2",5000);
//  waitIn("#witch3",6000);
////  waitIn("#cont3",7500);
//}
//
//function hide_werewolf(){
//  $("#wolf1").hide();
//  $("#wolf2").hide();
//  $("#wolf3").hide();
//  $("#cont1").hide();
//  waitIn("#task1",100);
//  waitIn("#cont2",100);
//}
//
//function hide_seer(){
//  $("#seer1").hide();
//  $("#seer2").hide();
//  $("#seer3").hide();
//  $("#cont3").hide();
//  waitIn("#task2",100);
//  waitIn("#cont4",100);
//}
//
//
//function moveto_seer() {
//  $("#vote1").fadeOut(500);
//  $("#task1").fadeOut(500);
//  $("#cont2").fadeOut(500);
////  $("#cont1").fadeOut(500);
//  
//  setTimeout(function(){
//    var name = "vote1";
//    while(document.getElementById(name).hasChildNodes()) {  document.getElementById(name).removeChild(document.getElementById(name).lastChild);
//    }
//    
//    load_seer();
//  },600);
//}
//
//function moveto_witch() {
//  $("#vote2").fadeOut(500);
//  $("#task2").fadeOut(500);
//  $("#cont4").fadeOut(500);
////  $("#cont1").fadeOut(500);
//  
//  setTimeout(function(){
//    var name = "vote2";
//    while(document.getElementById(name).hasChildNodes()) {  document.getElementById(name).removeChild(document.getElementById(name).lastChild);
//    }
//    
//    load_witch();
//  },600);
//}
//
