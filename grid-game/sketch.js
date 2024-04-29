// Impossible Mission 1984

let grid;
let cellSize;
let GRID_SIZE = 20;
const PLAYER = 9;
const OPEN_TILE = 0;
const IMPASSIBLE = 1;
const GOAL = 2;
let player = {
  x: 0,
  y: 0,
};
let goal = {
  x: 1,
  y: 1,
}
let grassImg;
let pavingImg;
let bgMusic;
let cantWalk;
let heroSprite; 
let blockToMove;
let state = "start screen";
let level1;


function preload() {
  grassImg = loadImage("clover 1.png");
  pavingImg = loadImage("paving 3.png");
  blockToMove = loadImage("block.png");
  bgMusic = loadSound("TownTheme.mp3");
  cantWalk = loadSound("lose music 3 - 1_0.wav");
  heroSprite = loadImage("hero.png");
  level1 = loadJSON("1stLevel.JSON.json");

}


function setup() {
  //make the canvas the largest square that you can...
  if (windowWidth < windowHeight) {
    createCanvas(windowWidth, windowWidth);
  }
  else {
    createCanvas(windowHeight, windowHeight);
  }

  //if randomizing the grid, do this:
  grid = generateRandomGrid(GRID_SIZE, GRID_SIZE );
  
  //this is dumb -- should check if this is the right size!
  cellSize = height/grid.length;

  //add player to the grid
  grid[player.y][player.x] = PLAYER;

  grid[goal.y][goal.x] = GOAL;
}

function windowResized() {
  //make the canvas the largest square that you can...
  if (windowWidth < windowHeight) {
    resizeCanvas(windowWidth, windowWidth);
  }
  else {
    resizeCanvas(windowHeight, windowHeight);
  }

  cellSize = height/grid.length;
}

function draw() {
  if(state === "start screen"){
    background("black");
  }
  else if (state === "game"){
    background(220);
    displayGrid();
  }
}

function keyPressed() {
  if (key === "r") {
    grid = generateRandomGrid(GRID_SIZE, GRID_SIZE);
  }

  if (key === "e") {
    grid = generateEmptyGrid(GRID_SIZE, GRID_SIZE);
  }

  if (key === "w") {   //up
    movePlayer(player.x + 0, player.y - 1); //0 on x axis, -1 on y axis
  }

  if (key === "s") {   //down
    movePlayer(player.x + 0, player.y + 1); //0 on x axis, 1 on y axis
  }

  if (key === "d") {   //right
    movePlayer(player.x + 1, player.y + 0); //1 on x axis, 0 on y axis
  }

  if (key === "a") {   //left
    movePlayer(player.x - 1, player.y + 0); //-1 on x axis, 0 on y axis
  }
  if (key === " " && state === "start screen"){
    state = "game";
    bgMusic.loop();
  }
  if (key === "1"){
    grid = level1;
  }
}

function movePlayer(x, y) {
  // Don't move off the grid
  if (x < GRID_SIZE && y < GRID_SIZE && x >= 0 && y >= 0) {
    // If the target cell is an open tile or contains the block to move
    if (grid[y][x] === OPEN_TILE || grid[y][x] === GOAL) {
      // If the target cell contains the block to move
      if (grid[y][x] === GOAL) {
        // Calculate the next position of the block
        let nextBlockX = x + (x - player.x);
        let nextBlockY = y + (y - player.y);

        // Ensure the next position of the block is within the grid and is an open tile
        if (nextBlockX >= 0 && nextBlockX < GRID_SIZE && nextBlockY >= 0 && nextBlockY < GRID_SIZE && grid[nextBlockY][nextBlockX] === OPEN_TILE) {
          // Move the block
          grid[nextBlockY][nextBlockX] = GOAL;
          grid[y][x] = OPEN_TILE;
        } else {
          // If the block can't be moved, play sound or handle accordingly
          cantWalk.loop(); 
          return;
        }
      }
      

      // Move the player
      let oldX = player.x;
      let oldY = player.y;
      player.x = x;
      player.y = y;
      grid[oldY][oldX] = OPEN_TILE;
      grid[player.y][player.x] = PLAYER;
    } else {
      // If the target cell is impassible, play sound or handle accordingly
      cantWalk.loop(); 
    }
  }
}



function mousePressed() {
  let x = Math.floor(mouseX/cellSize);
  let y = Math.floor(mouseY/cellSize);

  //toggle self
  toggleCell(x, y);
}

function toggleCell(x, y) {
  // make sure the cell you're toggling is in the grid...
  if (x < GRID_SIZE && y < GRID_SIZE &&
      x >= 0 && y >= 0) {
    //toggle the color of the cell
    if (grid[y][x] === OPEN_TILE) {
      grid[y][x] = IMPASSIBLE;
    }
    else if (grid[y][x] === IMPASSIBLE) {
      grid[y][x] = OPEN_TILE;
    }
  }
}

function displayGrid() {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === IMPASSIBLE) {
        // fill("black");
        image(grassImg, x * cellSize, y * cellSize, cellSize);
      }
      else if (grid[y][x] === OPEN_TILE) {
        // fill("white");
        image(pavingImg, x * cellSize, y * cellSize, cellSize);
      }
      if (grid[y][x] === PLAYER) {
        image(pavingImg, x * cellSize, y * cellSize, cellSize);
        image(heroSprite,x* cellSize, y*cellSize,cellSize);
      }
      if (grid[y][x] === GOAL){
        image(pavingImg, x * cellSize, y * cellSize, cellSize);
        image(blockToMove, x* cellSize,y*cellSize,cellSize);
      }
    }
  }
}


function generateRandomGrid(cols, rows) {
  let emptyArray = [];
  for (let y = 0; y < rows; y++) {
    emptyArray.push([]);
    for (let x = 0; x < cols; x++) {
      //half the time, be a 1. Other half, be a 0.
      if (random(100) < 50) {
        emptyArray[y].push(0);
      }
      else {
        emptyArray[y].push(1);
      }
    }
  }
  return emptyArray;
}

function generateEmptyGrid(cols, rows) {
  let emptyArray = [];
  for (let y = 0; y < rows; y++) {
    emptyArray.push([]);
    for (let x = 0; x < cols; x++) {
      emptyArray[y].push(0);
    }
  }
  return emptyArray;
}