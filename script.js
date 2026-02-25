let board = null;
let game = new Chess();
let aiLevel = 'easy';

function showDifficulty() {
    $('#home-screen').fadeOut(300, () => $('#difficulty-screen').removeClass('hidden'));
}

function startGame(level) {
    aiLevel = level;
    $('#difficulty-screen').fadeOut(300, () => {
        $('#game-screen').removeClass('hidden');
        initBoard();
    });
}

function initBoard() {
    const config = {
        draggable: true,
        position: 'start',
        // This line fixes the missing pieces!
        pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
        onDrop: handleMove
    };
    board = Chessboard('board', config);
}

function handleMove(source, target) {
    const move = game.move({ from: source, to: target, promotion: 'q' });
    if (move === null) return 'snapback';

    updateStatus();
    window.setTimeout(makeBestMove, 500);
}

function makeBestMove() {
    if (game.game_over()) return;

    const moves = game.moves();
    const winChance = Math.random();
    let move;

    // AI Logic based on your hidden win rates
    if (aiLevel === 'easy' && winChance < 0.70) {
        move = moves[Math.floor(Math.random() * moves.length)]; // Plays bad
    } else if (aiLevel === 'medium' && winChance < 0.40) {
        move = moves[Math.floor(Math.random() * moves.length)];
    } else {
        move = moves[0]; // Simple logic for "Hard", ideally use Stockfish
    }

    game.move(move);
    board.position(game.fen());
    updateStatus();
    checkGameOver();
}

function updateStatus() {
    let status = game.turn() === 'w' ? "Your Turn" : "Thinking...";
    if (game.in_check()) status += " (Check!)";
    $('#status').text(status);
}

function checkGameOver() {
    if (game.in_checkmate()) {
        if (game.turn() === 'w') $('#lose-screen').removeClass('hidden');
        else $('#win-screen').removeClass('hidden');
    } else if (game.in_draw()) {
        alert("Draw!");
        location.reload();
    }
}
