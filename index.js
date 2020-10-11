let game = new Game_C4();
let mcts = new MonteCarlo(game);

let state = game.start();
let winner = game.winner(state);

let winnerStr = "";
let winnerDisplayed = false;

let states = [state];
let currState = 0;

let statesFound = 0;

let falling = [];
const intervals = [0, 190, 270, 330, 380, 430];

const PLAYER = -1;
const ALL_AI = false;

window.addEventListener('DOMContentLoaded', (event) => {
    displayBoard(state);
});

let w;
let inte = setInterval(function() {
	if(falling[0] !== undefined) {
		let disk = falling[0];
		disk.time += 20;
		if(disk.currRow === disk.row) {
			falling.shift();
			emptyText();
			displayBoard(states[currState], disk);
			currState++;
			return;
		}else
		if(disk.time >= intervals[disk.interval+1]) {
			disk.interval++;
			disk.currRow++;
		}
		emptyText();
		displayBoard(states[currState], disk);
	}
	if(currState !== 0 && falling.length === 0 && winnerStr !== "" && !winnerDisplayed) {
		displayText(winnerStr);
		winnerDisplayed = true;
	}
}, 20);

function onWorkerMsg(event) {
	let data = event.data;
	if(event.data.hasWinner) {
		winnerStr = event.data.winnerStr;
		w.terminate();
		w = undefined;
		data = event.data.state;
	}
	states.push(data);
	let lastPlay = data.playHistory.pop();
	addFalling(lastPlay.row, lastPlay.col, data.player);
	if(!ALL_AI && !event.data.hasWinner) {
		w.terminate();
		w = undefined;
	}
};

function playerGo(col) {
	let row;
	let board = states[currState].board.slice();
	for(let i = board.length-1; i >= 0; i--) {
		if(board[i][col] === 0) {
			row = i;
			break;
		}
	}
	addFalling(row, col, PLAYER);
	let newState = game.nextState(states[currState], new Play_C4(row, col));
	states.push(newState);
	w = new Worker("game-worker.js");
	w.onmessage = onWorkerMsg;
	w.postMessage({
		type: "single-player", 
		state: newState
	});
}

function addFalling(row, column, player) {
	falling.push({
		row: row,
		column: column,
		player: player,
		currRow: 0,
		time: 0,
		interval: 0
	});
}

function displayBoard(state, disk) {
	let board = state.board.slice();
	for(let i = 0; i < board.length; i++) {
		let txt = "|";
		for(let j = 0; j < board[i].length; j++) {
			let currSpace = board[i][j];
			if(disk !== undefined) {
				if(disk.column === j) {
					if(disk.currRow === i) {
						currSpace = -disk.player;
					}else
					if(disk.row === i) {
						currSpace = 0;
					}
				}
			}
			switch(currSpace) {
				case 0:  txt += " _ |"; break;
				case 1:  txt += " x |"; break;
				case -1: txt += " o |"; break;
			}
		}
		displayText(txt);
	}
}

function displayText(txt) {
	if(document.getElementById("boardContainer") === null) {
		let container = document.createElement("div");
		container.setAttribute("id", "boardContainer");
		document.body.append(container);
	}
	
	let p = document.createElement("p");
	p.innerHTML = txt;
	document.getElementById("boardContainer").appendChild(p);
}

function emptyText() {
	if(document.getElementById("boardContainer") !== null) {
		document.getElementById("boardContainer").innerHTML = "";
	}
}