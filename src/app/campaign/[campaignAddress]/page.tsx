"use client";

import { useParams } from "next/navigation";
import useCampaignData from "@/app/hook/useCampaignData";
import Link from "next/link";
import TierCard from "@/app/components/TierCard";
import { useState } from "react";
import { useActiveAccount, TransactionButton } from "thirdweb/react";
import CreateTierModal from "@/app/components/CreateTierModal";
import { prepareContractCall } from "thirdweb";

const CampaignPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [extendDays, setExtendDays] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [hasWithdrawn, setHasWithdrawn] = useState(false);

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
  const isCampaignFailed = campaignState === 2;
  const isCampaignActive = campaignState === 0;

  return (
    <div className="py-5 px-2">
      {/* ✅ Feedback Message */}
      {feedback && (
        <div className={`mb-4 p-4 rounded-lg shadow-md text-center font-semibold text-white 
          ${feedback.includes("success") ? "bg-green-600" : feedback.includes("error") ? "bg-red-600" : "bg-blue-600"}`}>
          {feedback}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-40">Loading campaign details...</div>
      ) : (
        <div className="flex flex-col gap-6">
          
          {/* ✅ Header avec les actions */}
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
            <h1 className="text-3xl font-bold text-gray-800">{campaignName}</h1>

            {/* Boutons d'action pour le propriétaire */}
            {isOwner && isCampaignActive && (
              <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md shadow-md hover:bg-blue-700">
                  {isEditing ? "Done" : "Edit"}
                </button>

                <TransactionButton
                  transaction={() => prepareContractCall({ contract, method: "function togglePause()" })}
                  onTransactionConfirmed={() => setFeedback("Campaign Paused/Resumed!")}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md shadow-md hover:bg-yellow-700">
                  {paused ? "Resume" : "Pause"}
                </TransactionButton>
              </div>
            )}
          </div>

          {/* ✅ Description */}
          <div>
            <h2 className="font-bold text-gray-800">Description</h2>
            <p className="">{campaignDescription}</p>
          </div>

          {/* ✅ Deadline */}
          <div>
            <h2 className="font-bold text-gray-800">Deadline</h2>
            <p className="">{campaignDeadline}</p>
          </div>

          {/* ✅ Extend Deadline (Moved Here) */}
          {isOwner && isCampaignActive && (
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
                onTransactionConfirmed={() => setFeedback("Deadline Extended!")}
                className="px-5 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-700">
                Extend Deadline
              </TransactionButton>
            </div>
          )}

          {/* ✅ ProgressBar */}
          <div className="relative w-full bg-gray-300 rounded-lg h-6">
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black">
              {progressBar.toFixed(2)}%
            </span>
            <div className="bg-purple-600 h-6 rounded-lg" style={{ width: `${progressBar}%` }} />
          </div>

          {/* ✅ Campaign Information (Including Withdraw Status) */}
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-100 rounded-lg shadow-md">
            <div className="font-semibold">🎯 Goal: <span className="font-medium">{campaignGoal} Gwei</span></div>
            <div className="font-semibold">💰 Raised: <span className="font-medium">{campaignBalance} Gwei</span></div>
            <div className="font-semibold">📝 State: 
            {campaignState !== undefined && (
                <span className={`${campaignState === 0 ? 'text-blue-600' : campaignState === 1 ? 'text-green-600' : 'text-red-600'} font-semibold ml-1`}>
                  {["Active", "Successful", "Failed"][campaignState]}
                </span>)
              }
            </div>
            <div className="font-semibold">⏸️ Paused: <span className={`font-bold ${paused ? "text-yellow-600" : "text-green-600"}`}>{paused ? "Yes" : "No"}</span></div>
            <div className="font-semibold">👤 Owner: {campaignOwner && `${campaignOwner.slice(0,5)}...${campaignOwner.slice(-5)}`}</div>
            <div className="font-semibold">💸 Withdrawn: <span className={`font-bold ${hasWithdrawn ? "text-green-600" : "text-red-600"}`}>{hasWithdrawn ? "Yes" : "No"}</span></div>
          </div>

          {/* ✅ Funding Tiers */}
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

          {/* ✅ Bouton d'ajout de Tier (s'affiche uniquement en mode édition) */}
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


          {/* ✅ Modal de création de Tier */}
          {isModalOpen && <CreateTierModal contract={contract} setIsModalOpen={setIsModalOpen} />}

          {/* ✅ Back to Campaigns */}
          <Link href="/" className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition-all hover:bg-gray-800 hover:shadow-lg text-center mt-4 w-max">
            ← Back to Campaigns
          </Link>
        </div>
      )}
    </div>
  );
};

export default CampaignPage;
