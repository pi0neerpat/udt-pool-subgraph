import { BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import {
  Staked,
  Withdrawn,
  RewardAdded,
  RewardPaid
} from "../generated/Pool/Pool";
import { Pool, Token } from "../generated/schema";
import { exponentToBigDecimal } from "./helpers";

const EIGHTEEN_BI = BigInt.fromI32(18);

export function handleStake(event: Staked): void {
  let pool = Pool.load(event.address.toHex());
  pool.staked = pool.staked.plus(
    event.params.amount.divDecimal(exponentToBigDecimal(EIGHTEEN_BI))
  );
  pool.save();
}

export function handleUnstake(event: Withdrawn): void {
  let pool = Pool.load(event.address.toHex());
  pool.staked = pool.staked.minus(
    event.params.amount.divDecimal(exponentToBigDecimal(EIGHTEEN_BI))
  );
  pool.save();
}

export function handleRewardAdded(event: RewardAdded): void {
  let pool = Pool.load(event.address.toHex());
  let rewardToken = Token.load(pool.rewardToken);
  pool.rewards = pool.rewards.plus(
    event.params.reward.divDecimal(exponentToBigDecimal(rewardToken.decimals))
  );
  pool.save();
}

export function handleHarvest(event: RewardPaid): void {
  let pool = Pool.load(event.address.toHex());
  let rewardToken = Token.load(pool.rewardToken);
  pool.rewards = pool.rewards.minus(
    event.params.reward.divDecimal(exponentToBigDecimal(rewardToken.decimals))
  );
  pool.save();
}
