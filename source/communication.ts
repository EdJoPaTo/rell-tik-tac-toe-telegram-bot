import {TableFullInfo, TableParticipantInfo, TableInfo, UserKeys} from './types'

/* eslint @typescript-eslint/no-var-requires: warn */
const pcl = require('postchain-client')

// Check the node log on rellide-staging.chromia.dev to get node api url.
// const nodeApiUrl = 'https://rellide-staging.chromia.dev/node/XXXXX/'
const nodeApiUrl = 'http://195.128.102.22:7741'
const blockchainRID = '4C50A7E40EC5C65E0038854366B262436F4CD92AB95FEC8506A6451A7D48117A'

const rest = pcl.restClient.createRestClient(nodeApiUrl, blockchainRID, 5)
const gtx = pcl.gtxClient.createClient(
	rest,
	Buffer.from(
		blockchainRID,
		'hex'
	),
	[]
)

function keysBufferToString(b: Buffer): string {
	return b.toString('hex')
}

function keysStringToBuffer(s: string): Buffer {
	return Buffer.from(s, 'hex')
}

async function doOperations(keys: UserKeys, addOps: (tx: any) => void): Promise<void> {
	const tx = gtx.newTransaction([keysStringToBuffer(keys.pubKey)])

	addOps(tx)

	tx.sign(keysStringToBuffer(keys.privKey), keysStringToBuffer(keys.pubKey))
	await tx.postAndWaitConfirmation()
}

export async function createPlayer(name: string): Promise<UserKeys> {
	const user = pcl.util.makeKeyPair()
	const {pubKey, privKey} = user
	const keys: UserKeys = {
		pubKey: keysBufferToString(pubKey),
		privKey: keysBufferToString(privKey)
	}

	await doOperations(keys, tx => {
		tx.addOperation('create_player', name, pubKey)
	})

	return keys
}

export async function createTable(tableName: string, userKeys: UserKeys): Promise<void> {
	await doOperations(userKeys, tx => {
		tx.addOperation('create_table', tableName, keysStringToBuffer(userKeys.pubKey))
	})
}

export async function joinTable(tableName: string, userKeys: UserKeys): Promise<void> {
	await doOperations(userKeys, tx => {
		tx.addOperation('join_table', tableName, keysStringToBuffer(userKeys.pubKey))
	})
}

export async function move(tableName: string, userKeys: UserKeys, cell: number): Promise<void> {
	await doOperations(userKeys, tx => {
		tx.addOperation('move', tableName, keysStringToBuffer(userKeys.pubKey), cell)
	})
}

export async function getPlayers(): Promise<string[]> {
	const raw = await gtx.query(
		'getPlayers',
		{}
	)

	const names = raw.map((o: any) => o.name)

	return names
}

export async function getPlayer(userKeys: UserKeys): Promise<unknown> {
	const result = await gtx.query(
		'getPlayer',
		{
			pubkey: userKeys.pubKey
		}
	)

	return result
}

export async function getTables(): Promise<TableInfo[]> {
	const raw = await gtx.query(
		'getTables',
		{}
	)

	return raw
}

export async function getOpenTables(userKeys: UserKeys): Promise<TableInfo[]> {
	const raw = await gtx.query(
		'getOpenTables',
		{
			pubkey: userKeys.pubKey
		}
	)

	return raw
}

export async function getPlayerTables(userKeys: UserKeys): Promise<TableParticipantInfo[]> {
	const raw = await gtx.query(
		'getPlayerTables',
		{
			pubkey: userKeys.pubKey
		}
	)

	return raw
}

export async function getTable(tableName: string): Promise<TableFullInfo> {
	const raw = await gtx.query(
		'getGame',
		{
			name: tableName
		}
	)

	return raw
}
