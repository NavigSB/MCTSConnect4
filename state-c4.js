'use strict';

/** Class representing a game state. */
class State_C4 {

	constructor(playHistory, board, player) {
		this.playHistory = playHistory;
		this.board = board;
		this.player = player;
	}

	isPlayer(player) {
		return (player === this.player);
	}

	hash() {
		return JSON.stringify(this.playHistory);
	}
	
	print() {
		let boardCopy = this.board.slice();
		for(let i = 0; i < boardCopy.length; i++) {
			for(let j = 0; j < boardCopy[i].length; j++) {
				if(boardCopy[i][j] === -1) {
					boardCopy[i][j] = 2;
				}
			}
		}
		for(let i = 0; i < boardCopy.length; i++) {
			console.log(JSON.stringify(boardCopy[i]));
		}
	}

	// Note: If hash uses board, multiple parents possible
}