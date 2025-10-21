let move_speed = 3.2;   // balanced pipe movement
let gravity = 0.35;     // smoother, slower fall

let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && game_state !== 'Play') {
        document.querySelectorAll('.pipe_sprite').forEach((el) => el.remove());
        img.style.display = 'block';
        bird.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');
        play();
    }
});

function play() {
    let bird_dy = 0; // bird vertical velocity

    // === MOVE PIPES ===
    function move() {
        if (game_state !== 'Play') return;

        let pipes = document.querySelectorAll('.pipe_sprite');
        pipes.forEach((pipe) => {
            let pipe_props = pipe.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            // remove off-screen pipes
            if (pipe_props.right <= 0) pipe.remove();
            else {
                // collision detection
                if (
                    bird_props.left < pipe_props.left + pipe_props.width &&
                    bird_props.left + bird_props.width > pipe_props.left &&
                    bird_props.top < pipe_props.top + pipe_props.height &&
                    bird_props.top + bird_props.height > pipe_props.top
                ) {
                    endGame();
                    return;
                }

                // scoring
                if (
                    pipe_props.right < bird_props.left &&
                    pipe_props.right + move_speed >= bird_props.left &&
                    pipe.increase_score === '1'
                ) {
                    score_val.innerHTML = parseInt(score_val.innerHTML) + 1;
                    pipe.increase_score = '0';
                    sound_point.play();
                }

                pipe.style.left = pipe_props.left - move_speed + 'px';
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    // === GRAVITY & FLAP ===
    function apply_gravity() {
        if (game_state !== 'Play') return;

        bird_dy += gravity;

        // Handle jump
        document.onkeydown = (e) => {
            if (e.key === 'ArrowUp' || e.key === ' ') {
                bird_dy = -6; // reduced jump height (was -7.6)
                img.src = 'images/Bird-2.png';
            }
        };
        document.onkeyup = (e) => {
            if (e.key === 'ArrowUp' || e.key === ' ') {
                img.src = 'images/Bird.png';
            }
        };

        // Apply vertical movement
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();

        // Prevent bird from going out of bounds
        if (bird_props.top <= 0) {
            bird.style.top = '0px';
            bird_dy = 0;
        }
        if (bird_props.bottom >= background.bottom) {
            endGame(true);
            return;
        }

        // Slight rotation for realism
        let tilt = bird_dy < 0 ? -15 : Math.min(25, bird_dy * 2);
        bird.style.transform = `rotate(${tilt}deg)`;

        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    // === CREATE PIPES ===
    let pipe_separation = 0;
    const pipe_gap = 40; // bigger gap between pipes for easier play

    function create_pipe() {
        if (game_state !== 'Play') return;

        if (pipe_separation > 100) {
            pipe_separation = 0;

            let pipe_posi = Math.floor(Math.random() * 40) + 10;

            // upper pipe
            let pipe_top = document.createElement('div');
            pipe_top.className = 'pipe_sprite';
            pipe_top.style.top = pipe_posi - 70 + 'vh';
            pipe_top.style.left = '100vw';
            document.body.appendChild(pipe_top);

            // lower pipe
            let pipe_bottom = document.createElement('div');
            pipe_bottom.className = 'pipe_sprite';
            pipe_bottom.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_bottom.style.left = '100vw';
            pipe_bottom.increase_score = '1';
            document.body.appendChild(pipe_bottom);
        }

        pipe_separation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);

    // === GAME OVER ===
    function endGame(reload = false) {
        game_state = 'End';
        img.style.display = 'none';
        message.innerHTML = '💥 Game Over 💥<br>Press <b>Enter</b> to Restart';
        message.classList.add('messageStyle');
        sound_die.play();
        if (reload) setTimeout(() => window.location.reload(), 700);
    }
}


