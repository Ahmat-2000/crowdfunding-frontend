"use client";

import { useParams } from "next/navigation";
import useCampaignData from "@/app/hook/useCampaignData";
import Link from "next/link";
import TierCard from "@/app/components/TierCard";
import { useEffect, useState } from "react";
import { useActiveAccount, TransactionButton } from "thirdweb/react";
import CreateTierModal from "@/app/components/CreateTierModal";
import { prepareContractCall } from "thirdweb";
import { useFeedback } from "@/app/context/feadback";

const CampaignPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [extendDays, setExtendDays] = useState<number>(0);
  const {setFeedback } = useFeedback();
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
    paused,
  } = useCampaignData(campaignAddress as string);

  const isOwner = campaignOwner === account?.address;
  const isCampaignSuccessful = campaignState === 1;
  const isCampaignActive = campaignState === 0;
  const isCampaignFailed= campaignState === 2;
  useEffect(() => {
    alert(`campaignOwner: ${campaignOwner} \naccount.address: ${account?.address}`);
  }, [campaignOwner, account]);
  
  return (
    <div className="py-5 px-2">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">Loading campaign details...</div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
            <h1 className="text-3xl font-bold text-gray-800">{campaignName}</h1>
            {isOwner && (
              <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
                <button
                  disabled={isCampaignSuccessful}
                  onClick={() => setIsEditing(!isEditing)}
                  className={getButtonClasses(isCampaignSuccessful, "bg-blue-500 hover:bg-blue-700")}
                >
                  {isEditing ? "Done Editing" : "Edit Tiers"}
                </button>

                <TransactionButton
                  disabled={isCampaignSuccessful || isCampaignFailed}
                  unstyled
                  transaction={() => prepareContractCall({ contract, method: "function togglePause()" })}
                  onTransactionConfirmed={() => setFeedback({ message: `Campaign ${paused ? "paused" : "unpaused"}`, type: "info" })}
                  onError={(error) => setFeedback({ message: error.message, type: "error" })}
                  className={getButtonClasses(isCampaignSuccessful || isCampaignFailed, "bg-yellow-600 hover:bg-yellow-700")}
                >
                  {paused ? "Unpause" : "Pause"}
                </TransactionButton>

                <TransactionButton
                  unstyled
                  disabled={!isCampaignSuccessful || Number(campaignBalance) === 0}
                  transaction={() =>
                    prepareContractCall({ contract, method: "function withdraw()" })
                  }
                  onTransactionConfirmed={() => {
                    setFeedback({
                      message: "Funds Successfully Withdrawn!",
                      type: "success",
                    });
                  }}
                  onError={(error) =>
                    setFeedback({ message: error.message, type: "error" })
                  }
                  className={getButtonClasses(
                    !isCampaignSuccessful || Number(campaignBalance) === 0,
                    "bg-blue-500 hover:bg-blue-700"
                  )}
                >
                  Withdraw
                </TransactionButton>

              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="font-bold text-gray-800">Description</h2>
            <p>{campaignDescription}</p>
          </div>

          {/* Deadline */}
          <div>
            <h2 className="font-bold text-gray-800">Deadline</h2>
            <p>{campaignDeadline}</p>
          </div>

          {/* Extend Deadline */}
          {isOwner && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={extendDays}
                onChange={(e) => setExtendDays(parseInt(e.target.value))}
                className="px-3 py-2 border rounded-md w-20"
              />
             <TransactionButton
                unstyled
                disabled={isCampaignSuccessful}
                transaction={() => prepareContractCall({ contract, method: "function extendDeadline(uint256)", params: [BigInt(extendDays)] })}
                onTransactionConfirmed={() => setFeedback({ message: "Deadline Extended!", type: "success" })}
                onError={() => setFeedback({ message: "Error extending deadline!", type: "error" })}
                className={getButtonClasses(isCampaignSuccessful, "bg-blue-500 hover:bg-blue-700")}
              >
                Extend Deadline
              </TransactionButton>

            </div>
          )}

          {/*  ProgressBar */}
          <div className="relative w-full bg-gray-300 rounded-lg h-6">
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black">
              {progressBar.toFixed(2)}%
            </span>
            <div className="bg-purple-600 h-6 rounded-lg" style={{ width: `${progressBar}%` }} />
          </div>
          
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-100 rounded-lg shadow-md">

            <div className="font-semibold">🎯 Goal : 
              <span className="font-medium"> {campaignGoal} $</span>
            </div>

            <div className="font-semibold">💰 Raised : 
              <span className="font-medium"> {isCampaignSuccessful ? campaignGoal : campaignBalance} $</span>
            </div>
            
            <div className="font-semibold">📝 State : 
            {campaignState !== undefined && (
              <span className={`${isCampaignActive? 'text-blue-600' : isCampaignSuccessful ? 'text-green-600' : 'text-red-600'} font-semibold ml-1`}>
                {["Active", "Successful", "Failed"][campaignState]}
              </span>)
            }
            </div>

            <div className="font-semibold">⏸️ Paused : 
              <span className={`font-bold ${paused ? "text-yellow-600" : "text-green-600"}`}> {paused ? "Yes" : "No"}</span>
            </div>

            <div className="font-semibold">👤 Owner : 
              {campaignOwner && ` ${campaignOwner.slice(0,5)}...${campaignOwner.slice(-5)}`}
            </div>

            <div className="font-semibold">💸 Withdrawn :  
              {campaignBalance !== undefined && (
                <span className={`font-bold ${Number(campaignBalance) === 0 ? "text-green-600" : "text-red-600"}`}> {Number(campaignBalance) === 0 ? "Yes" : "No"}</span>
              )}
            </div>

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

          {isOwner && isCampaignActive && isEditing && (
            <div className="flex justify-start mt-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2 bg-blue-500 font-medium text-gray-100 rounded-md shadow-md hover:bg-blue-700 w-auto"
              >
                + Add Tier
              </button>
            </div>
          )}

          {isModalOpen && <CreateTierModal contract={contract} setIsModalOpen={setIsModalOpen} />}

          <Link href="/" className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition-all hover:bg-gray-800 hover:shadow-lg text-center mt-4 w-max">
            ← Back to Campaigns
          </Link>
        </div>
      )}
    </div>
  );
};

export default CampaignPage;


const getButtonClasses = (isDisabled: boolean, activeColor: string) => {
  return `px-3 py-2 rounded-md shadow-md transition-all text-center font-medium 
    ${isDisabled
      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
      : `${activeColor} text-white hover:shadow-lg cursor-pointer`
    }`;
};
