"use client";
import { useState } from "react";
import { prepareContractCall, ThirdwebContract } from "thirdweb";

import { TransactionButton } from "thirdweb/react";
import { useFeedback } from "../context/feadback";

export type Tier = {
  name: string;
  amount: bigint;
  backers: bigint;
};

type TierCardProps = {
  tier: Tier;
  index: number;
  contract: ThirdwebContract;
  isEditing: boolean;
};

export default function TierCard({ tier, index,contract,isEditing}: TierCardProps) {
  const { setFeedback } = useFeedback();
  return (
    <div className="flex flex-col gap-2 border border-gray-200 rounded-md p-4 bg-slate-50 shadow-md transition-transform transform-all hover:scale-105 duration-500">

      <h3 className="text-xl font-bold mb-2 text-gray-800">{tier.name}</h3>

      <p className="text-sm text-gray-600 font-semibold">
        Amount : {tier.amount.toString()} $
      </p>
      <p className="text-sm text-gray-500 font-semibold">
        Backers :  {tier.backers.toString()}
      </p>

      <TransactionButton 
        transaction = {() => prepareContractCall({
          contract,
          method: "function fund(uint256 _tierIndex) payable",
          params: [BigInt(index)],
          value: tier.amount
        })} 
        onTransactionConfirmed={async () => {
          setFeedback({message: "Funded successfully!", type: "success"})
        }}
        onError={(err) => {
          setFeedback({message: err.message, type: "error"})
        }}
        unstyled
        className="mt-auto w-full bg-blue-500 text-gray-100 font-medium px-4 py-2 rounded-md shadow-md  hover:bg-purple-800 hover:shadow-lg"
      >
        Select Tier
      </TransactionButton>
      {isEditing && (
        <TransactionButton 
          transaction={ () => prepareContractCall({
            contract,
            method: "function removeTier(uint256 _index)",
            params: [BigInt(index)],
          })}
          onTransactionConfirmed={async () => {
            setFeedback({message: "Removed successfully!", type: "success"})
          }}
          onError={(err) => {
            setFeedback({message: err.message, type: "error"})
          }}
          unstyled
          className="w-full bg-red-500 text-gray-100 font-medium px-4 py-2 rounded-md shadow-md  hover:bg-purple-800 hover:shadow-lg"
        >
          Remove
        </TransactionButton>
      )}
    </div>
  );
}
