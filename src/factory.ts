import {
  BigInt,
  Address
} from '@graphprotocol/graph-ts'
import {
  CreateUnipoolWithProxyCall,
  CreateUnipoolCall
} from '../generated/Factory/Factory'
import {
  ERC20
} from '../generated/Factory/ERC20'
import {
  Pair as PairContract
} from '../generated/Factory/Pair'
import {
  UnipoolFactory,
  Token,
  Pair,
  Pool
} from '../generated/schema'

export function loadOrCreateFactory(address: Address): UnipoolFactory {
  let factory = UnipoolFactory.load(address.toHex())
  if (factory === null) {
    factory = new UnipoolFactory(address.toHex())
    factory.poolCount = 0
    factory.save()
  }
  return factory as UnipoolFactory
}

export function loadOrCreateToken(address: Address): Token {
  let token = Token.load(address.toHex())
  if (token === null) {
    let tokenContract = ERC20.bind(address)

    token = new Token(address.toHex())
    token.symbol = tokenContract.symbol()
    token.name = tokenContract.name()
    token.decimals = BigInt.fromI32(tokenContract.decimals())
    token.save()
  }
  return token as Token
}

export function loadOrCreatePair(address: Address): Pair {
  let pair = Pair.load(address.toHex())
  if (pair === null) {
    let pairContract = PairContract.bind(address)
    pair = new Pair(address.toHex())
    pair.token0 = loadOrCreateToken(pairContract.token0()).id
    pair.token1 = loadOrCreateToken(pairContract.token1()).id
    pair.save()
  }
  return pair as Pair
}

export function handleNewPool(call: CreateUnipoolCall): void {
  // TODO(onbjerg): Also persist balance proxies
  // Update factory stats
  let factory = loadOrCreateFactory(call.to)
  factory.poolCount = factory.poolCount + 1

  // Load pair data
  let pair = loadOrCreatePair(call.inputs._uniswapTokenExchange)

  // Create pool
  let pool = new Pool(call.outputs.value0.toHex())
  pool.pair = pair.id

  factory.save()
  pair.save()
  pool.save()
}

export function handleNewPoolWithProxy(call: CreateUnipoolWithProxyCall): void {
  // TODO(onbjerg): Also persist balance proxies
  // Update factory stats
  let factory = loadOrCreateFactory(call.to)
  factory.poolCount = factory.poolCount + 1

  // Load pair data
  let pair = loadOrCreatePair(call.inputs._uniswapTokenExchange)

  // Create pool
  let pool = new Pool(call.outputs.value0.toHex())
  pool.pair = pair.id

  factory.save()
  pair.save()
  pool.save()
}