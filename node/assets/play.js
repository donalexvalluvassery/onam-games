let socket;
let user;
const urlParams = new URLSearchParams(location.search);
const quser = urlParams.get("user");

if (quser) {
  receive({ data: `${quser}@a` });
}

let player_completed = 0;
const players_game_completion_status = [0, 0, 0, 0];

function initSocket(user) {
  socket = io({
    query: {
      token: user,
    },
  });

  socket.on("score", (score_data) => {
    console.log(score_data);
    for (let i = 0; i < score_data.length; i++) {
      if (score_data[i] >= 100 && players_game_completion_status[i] === 0) {
        player_completed = player_completed + 1;
        players_game_completion_status[i] = player_completed;
        $(".banner" + (i + 1)).css("display", "table");
        $(".bannerHeading" + (i + 1)).text(player_completed);
      }

      let newPos = (parseFloat(score_data[i]) * 85) / 100;
      $(".boat" + (i + 1)).css("left", newPos + "vw");
    }
  });
}

function receive(event) {
  if (!user){
    user = event.data.split("@")[0].toLowerCase();
    initSocket(user);
    if (user) {
      initPuzzle();
    }
  }
}

function initPuzzle() {
  let puzzleData;

  $.ajax({
    url: siteDomain + "/getcrossword",
    type: "GET",
    data: { user: user },
    contentType: "application/json",
    dataType: "json",
    success: function (data) {
      if (data) {
        $("#crosswordSection").css("display", "block");
        puzzleData = data.data;
        $("#puzzle-wrapper").crossword(puzzleData);
      } else {
        $("#crosswordSection").css("display", "none");
      }
    },
  });
}

window.addEventListener("message", receive);
