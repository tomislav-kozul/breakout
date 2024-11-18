// konstante
const CANVAS_WIDTH = 1000;

var BRICK_ROWS = 5;
var BRICK_COLUMNS = 7;
var BRICK_PADDING = 5;
var BALL_SPEED = 1;

// pozadinska pjesma koja krece kada krene i igra
const backgroundMusic = new Audio("/sounds/background.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.2;

// ostali zvukovi
const bounceSound = new Audio("sounds/bounce.mp3");
bounceSound.volume = 0.5;
const winSound = new Audio("sounds/win.mp3");
winSound.volume = 0.7
const gameOverSound = new Audio("sounds/game-over.mp3");
gameOverSound.volume = 0.7
const blockHitSound = new Audio("sounds/block-hit.mp3");
blockHitSound.volume = 0.3;

function playSound(sound) {
    // postavi zvuk na pocetak i onda ga play-aj
    sound.currentTime = 0; 
    sound.play();
}

document.addEventListener("DOMContentLoaded", () => {
    const startScreen = document.getElementById("startScreen");
    const settingsForm = document.getElementById("settingsForm");

    settingsForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // dohvati user input sa start screena
        const rows = parseInt(document.getElementById("rows").value);
        const columns = parseInt(document.getElementById("columns").value);
        const ballSpeed = parseFloat(document.getElementById("ballSpeed").value);

        BRICK_ROWS = rows;
        BRICK_COLUMNS = columns;
        BALL_SPEED = ballSpeed;

        // pokreni pjesmu
        startScreen.style.display = "none";
        backgroundMusic.play();

        // ponovo moramo inicijalizirati ciglu s novim vrijednostima
        // jer dimenzije cigle ovise o broju stupaca (sirina)
        brick = {
            width: (canvas.width - (BRICK_COLUMNS + 1) * BRICK_PADDING) / BRICK_COLUMNS,
            height: 5,
            padding: BRICK_PADDING,
            offsetTop: 25,
            color: "#e26a1f"
        };

        // ponovo inicijaliziraj polje cigli
        for (let row = 0; row < BRICK_ROWS; row++) {
            bricks[row] = [];
            for (let col = 0; col < BRICK_COLUMNS; col++) {
                bricks[row][col] = { x: 0, y: 0, isVisible: true };
            }
        }

        initBallAngle();
        gameLoop();
    });

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // svojstva platfome - njezine dimenzije, brzina i pozicioniranje
    const platform = {
        width: 40,
        height: 5,
        x: canvas.width / 2 - 20,
        y: canvas.height - 15,
        speed: 3.3,
        dx: 0
    };

    // svojstva jednog bloka
    var brick = {
        width: (canvas.width - (BRICK_COLUMNS + 1) * BRICK_PADDING) / BRICK_COLUMNS,
        height: 5,
        padding: BRICK_PADDING,
        offsetTop: 25,
        color: "#e26a1f"
    };

    // svojstva loptice
    const ball = {
        radius: 3,
        x: canvas.width / 2,
        y: platform.y - 3,
        dx: 2,
        dy: -2,
        color: "lightblue"
    };

    // inicijalizacija polja cigli
    var bricks = [];
    
    document.addEventListener("keydown", keyPressedDown);
    document.addEventListener("keyup", keyLiftedUp);

    // poziva se na pritisak tipke korisnika
    function keyPressedDown(e) {
        // ako je pritisnuta desna strelica -> x vrijednost pozicije platforme raste
        if (e.key === "ArrowRight") {
            platform.dx = platform.speed;
            // ako je pritisnuta lijeva strelica -> x vrijednost pozicije platforme pada
        } else if (e.key === "ArrowLeft") {
            platform.dx = -platform.speed;
        }
    }

    // kada je bilo koja tipka podignuta - platforma se ne miče
    function keyLiftedUp(e) {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            platform.dx = 0;
        }
    }

    // postavi nasumicni kut loptice na pocetku
    function initBallAngle() {
        var angle = Math.random() * Math.PI / 6 + Math.PI / 4; // kut od 45 do 45 + 30 stupnjeva
        // izaberi stranu - mora bit ovako
        // da sam samo generirao kod od 30 do 150 stupnjeva postoji sansa da kut bude 90 
        // loptica ce ic samo ravno gore dolje - nije dobro
        if (Math.random() > 0.5) {
            angle = Math.PI - angle;
        }

        const speed = BALL_SPEED / 3;
        ball.dx = speed * Math.cos(angle); // x je horizontalna (cos) komponenta
        ball.dy = -speed * Math.sin(angle); // y je vertikalna (sin) komponenta
    }

    // da li je igra gotova
    let isGameOver = false;

    // kad igra zavrsi ispisi poruku na sredinu canvasa
    function drawMessage(message) {
        const lines = message.split("\n");
        ctx.shadowColor = "#ff0000";
        ctx.shadowBlur = 5;

        // 'game over' ili 'you won'
        ctx.font = "16px 'Press Start 2P', sans-serif";
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText(lines[0], canvas.width / 2, canvas.height / 2 - 5);

        // 'your score'
        ctx.font = "12px 'Press Start 2P', sans-serif";
        ctx.fillText(lines[1], canvas.width / 2, canvas.height / 2 + 15);

        ctx.font = "6px 'Press Start 2P', sans-serif";
        ctx.fillText("Click to play again", canvas.width / 2, canvas.height / 4 * 3);
    }

    // funkcija koja se poziva na kraju igre
    // poruka koja se ispisuje je argument
    function endGame(message) {
        backgroundMusic.pause();

        isGameOver = true;
        drawMessage(message);

        // kad igrac klikne na canvas - igra ponovo krece
        canvas.addEventListener("click", restartGame);
    }

    // ponovo pokreni igru
    function restartGame() {
        // makni listener 
        canvas.removeEventListener("click", restartGame);
        document.location.reload();
    }

    // crtanje platforme
    function drawPlatform() {
        ctx.fillStyle = "red";
        ctx.shadowColor = "#ff0000";
        ctx.shadowBlur = 5;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }

    // crtanje cigli
    function drawBricks() {
        // parametar za shadow treba postaviti samo jednom jer se 'pamti'
        ctx.shadowColor = "#ff0000";
        ctx.shadowBlur = 5;
        for (let row = 0; row < BRICK_ROWS; row++) {
            for (let col = 0; col < BRICK_COLUMNS; col++) {
                if (bricks[row][col].isVisible) {
                    // za svaku ciglu koja je vidljiva (nije vidljiva nakon dodira s lopticom)
                    // postavi njezine dimenzije
                    const brickX = col * (brick.width + brick.padding) + brick.padding;
                    const brickY = row * (brick.height + brick.padding) + brick.offsetTop;
                    bricks[row][col].x = brickX;
                    bricks[row][col].y = brickY;

                    ctx.fillStyle = brick.color;
                    ctx.fillRect(brickX, brickY, brick.width, brick.height);
                }
            }
        }
    }

    // crtanje loptice
    function drawBall() {
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
    }

    // ocisti platno
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // azuriranje pozicije platforme
    function updatePlatformPosition() {
        // azuriraj poziciju
        platform.x += platform.dx;

        // pazi na lijevu granicu platforme
        if (platform.x < 0) {
            platform.x = 0;
            // pazi na desnu granicu platforme
        } else if (platform.x + platform.width > canvas.width) {
            platform.x = canvas.width - platform.width;
        }
    }

    // broj unistenih cigli
    var score = 0;
    // najbolji score dohvacen iz local storagea
    // ako je igra prvi put pokrenuta -> high score je 0
    var highScore = localStorage.getItem("highScore") || 0;

    // azuriranje pozicije loptice
    function updateBallPosition() {
        if (isGameOver) return;

        ball.x += ball.dx;
        ball.y += ball.dy;

        // ako se sudari s lijevim ili desnim rubom
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
            playSound(bounceSound);
            ball.dx *= -1;
        }

        // ako udari u gornji rub
        if (ball.y - ball.radius < 0) {
            playSound(bounceSound);
            ball.dy *= -1;
        }

        // pad na dno - user gubi
        if (ball.y + ball.radius > platform.y + platform.height) {
            playSound(gameOverSound);
            // ako je igrac imao score veci od high scorea - spremi ga
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", highScore);
                endGame("GAME OVER!\nNEW HIGH SCORE: " + highScore + "!");
            } else {
                endGame("GAME OVER!\nYour score: " + score);
            }
        }

        // odbijanje od platforme
        if (
            ball.y + ball.radius > platform.y &&
            ball.x > platform.x &&
            ball.x < platform.x + platform.width
        ) {
            playSound(bounceSound);
            ball.dy *= -1;
        }

        // provjeri da li se loptica zabila u ciglu
        for (let row = 0; row < BRICK_ROWS; row++) {
            for (let col = 0; col < BRICK_COLUMNS; col++) {
                const brick_element = bricks[row][col];
                if (brick_element.isVisible) {
                    // provjera lokacija na canvasu
                    if (
                        ball.x + ball.radius > brick_element.x &&
                        ball.x - ball.radius < brick_element.x + brick.width &&
                        ball.y + ball.radius > brick_element.y &&
                        ball.y - ball.radius < brick_element.y + brick.height
                    ) {
                        playSound(blockHitSound);
                        score++;
                        brick_element.isVisible = false; // unisti ciglu
                        ball.dy *= -1; // loptica mijenja smjer vertikalno ali ne hor
                        return;
                    }
                }
            }
        }
    }

    // ispisi 'score' i 'high score' u gornjem desnom kutu
    function drawScore() {
        ctx.font = "6px 'Press Start 2P', sans-serif";
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "right";
        ctx.fillText(`Score: ${score}`, canvas.width - 5, 10);
        ctx.fillText(`High Score: ${highScore}`, canvas.width - 5, 20);
    }

    // crtanje canvasa
    function updateGameCanvas() {
        if (isGameOver) return;

        // prvo cistimo canvas da se ne preslika i staro stanje elemenata
        clearCanvas();
        // crtamo platformu
        drawPlatform();
        // crtamo cigle
        drawBricks();
        // crtanje loptice
        drawBall();
        // azuriranje score-a
        drawScore();
        // ako su sve cigle unistene
        if (score == BRICK_ROWS * BRICK_COLUMNS) {
            playSound(winSound);
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", highScore);
                endGame("YOU WON!\nNEW HIGH SCORE: " + highScore + "!");
            } else {
                endGame("YOU WON!\nYour score: " + score);
            }
        }
    }

    // funkcija koja rendera jedan frame igre
    function gameLoop() {
        updatePlatformPosition();
        updateBallPosition();
        updateGameCanvas();
        requestAnimationFrame(gameLoop);
    }
});