import { BigInt, BigDecimal, Address, log } from "@graphprotocol/graph-ts";
import { ERC20 } from "../generated/Pool/ERC20";
import { UnipoolFactory, Token, Pair } from "../generated/schema";

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString("1");
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString("10"));
  }
  return bd;
}

export function loadOrCreateToken(address: Address): Token {
  let token = Token.load(address.toHex());
  if (token === null) {
    let tokenContract = ERC20.bind(address);

    token = new Token(address.toHex());
    token.symbol = tokenContract.symbol();
    token.name = tokenContract.name();
    token.decimals = BigInt.fromI32(tokenContract.decimals());
    token.save();
  }
  return token as Token;
}
