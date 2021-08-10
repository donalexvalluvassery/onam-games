$( document ).ready(function() {
    // do nothing...
    updateBoatPositions();
});

var siteDomain = "https://" + document.domain;

// for local functions debugging
if(siteDomain.includes("localhost")) {
    siteDomain = "http://localhost:5000"
}
console.log("siteDomain: " + siteDomain);


var updateBoatPositions = function() {
    getBoatPositions()
    
    if (!gameComplete()){
        rinseRepeat();
    }
}

var players_game_completion_status = [0, 0, 0, 0];
var player_completed = 0;
var players_progress_status = [0, 0, 0, 0];

var getBoatPositions = function() {
    $.ajax({
        url : siteDomain + "/getboatpositions",
        type: "GET",
        contentType: "application/json",
        dataType   : "json",
        success    : function(data){
            let Result = data.positions;
            for (let i=0; i<Result.length; i++){
                if (Result[i] >= 100 && players_game_completion_status[i] === 0){
                    player_completed = player_completed + 1;
                    console.log(player_completed);
                    players_game_completion_status[i] = player_completed;
                    $(".banner" + (i+1)).css("display", "table"); 
                    $(".bannerHeading" + (i+1)).text(players_game_completion_status[i]);
                }

                // let newPos = parseFloat(Result[i])*85/100;
                // $(".boat" + (i+1)).css("opacity", newPos);
                serveSadhya(Result,i);
            }
        }
    });
}

var serveSadhya = function (Result, i) {
    console.log(Result);
    // switch or if for reaching thresholds, each threshold serves one item
    switch (true) {
        case Result[i] >= 10 && Result[i] <20:
    //        css show rice for team i
            break;
        case Result[i] >= 20 && Result[i] <30:
    //        css show curry1 for team i
            break;
        case Result[i] >= 30 && Result[i] <40:
    //        css show curry2 for team i
            break;
    }
}

var gameComplete = function() {
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    return players_game_completion_status.reduce(reducer) === 10
}

var rinseRepeat = function() {
    setTimeout(updateBoatPositions, 1000);
};
