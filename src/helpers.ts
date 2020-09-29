import {
  BigInt,
  BigDecimal,
  Address
} from '@graphprotocol/graph-ts'
import {
  ERC20
} from '../generated/Factory/ERC20'
import {
  Pair as PairContract
} from '../generated/Factory/Pair'
import {
  UnipoolFactory,
  Token,
  Pair
} from '../generated/schema'

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}

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
