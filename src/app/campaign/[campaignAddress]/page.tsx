"use client";

import { useParams } from "next/navigation";
import useCampaignData from "@/app/hook/useCampaignData";
import Link from "next/link";
import TierCard from "@/app/components/TierCard";
import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import CreateTierModal from "@/app/components/CreateTierModal";
import { prepareContractCall } from "thirdweb";
import { TransactionButton } from "thirdweb/react";

const CampaignPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [extendDays, setExtendDays] = useState<number>(0);

  const account = useActiveAccount();
  const { campaignAddress } = useParams();
  
  const {
    contract,
    campaignName,
    campaignDescription,
    campaignGoal,
    campaignBalance,
    campaignDeadline,
    campaignState,
    campaignOwner,
    campaignTiers,
    progressBar,
    isLoading,
  } = useCampaignData(campaignAddress as string);

  const isOwner = campaignOwner === account?.address;

  return (
    <div className="py-5 px-2">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">Loading campaign details...</div>
      ) : (
        <div className="flex flex-col gap-4">

          {/* Header */}
          <div className="flex flex-col justify-between xs:flex-row">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{campaignName}</h1>
            {isOwner && (
              <div className="flex">
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-5 py-2 bg-blue-500 font-medium text-gray-100 rounded-md shadow-md hover:bg-purple-800 hover:shadow-lg">
                  {isEditing ? "Done" : "Edit"}
                </button>
              </div>    
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <h2 className="font-bold text-gray-800 ">Description </h2>
            <p className="">{campaignDescription}</p>
          </div>

          {/* Deadline */}
          <div className="flex flex-col ">
            <h2 className="font-bold text-gray-800">Deadline </h2>
            <p className="">{campaignDeadline}</p>
          </div>

          {/* ProgressBar */}
          <div className="">
            <div className="relative w-full bg-gray-300 rounded-lg h-6">
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black">
                {progressBar.toFixed(2)}%
              </span>
              <div
                className="bg-purple-600 h-6 rounded-lg "
                style={{ width: `${progressBar}%` }}
              />
            </div>
          </div>

          {/* Campaign Information */}
          <div className="px-2 py-5 gap-y-5 flex flex-col sm:flex-row sm:flex-wrap sm:justify-between bg-gray-100 rounded-lg shadow-md">
            <div className="sm:w-1/2 font-semibold">Goal : {campaignGoal} $</div>

            <div className="sm:w-1/2 font-semibold">
              Raised : {campaignBalance} $
            </div>

            <div className="sm:w-1/2 font-semibold">
              State : 
              {campaignState !== undefined && (
                <span className={`${campaignState === 0 ? 'text-blue-600' : campaignState === 1 ? 'text-green-600' : 'text-red-600'} font-semibold ml-1`}>
                  {["Active", "Successful", "Failed"][campaignState]}
                </span>)
              }
            </div>
            
            <div className="sm:w-1/2 font-medium ">Owner : {campaignOwner &&`${campaignOwner.slice(0,5)}...${campaignOwner.slice(campaignOwner.length - 5)}`}</div>

          </div>

          {/* Funding Tiers */}
          <h2 className="text-xl font-semibold mt-6 mb-2">Funding Tiers</h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {campaignTiers?.length && campaignTiers?.length > 0 ? (
              campaignTiers.map((tier, index) => (
                <TierCard key={index} index={index} tier={tier} contract={contract} isEditing={isEditing} />
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">No tiers available.</p>
            )}
          </div>

          {/* Owner Actions */}
          {isOwner && (
            <div className="flex flex-col gap-4">
              <TransactionButton
                transaction={() => prepareContractCall({ contract, method: "function withdraw()" })}
                onTransactionConfirmed={() => alert("Funds Withdrawn!")}
                className="px-5 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700">
                Withdraw Funds
              </TransactionButton>

              <TransactionButton
                transaction={() => prepareContractCall({ contract, method: "function togglePause()" })}
                onTransactionConfirmed={() => alert("Campaign Paused/Resumed!")}
                className="px-5 py-2 bg-yellow-600 text-white rounded-md shadow-md hover:bg-yellow-700">
                {campaignState === 0 ? "Pause Campaign" : "Resume Campaign"}
              </TransactionButton>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Days to extend"
                  value={extendDays}
                  onChange={(e) => setExtendDays(parseInt(e.target.value))}
                  className="px-3 py-2 border rounded-md w-20"
                />
                <TransactionButton
                  transaction={() => prepareContractCall({ contract, method: "function extendDeadline(uint256)", params: [BigInt(extendDays)] })}
                  onTransactionConfirmed={() => alert("Deadline Extended!")}
                  className="px-5 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-700">
                  Extend Deadline
                </TransactionButton>
              </div>
            </div>
          )}

          {/* Refund Option */}
          {campaignState === 2 && (
            <TransactionButton
              transaction={() => prepareContractCall({ contract, method: "function refund()" })}
              onTransactionConfirmed={() => alert("Refund Processed!")}
              className="px-5 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700">
              Claim Refund
            </TransactionButton>
          )}

          {/* Add Tier */}
          {isEditing && (
            <div className="flex">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2 bg-blue-500 font-medium text-gray-100 rounded-md">
                + Add Tier
              </button>
            </div>    
          )}

          {isModalOpen && (
            <CreateTierModal contract={contract} setIsModalOpen={setIsModalOpen} />
          )}

          {/* Back to Campaigns */}
          <Link
            href="/"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-500 hover:bg-gray-800 hover:shadow-lg active:scale-95 text-center mt-4 w-max sm:mx-0"
          >
            ← Back to Campaigns
          </Link>
        </div>
      )}
    </div>
  );
};

export default CampaignPage;
