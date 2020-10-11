importScripts("play-c4.js", "state-c4.js", "game-c4.js");
importScripts("monte-carlo-nodes.js", "monte-carlo.js");

let game = new Game_C4();
let mcts = new MonteCarlo(game);

let state;
let winner;

onmessage = function(e) {
	if(e.data.type === "all-ai") {
		// From initial state, take turns to play game until someone wins
		while (winner === null) {
			runCycle();
		}
	}else
	if(e.data.type === "single-player") {
		state = e.data.state;
		Object.setPrototypeOf(state, State_C4.prototype)
		winner = game.winner(state);
		runCycle();
	}
};

function runCycle() {
	mcts.runSearch(state, 1);
	let play = mcts.bestPlay(state);
	state = game.nextState(state, play);
	winner = game.winner(state);
	if(winner !== null) {
		winner = (winner > 0) ? "X" : "O";
		let winnerStr = "Winner: " + winner;
		postMessage({
			state: state,
			winnerStr: winnerStr, 
			hasWinner: true
		});
	}else{
		postMessage(state);
	}
}
