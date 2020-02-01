export interface UserKeys {
	pubKey: string;
	privKey: string;
}

export interface Session extends UserKeys {
}

export enum TableState {
	WaitForPlayer = 0,
	Running = 1,
	Draw = 2,
	GameWon = 3
}

export enum FieldState {
	Unset = 0,
	X = 1,
	O = 2
}

export interface TableInfo {
	name: string;
	/* eslint @typescript-eslint/camelcase: off */
	whose_turn: string;
}

export interface TableStateInfo extends TableInfo {
	state: TableState;
}

export interface TableParticipantInfo extends TableStateInfo {
	sign: FieldState;
}

export interface TableFullInfo extends TableStateInfo {
	board: number[];
	players: PlayerOnBoard[];
}

export interface PlayerOnBoard {
	name: string;
	sign: FieldState;
}
