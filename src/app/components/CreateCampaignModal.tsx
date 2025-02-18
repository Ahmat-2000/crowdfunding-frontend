'use client';
import { useState } from "react";
import { ThirdwebContract, prepareContractCall } from "thirdweb";
import { deployPublishedContract } from "thirdweb/deploys";
import { TransactionButton, useActiveAccount } from "thirdweb/react";
import { client } from "../client";
import { sepolia } from "thirdweb/chains";

type CreateCampaignModalProps = {
  setIsModalOpen: (value: boolean) => void;
  contract: ThirdwebContract;
};

const CreateCampaignModal = ({ setIsModalOpen, contract }: CreateCampaignModalProps) => {
  const account = useActiveAccount();
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [campaignGoal, setCampaignGoal] = useState<bigint>(1n);
  const [campaignDuration, setCampaignDuration] = useState(30);
  const [isDeployingContract, setIsDeployingContract] = useState(false);

  const handleDeplyoContract = async () => {
    try {
      const contractAddress = await deployPublishedContract({
        client: client,
        chain: sepolia,
        account: account!,
        contractId: "",
        contractParams: [
          campaignName,
          campaignDescription,
          campaignGoal,
          campaignDuration
        ],
        publisher: process.env.NEXT_PUBLIC_TEMPLATE_PUBLISHER_CONTRACT_ADDRESS,
        version: process.env.NEXT_PUBLIC_TEMPLATE_PUBLISHER_CONTRACT_VERSION,
      });      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold text-gray-800">Create a Campaign</p>
          <button 
            onClick={() => setIsModalOpen(false)}
            className="text-sm px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
          >
            ✖ Close
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Campaign Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">Campaign Name</label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Enter campaign name"
            />
          </div>

          {/* Campaign Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={campaignDescription}
              onChange={(e) => setCampaignDescription(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Enter description"
            />
          </div>

          {/* Campaign Goal */}
          <div>
            <label className="text-sm font-medium text-gray-700">Goal Amount (Gwei | $)</label>
            <input
              type="number"
              value={campaignGoal.toString()}
              onChange={(e) => setCampaignGoal(BigInt(e.target.value))}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Enter amount in Gwei"
              min="1"
            />
          </div>

          {/* Campaign Duration */}
          <div>
            <label className="text-sm font-medium text-gray-700">Duration (Days)</label>
            <input
              type="number"
              value={campaignDuration}
              onChange={(e) => setCampaignDuration(parseInt(e.target.value))}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
              min="1"
            />
          </div>

          {/* Create Campaign Button */}
          <TransactionButton
            unstyled
            transaction={() =>
              prepareContractCall({
                contract,
                method: "function createCampaign(string,string,uint256,uint256)",
                params: [campaignName, campaignDescription, campaignGoal, BigInt(campaignDuration)],
              })
            }
            onTransactionConfirmed={() => {
              setIsModalOpen(false);
              alert("Campaign Created Successfully!");
            }}
            onError={(error) => {
              alert(`Transaction Failed: ${error.message}`)
            }}
            className="w-full bg-purple-600 text-white py-2 rounded-md font-medium shadow-md hover:bg-purple-800 transition-all"
          >
            Create Campaign
          </TransactionButton>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignModal;
