let board = null;
let game = new Chess();
let difficulty = 'easy';

function showDifficulty() {
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('difficulty-screen').classList.remove('hidden');
}

function startGame(level) {
    difficulty = level;
    document.getElementById('difficulty-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    let config = {
        draggable: true,
        position: 'start',
        onDrop: handleMove
    };
    board = Chessboard('myBoard', config);
}

function handleMove(source, target) {
    let move = game.move({ from: source, to: target, promotion: 'q' });
    if (move === null) return 'snapback';

    window.setTimeout(makeComputerMove, 250);
}

function makeComputerMove() {
    if (game.game_over()) return checkEndGame();

    let moves = game.moves();
    let selectedMove;

    // Difficulty Logic based on your Win Rate requirements
    let randomSeed = Math.random() * 100;
    
    if (difficulty === 'easy' && randomSeed < 70) {
        // Player should win 70% of time: AI picks a random (often bad) move
        selectedMove = moves[Math.floor(Math.random() * moves.length)];
    } else if (difficulty === 'medium' && randomSeed < 40) {
        selectedMove = moves[Math.floor(Math.random() * moves.length)];
    } else {
        // Hard mode or AI playing "smart"
        // Simply picks the first move for this demo, usually better to integrate Stockfish.js here
        selectedMove = moves[0]; 
    }

    game.move(selectedMove);
    board.position(game.fen());
    
    if (game.game_over()) checkEndGame();
}

function checkEndGame() {
    if (game.in_checkmate()) {
        if (game.turn() === 'b') { // Computer is black, computer lost
            document.getElementById('win-screen').classList.remove('hidden');
        } else {
            document.getElementById('lose-screen').classList.remove('hidden');
        }
    }
}
