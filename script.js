let move_speed = 7, gravity = 0.5;
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
    let bird_dy = 0; // bird velocity (dy)
    let pipe_seperation = 0;
    let pipe_gap = 35;

    // Jump controls (once only)
    document.addEventListener('keydown', (e) => {
        if (game_state === 'Play' && (e.key === 'ArrowUp' || e.key === ' ')) {
            bird_dy = -8; // Jump height
            img.src = 'images/Bird-2.png';
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowUp' || e.key === ' ') {
            img.src = 'images/Bird.png';
        }
    });

    // Gravity + Bird Movement
    function apply_gravity() {
        if (game_state !== 'Play') return;

        bird_dy += gravity; // Apply gravity
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();

        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            endGame();
            return;
        }

        requestAnimationFrame(apply_gravity);
    }

    // Move pipes
    function move_pipes() {
        if (game_state !== 'Play') return;

        let pipes = document.querySelectorAll('.pipe_sprite');
        pipes.forEach((pipe) => {
            let pipe_props = pipe.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            // Collision detection
            if (
                pipe_props.left < bird_props.right &&
                pipe_props.right > bird_props.left &&
                pipe_props.top < bird_props.bottom &&
                pipe_props.bottom > bird_props.top
            ) {
                endGame();
                return;
            }

            // Remove pipes off screen
            if (pipe_props.right <= 0) {
                pipe.remove();
            } else {
                pipe.style.left = pipe_props.left - move_speed + 'px';
            }

            // Score logic
            if (
                pipe_props.right < bird_props.left &&
                pipe_props.right + move_speed >= bird_props.left &&
                pipe.increase_score === '1'
            ) {
                score_val.innerHTML = parseInt(score_val.innerHTML) + 1;
                pipe.increase_score = '0';
                sound_point.play();
            }
        });

        requestAnimationFrame(move_pipes);
    }

    // Create new pipes
    function create_pipe() {
        if (game_state !== 'Play') return;

        if (pipe_seperation > 115) {
            pipe_seperation = 0;

            let pipe_posi = Math.floor(Math.random() * 43) + 8;

            let pipe_top = document.createElement('div');
            pipe_top.className = 'pipe_sprite';
            pipe_top.style.top = pipe_posi - 70 + 'vh';
            pipe_top.style.left = '100vw';
            document.body.appendChild(pipe_top);

            let pipe_bottom = document.createElement('div');
            pipe_bottom.className = 'pipe_sprite';
            pipe_bottom.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_bottom.style.left = '100vw';
            pipe_bottom.increase_score = '1';
            document.body.appendChild(pipe_bottom);
        }

        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }

    function endGame() {
        game_state = 'End';
        message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
        message.classList.add('messageStyle');
        img.style.display = 'none';
        sound_die.play();
    }

    // Start animations
    requestAnimationFrame(apply_gravity);
    requestAnimationFrame(move_pipes);
    requestAnimationFrame(create_pipe);
}







