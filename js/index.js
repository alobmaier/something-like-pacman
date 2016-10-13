/**
 * Created by Andreas on 24.02.2016.
 */
var maincontainer = document.querySelector('#main_container');
var gamecontainer = document.querySelector('#game_container');

var controlcontainer = document.querySelector('#control_container');
var instructioncontainer = document.querySelector('#instructions_container');
var infocontainer = document.querySelector('#info_container');
var highscorecontainer = document.querySelector('#highscore_container');
//buttons
var instructions = document.querySelector('#instructions');
var info = document.querySelector('#info');
var highscore = document.querySelector('#highscore');


$(instructions).click(function() {

    $(maincontainer).hide();
    $(instructioncontainer).addClass("show");


});
$(info).click(function() {

    $(maincontainer).hide();
    $(infocontainer).addClass("show");


});
$(highscore).click(function() {

    pause = true;
    $(maincontainer).hide();
    $(highscorecontainer).addClass("show");

    var tableBody = document.querySelector('#highscore_table tbody');
    tableBody.innerHTML = ""; //clear

    //TODO implement loading highscores from localStorage !!
    for(var i = 0; i < highscore_arr.length; i++)
    {

        var entry = document.createElement('tr');
        var player = document.createElement('td');
        player.setAttribute('data-th', 'Name');
        player.innerHTML = highscore_arr[i].player;
        var rank = document.createElement('td');
        rank.setAttribute('data-th', 'Rank');
        rank.innerHTML = (i+1).toString();
        var score = document.createElement('td');
        score.setAttribute('data-th', 'Score');
        score.innerHTML = highscore_arr[i].score;

        entry.appendChild(rank);
        entry.appendChild(player);
        entry.appendChild(score);

        tableBody.appendChild(entry);

    }



});

//hide content container and show main-container
$('.back-button').click(function(){
    pause = false;
    $(maincontainer).show();
    $(instructioncontainer).removeClass("show");
    $(infocontainer).removeClass("show");
    $(highscorecontainer).removeClass("show");

});