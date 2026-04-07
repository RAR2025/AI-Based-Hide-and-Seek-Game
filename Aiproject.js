const size = 8;
const wallProbability = 0.15;

let grid;
let player;
let ai;
let gameRunning;
let gameEnded;
let lastSeen = null;
let intervalId = null;
let timerId = null;
let remainingTime = 60;
let currentMoveDelay = 400;

const gridDiv = document.getElementById("grid");
const gameOverDiv = document.getElementById("gameOver");
const startButton = document.getElementById("startButton");
const timerDiv = document.getElementById("timer");
const gameOverMessage = document.getElementById("gameOverMessage");

// ---------- GRID GENERATION ----------
function generateGrid() {
  let g = [];

  for (let i = 0; i < size; i++) {
    let row = [];
    for (let j = 0; j < size; j++) {
      row.push(Math.random() < wallProbability ? 1 : 0);
    }
    g.push(row);
  }

  g[0][0] = 0;
  g[size - 1][size - 1] = 0;

  return g;
}

function generateValidGrid() {
  let newGrid;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    newGrid = generateGrid();
    grid = newGrid;
    attempts++;
  } while (!aStar({x:0,y:0}, {x:size-1,y:size-1}) && attempts < maxAttempts);

  return newGrid;
}

// ---------- DRAW ----------
function drawGrid() {
  gridDiv.innerHTML = "";

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");

      if (grid[i][j] === 1) cell.classList.add("wall");
      if (i === player.x && j === player.y) cell.classList.add("player");
      if (i === ai.x && j === ai.y) cell.classList.add("ai");

      gridDiv.appendChild(cell);
    }
  }
}

// ---------- PLAYER ----------
function movePlayer(dx, dy) {
  if (!gameRunning) return;

  let nx = player.x + dx;
  let ny = player.y + dy;

  if (nx>=0 && ny>=0 && nx<size && ny<size && grid[nx][ny] !== 1) {
    player.x = nx;
    player.y = ny;
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") movePlayer(-1,0);
  if (e.key === "ArrowDown") movePlayer(1,0);
  if (e.key === "ArrowLeft") movePlayer(0,-1);
  if (e.key === "ArrowRight") movePlayer(0,1);
});

// ---------- VISION ----------
function canSeePlayer() {
  if (ai.x === player.x) {
    let [start, end] = [ai.y, player.y].sort((a,b)=>a-b);
    for (let i = start+1; i < end; i++) {
      if (grid[ai.x][i] === 1) return false;
    }
    return true;
  }

  if (ai.y === player.y) {
    let [start, end] = [ai.x, player.x].sort((a,b)=>a-b);
    for (let i = start+1; i < end; i++) {
      if (grid[i][ai.y] === 1) return false;
    }
    return true;
  }

  return false;
}

// ---------- A* ----------
function heuristic(a,b){
  return Math.abs(a.x-b.x) + Math.abs(a.y-b.y);
}

function aStar(start, goal){
  let open = [start];
  let cameFrom = {};
  let gScore = {};
  let fScore = {};

  let key = (n) => n.x + "," + n.y;

  gScore[key(start)] = 0;
  fScore[key(start)] = heuristic(start, goal);

  while(open.length){
    open.sort((a,b)=>fScore[key(a)] - fScore[key(b)]);
    let current = open.shift();

    if(current.x===goal.x && current.y===goal.y){
      let path = [];
      let temp = key(current);

      while(temp){
        let [x,y] = temp.split(",").map(Number);
        path.unshift({x,y});
        temp = cameFrom[temp];
      }
      return path;
    }

    let moves = [
      {x:current.x+1,y:current.y},
      {x:current.x-1,y:current.y},
      {x:current.x,y:current.y+1},
      {x:current.x,y:current.y-1}
    ];

    for(let n of moves){
      if(n.x<0||n.y<0||n.x>=size||n.y>=size) continue;
      if(grid[n.x][n.y]===1) continue;

      let tentative = gScore[key(current)] + 1;

      if(gScore[key(n)]===undefined || tentative<gScore[key(n)]){
        cameFrom[key(n)] = key(current);
        gScore[key(n)] = tentative;
        fScore[key(n)] = tentative + heuristic(n,goal);

        if(!open.find(x=>x.x===n.x && x.y===n.y)){
          open.push(n);
        }
      }
    }
  }
  return null;
}

// ---------- AI ----------
function moveAI(){
  if(!gameRunning) return;

  let target = null;

  if(canSeePlayer()){
    lastSeen = {x:player.x,y:player.y};
    target = player;
  } 
  else if(lastSeen){
    target = lastSeen;
  }

  if(target){
    let path = aStar(ai,target);
    if(path && path.length>1){
      ai = path[1];
    }

    if(ai.x===lastSeen?.x && ai.y===lastSeen?.y){
      lastSeen = null;
    }
  } 
  else {
    let moves = [
      {x:ai.x+1,y:ai.y},
      {x:ai.x-1,y:ai.y},
      {x:ai.x,y:ai.y+1},
      {x:ai.x,y:ai.y-1}
    ];

    let valid = moves.filter(m =>
      m.x>=0 && m.y>=0 &&
      m.x<size && m.y<size &&
      grid[m.x][m.y]!==1
    );

    if(valid.length){
      ai = valid[Math.floor(Math.random()*valid.length)];
    }
  }

  if(ai.x===player.x && ai.y===player.y){
    endGame("Game Over - AI Caught You");
  }
}

// ---------- LOOP ----------
function gameLoop(){
  moveAI();
  drawGrid();
}

function updateTimerDisplay() {
  timerDiv.textContent = `Time Left: ${remainingTime}s`;
}

function startGameLoop(delay) {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }

  currentMoveDelay = delay;
  intervalId = setInterval(gameLoop, currentMoveDelay);
}

function endGame(message) {
  if (gameEnded) return;

  gameEnded = true;
  gameRunning = false;

  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }

  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }

  gameOverMessage.textContent = message;
  gameOverDiv.style.display = "flex";
}

function startTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
  }

  timerId = setInterval(() => {
    if (!gameRunning) return;

    remainingTime--;
    updateTimerDisplay();

    if (remainingTime <= 25 && currentMoveDelay !== 200) {
      startGameLoop(200);
    }

    if (remainingTime <= 0) {
      remainingTime = 0;
      updateTimerDisplay();
      endGame("Success - You survived 1 minute!");
    }
  }, 1000);
}

// ---------- RESTART ----------
function restartGame(){
  gameEnded = false;
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }

  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }

  grid = generateValidGrid();
  player = {x:0,y:0};
  ai = {x:size-1,y:size-1};
  lastSeen = null;
  gameRunning = true;
  remainingTime = 60;
  gameOverDiv.style.display = "none";
  updateTimerDisplay();
  drawGrid();
  startGameLoop(400);
  startTimer();
}

// ---------- INIT ----------
startButton.addEventListener("click", () => {
  startButton.style.display = "none";
  restartGame();
});