const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(express.static("assets"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const levels = [
  require("./crossword_data/crossword1.json"),
  require("./crossword_data/crossword2.json"),
  require("./crossword_data/crossword3.json"),
  require("./crossword_data/crossword4.json"),
];
const questions_within_level = [];

let teamCaptainNames = [
  "jyoti.krishna",
  "sreelekshmi.jayasree",
  "vishnu.d.das",
  "roshan.vijayan",
];

const state = {};
for (captain of teamCaptainNames) {
  state[captain] = initState();
}
console.log(state);

const total_questions = initGame();
function copyObj(data) {
  return JSON.parse(JSON.stringify(data));
}

function initState() {
  return {
    level: 0,
    crossword: copyObj(levels[0]),
    score: 0,
  };
}

function updateTeamState(team) {
  let solved = team.crossword.data.filter((d) => d.solved).length;
  if (solved === questions_within_level[team.level]) {
    team.level++;
    if (team.level < levels.length) {
      console.log(team.level)
      team.crossword = copyObj(levels[team.level]);
    }
    solved = 0;
  }
  for (let i = 0; i < team.level; i++) {
    solved += questions_within_level[i];
  }
  team.score = (100 * solved) / total_questions;
  return team;
}

function calcScore(state) {
  return Object.values(state).map((s) => s.score);
}

function initGame() {
  for (level of levels) {
    questions_within_level.push(level.data.length);
  }

  let sum = function (total, num) {
    return total + num;
  };

  return questions_within_level.reduce(sum);
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/getcrossword", (req, res) => {
  const user = req.query.user;
  const index = teamCaptainNames.indexOf(user);
  if (index === -1 || state[user].level >= levels.length) {
    res.send("");
    return;
  }

  const crossword_obj = copyObj(state[user].crossword);
  for (entry of crossword_obj.data) {
    entry.answer = Array(entry.answer.length + 1).join("*");
  }
  res.send(crossword_obj);
});

app.post("/validatecrosswordentry", (req, res) => {
  let user = req.body.user;
  const team = state[user];
  let key = req.body.key;
  let value = req.body.value;
  let match = false;
  for (entry of team.crossword.data) {
    if (
      entry.startx === parseInt(key.startx) &&
      entry.starty === parseInt(key.starty) &&
      entry.orientation === key.orientation
    ) {
      match = entry.answer.toLowerCase() === value;
      entry.solved = match;
    }
  }
  let result = { match: match, levelComplete: false };
  if (result.match) {
    const level = team.level;
    state[user] = updateTeamState(team);
    result.levelComplete = state[user].level > level;
    console.log(state);
  }
  res.send(result);
});

setInterval(() => {
  io.emit("score", calcScore(state));
}, 500);

http.listen(8090, () => {
  console.log("listening on *:8090");
});
