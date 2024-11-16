// konstante
const CANVAS_WIDTH = 1000;

const BRICK_ROWS = 4;
const BRICK_COLUMNS = 7;
const BRICK_PADDING = 5;

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // svojstva platfome - njezine dimenzije, brzina i pozicioniranje
    const platform = {
        width: 40,
        height: 5,
        x: canvas.width / 2 - 20,
        y: canvas.height - 15,
        speed: 4,
        dx: 0
    };

    // svojstva jednog bloka
    const brick = {
        width: (canvas.width - (BRICK_COLUMNS + 1) * BRICK_PADDING) / BRICK_COLUMNS,
        height: 5,
        padding: BRICK_PADDING,
        offsetTop: 10,
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
    const bricks = [];
    for (let row = 0; row < BRICK_ROWS; row++) {
        bricks[row] = [];
        for (let col = 0; col < BRICK_COLUMNS; col++) {
            bricks[row][col] = { x: 0, y: 0, isVisible: true };
        }
    }

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

    // crtanje platforme
    function drawPlatform() {
        ctx.fillStyle = "red";
        ctx.shadowColor = "#ff0000";
        ctx.shadowBlur = 5;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }

    // crtanje cigli
    function drawBricks() {
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
                    ctx.shadowColor = "#ff0000";
                    ctx.shadowBlur = 5;
                    ctx.fillRect(brickX, brickY, brick.width, brick.height);
                }
            }
        }
    }

    // crtanje loptice
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
    }

    // očisti platno
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

    // ažuriranje pozicije loptice
    function updateBallPosition() {
        ball.x += ball.dx;
        ball.y += ball.dy;

        // ako se sudari s lijevim ili desnim rubom
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
            ball.dx *= -1;
        }

        // ako udari u gornji rub
        if (ball.y - ball.radius < 0) {
            ball.dy *= -1;
        }

        // pad na dno
        if (ball.y - ball.radius > platform.y + platform.height) {
            alert("GAME OVER!");
            document.location.reload();
        }

        // odbijanje od platforme
        if (
            ball.y + ball.radius > platform.y &&
            ball.x > platform.x &&
            ball.x < platform.x + platform.width
        ) {
            ball.dy *= -1;
        }
    }

    // crtanje platna
    function updateGameCanvas() {
        // prvo cistimo canvas da se ne preslika i staro stanje elemenata
        clearCanvas();
        // crtamo platformu
        drawPlatform();
        // crtamo cigle
        drawBricks();
        // crtanje loptice
        drawBall();
    }

    // funkcija koja odrađuje jedan frame igre
    function gameLoop() {
        updatePlatformPosition();
        updateBallPosition();
        updateGameCanvas();
        requestAnimationFrame(gameLoop);
    }

    // pokretanje igre
    gameLoop();
});