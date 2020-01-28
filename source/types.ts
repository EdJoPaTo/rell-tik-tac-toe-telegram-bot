export interface Session {
	privKey: string;
	pubKey: string;
}

/*
enum game_state {
	wait_for_player,
	turn_X,
	turn_O,
	finished_winner_X,
	finished_winner_O,
	finished_draw
}

enum field_state { X, O, unset }
*/

export type GameState = 'wait_for_player' | 'turn_X' | 'turn_O' | 'finished_winner_X' | 'finished_winner_O' | 'finished_draw'
export const GAME_STATE: GameState[] = ['wait_for_player', 'turn_X', 'turn_O', 'finished_winner_X', 'finished_winner_O', 'finished_draw']

export function gameStateByInt(index: number): GameState {
	return GAME_STATE[index]
}

export type FieldState = 'X' | 'O' | 'unset'
export const FIELD_STATE: FieldState[] = ['X', 'O', 'unset']

export function fieldStateByInt(index: number): FieldState {
	return FIELD_STATE[index]
}

export interface Game {
	state: GameState;
	playerX: string;
	playerO: string;
	field: FieldState[];
}
