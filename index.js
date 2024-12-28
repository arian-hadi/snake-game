(function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
  
    // canvas size
    //const canvasSize = 680;
    const canvasWidth = 600;
    const canvasHeight = 400;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const canvasFillColor = "#000d36";
    const canvasStrokeColor = "rgba(99, 65, 65, 0.19)";
  
    const scoreEl = document.getElementById("score");
    const resetEl = document.getElementById("reset");
    const showGridEl = document.getElementById("show-grid");
    const highScoreEl = document.getElementById("high-score");
    const pauseEl = document.getElementById("pause");
    const playEl = document.getElementById("play");
  
  
    let score = 0;
  
    const setScore = () => {
      scoreEl.innerHTML = `Score 👉 ${score}`;
      if (score >= localStorage.getItem("highScore"))
        localStorage.setItem("highScore", score);
      highScoreEl.innerHTML = `HIGH SCORE 🚀 ${localStorage.getItem("highScore")}`;
    };
  
    // frame rate
    const frameRate = 9.5;
  
    // grid padding
    const pGrid = 4;
    // grid width
    const grid_line_width = canvasWidth - 2 * pGrid;
    //grid height
    const grid_line_height = canvasHeight - 2*pGrid;
   
    //  cell count
    const cellCountX = 44; // Number of cells horizontally
    const cellCountY = Math.floor((grid_line_height / grid_line_width) * cellCountX);
    const cellSize = grid_line_width / cellCountX; // Uniform cell size based on horizontal count
  
    let gameActive;
  
    // this will generate random color for head
    const randomColor = () => {
      let color;
      let colorArr = ["#426ff5", "#42f5e3"];
      color = colorArr[Math.floor(Math.random() * 2)];
      return color;
    };
  
    const head = {
      x: 2,
      y: 1,
      color: randomColor(),
      vX: 0,
      vY: 0,
      draw: () => {
        ctx.fillStyle = head.color;
        ctx.shadowColor = head.color;
        ctx.shadowBlur = 2.5;
        ctx.fillRect(
          head.x * cellSize + pGrid,
          head.y * cellSize + pGrid,
          cellSize,
          cellSize
        );
      },
    };
  
    let tailLength = 4;
    let snakeParts = [];
    class Tail {
      color = "#42f57e";
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 2.5;
        ctx.fillRect(
          this.x * cellSize + pGrid,
          this.y * cellSize + pGrid,
          cellSize,
          cellSize
        );
      }
    }
  
    const food = {
      x: 5,
      y: 5,
      color: "#FF3131",
      draw: () => {
        ctx.fillStyle = food.color;
        ctx.shadowColor = food.color;
        ctx.shadowBlur = 5;
        ctx.fillRect(
          food.x * cellSize + pGrid,
          food.y * cellSize + pGrid,
          cellSize,
          cellSize
        );
      },
    };
  
    // this will set canvas style
    const setCanvas = () => {
      // canvas fill
      ctx.fillStyle = canvasFillColor;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
      // canvas stroke
      ctx.strokeStyle = canvasStrokeColor;
      ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
    };
  
    //   this will draw the grid
    const drawGrid = () => {
      ctx.beginPath();
      for (let i = 0; i <= grid_line_width; i += cellSize) {
        ctx.moveTo(i + pGrid, pGrid);
        ctx.lineTo(i + pGrid, grid_line_height + pGrid);
      }
      for (let i = 0; i <= grid_line_height; i += cellSize) {
        ctx.moveTo(pGrid, i + pGrid);
        ctx.lineTo(grid_line_width + pGrid, i + pGrid);
      }
      ctx.closePath();
      ctx.strokeStyle = canvasStrokeColor;
      ctx.stroke();
    };
  
    const drawSnake = () => {
      //loop through our snakeparts array
      snakeParts.forEach((part) => {
        part.draw();
      });
  
      snakeParts.push(new Tail(head.x, head.y));
  
      if (snakeParts.length > tailLength) {
        snakeParts.shift(); //remove furthest item from  snake part if we have more than our tail size
      }
      head.color = randomColor();
      head.draw();
    };
  
    const updateSnakePosition = () => {
      head.x += head.vX;
      head.y += head.vY;
    };
  
    const changeDir = (e) => {
      let key = e.keyCode;
    
      // Pause/Resume Game with Space or Escape
      if (key === 32 || key === 27) { // Space or Escape
        if (!gameActive) {
          // Start the game on first run or after reset
          gameActive = true;
          pauseEl.setAttribute("class", "pause-active");
    
          // Default Movement Initialization (Move Right)
          if (head.vX === 0 && head.vY === 0) {
            head.vX = 1; // Start moving right
            head.vY = 0;
          }
        } else {
          // Pause or Resume
          gameActive = false; // Pause the game
          pauseEl.setAttribute("class", "pause-not-active");
        }
        return;
      }
    
      // Start Game with Any Key (excluding Space and Escape, which are handled above)
      if (!gameActive) {
        gameActive = true; // Activate the game
        pauseEl.setAttribute("class", "pause-active");
    
        // Default Movement Initialization (Move Right)
        if (head.vX === 0 && head.vY === 0) {
          head.vX = 1; // Start moving right
          head.vY = 0;
        }
        return;
      }
    
  
      if (key == 68 || key == 39) {
        if (head.vX === -1) return;
        head.vX = 1;
        head.vY = 0;
        // gameActive = true;
        return;
      }
      if (key == 65 || key == 37) {
        if (head.vX === 1) return;
        head.vX = -1;
        head.vY = 0;
        // gameActive = true;
        return;
      }
      if (key == 87 || key == 38) {
        if (head.vY === 1) return;
        head.vX = 0;
        head.vY = -1;
        // gameActive = true;
        return;
      }
      if (key == 83 || key == 40) {
        if (head.vY === -1) return;
        head.vX = 0;
        head.vY = 1;
        // gameActive = true;
        return;
      }
    };
  
    const foodCollision = () => {
      let foodCollision = false;
      snakeParts.forEach((part) => {
        if (part.x == food.x && part.y == food.y) {
          foodCollision = true;
        }
      });
      if (foodCollision) {
        food.x = Math.floor(Math.random() * cellCountX);
        food.y = Math.floor(Math.random() * cellCountY);
        score++;
        tailLength++;
      }
    };
  
    const isGameOver = () => {
      let gameOver = false;
  
      snakeParts.forEach((part) => {
        if (part.x == head.x && part.y == head.y) {
          gameOver = true;
        }
      });
  
      if (
        head.x < 0 ||
        head.y < 0 ||
        head.x > cellCountX - 1 ||
        head.y > cellCountY - 1
      ) {
        gameOver = true;
      }
  
      return gameOver;
    };
  
    const showGameOver = () => {
      const text = document.createElement("div");
      text.setAttribute("id", "game_over");
      text.innerHTML = "game over !";
      const body = document.querySelector("body");
      body.appendChild(text);
    };
  
    addEventListener("keydown", changeDir);
  
    const PlayButton = (show) => {
      if (!show) {
        playEl.style.display = "none";
      } else {
        playEl.style.display = "block";
      }
    };
  
    const pauseGame = () => {
      gameActive = false;
      if(!gameActive) {
        pauseEl.removeAttribute('class');
        pauseEl.setAttribute('class', 'pause-not-active')
      }
      if (!isGameOver()) PlayButton(true);
    };
  
    pauseEl.addEventListener("click", pauseGame);
  
    let showGrid = false;
  
    // this will initiate all
    const animate = () => {
      setCanvas();
      if (showGrid) drawGrid();
      drawSnake();
      food.draw();
      if (gameActive) {
        PlayButton(false);
        pauseEl.removeAttribute('class');
        pauseEl.setAttribute('class','pause-active');
        updateSnakePosition();
        if (isGameOver()) {
          showGameOver();
          PlayButton(false);
          return;
        }
      }
      setScore();
      foodCollision();
      setTimeout(animate, 1000 / frameRate);
    };
  
    const resetGame = () => {
      location.reload();
    };
  
    resetEl.addEventListener("click", resetGame);
  
    const toggleGrid = () => {
      if (!showGrid) {
        showGrid = true;
        showGridEl.innerHTML = `Hide Grid`
        return;
      }
      showGrid = false;
      showGridEl.innerHTML=`Show Grid`
    };
  
    showGridEl.addEventListener("click", toggleGrid);
    animate();
  })();