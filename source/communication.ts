import {Game, gameStateByInt, fieldStateByInt} from './types'

/* eslint @typescript-eslint/no-var-requires: warn */
const pcl = require('postchain-client')
// const crypto = require('crypto')

// Check the node log on rellide-staging.chromia.dev to get node api url.
// const nodeApiUrl = 'https://rellide-staging.chromia.dev/node/XXXXX/'
const nodeApiUrl = 'https://rellide-staging.chromia.dev/node/10014/'
const blockchainRID = '53941D0F4661839F249F4311D4E2FF9AB1C3DF4C87E0BF31029919DA8A786442' // default RID on rellide-staging.chromia.dev

const rest = pcl.restClient.createRestClient(nodeApiUrl, blockchainRID, 5)
const gtx = pcl.gtxClient.createClient(
	rest,
	Buffer.from(
		blockchainRID,
		'hex'
	),
	[]
)

export interface UserKeys {
	pubKey: string,
	privKey: string
}

function keysBufferToString(b: Buffer): string {
	return b.toString('hex')
}

function keysStringToBuffer(s: string): Buffer {
	return Buffer.from(s, 'hex')
}

async function doOperations(keys: UserKeys, addOps: (tx: any) => void): Promise<void> {
	const tx = gtx.newTransaction([keysStringToBuffer(keys.pubKey)])

	addOps(tx)

	tx.sign(keysStringToBuffer(keys.privKey), keysStringToBuffer(keys.pubKey));
	await tx.postAndWaitConfirmation();
}

export async function createUser(name: string): Promise<UserKeys> {
	const user = pcl.util.makeKeyPair()
	const {pubKey, privKey} = user
	const keys: UserKeys = {
		pubKey: keysBufferToString(pubKey),
		privKey: keysBufferToString(privKey)
	}

	await doOperations(keys, tx => {
		tx.addOperation('create_user', name, pubKey)
	})

	return keys
}

export async function tryJoin(userKeys: UserKeys): Promise<void> {
	await doOperations(userKeys, tx => {
		tx.addOperation('try_join', keysStringToBuffer(userKeys.pubKey))
	})
}

export async function doTurn(userKeys: UserKeys, fieldId: number): Promise<void> {
	await doOperations(userKeys, tx => {
		tx.addOperation('do_turn', keysStringToBuffer(userKeys.pubKey), fieldId)
	})
}

export async function getAllUsers(): Promise<string[]> {
	const result = await gtx.query(
		'get_all_users',
		{}
	)

	return result
}

export async function getAllGames(): Promise<unknown[]> {
	const result = await gtx.query(
		'get_all_games',
		{}
	)

	return result
}

export async function getOngoingGame(userKeys: UserKeys): Promise<Game | undefined> {
	const raw = await gtx.query(
		'get_ongoing_game',
		{
			pubkey: userKeys.pubKey
		}
	)

	if (!raw) {
		return undefined
	}

	const [gameState, playerX, playerO, field] = raw

	const result: Game = {
		playerX, playerO,
		state: gameStateByInt(gameState),
		field: field[0].map((o: number) => fieldStateByInt(o))
	}

	return result
}
