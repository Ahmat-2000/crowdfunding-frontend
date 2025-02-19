'use client';
import { useState } from "react";
import { ThirdwebContract } from "thirdweb";
import { deployPublishedContract } from "thirdweb/deploys";
import { useActiveAccount } from "thirdweb/react";
import { client } from "../client";
import { sepolia } from "thirdweb/chains";
import { useFeedback } from "../context/feadback";

type CreateCampaignModalProps = {
  setIsModalOpen: (value: boolean) => void;
  setIsCreated: (value: boolean) => void;
  contract: ThirdwebContract;
};

const CreateCampaignModal = ({ setIsModalOpen, contract , setIsCreated}: CreateCampaignModalProps) => {
  const account = useActiveAccount();
  const [campaignName, setCampaignName] = useState<string>("");
  const [campaignDescription, setCampaignDescription] = useState<string>("");
  const [campaignGoal, setCampaignGoal] = useState<bigint>(1n);
  const [campaignDuration, setCampaignDuration] = useState<number>(30);
  const [isDeployingContract, setIsDeployingContract] = useState(false);
  const {setFeedback} = useFeedback();
  const [errors, setErrors] = useState({
    campaignName: "",
    campaignDescription: "",
    campaignGoal: "",
    campaignDuration: ""
  });

  const validateFields = () => {
    let newErrors = { campaignName: "", campaignDescription: "", campaignGoal: "", campaignDuration: "" };
    let isValid = true;

    if (!campaignName.trim()) {
      newErrors.campaignName = "Campaign name is required.";
      isValid = false;
    }

    if (!campaignDescription.trim()) {
      newErrors.campaignDescription = "Description is required.";
      isValid = false;
    }

    if (!campaignGoal || campaignGoal <= 0n) {
      newErrors.campaignGoal = "Goal must be greater than 0.";
      isValid = false;
    }

    if (!campaignDuration || campaignDuration <= 0) {
      newErrors.campaignDuration = "Duration must be at least 1 day.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleDeployContract = async () => {
    if (!validateFields()) return; 
    setIsDeployingContract(true);
    try {
      const contractAddress = await deployPublishedContract({
        client: client,
        chain: sepolia,
        account: account!,
        contractId: "CrowdFunding",
        contractParams: {
          _name: campaignName, 
          _description: campaignDescription,
          _goal: campaignGoal,
          _durationInDays: BigInt(campaignDuration),
        },
        publisher: process.env.NEXT_PUBLIC_TEMPLATE_PUBLISHER_CONTRACT_ADDRESS as string,
        version: process.env.NEXT_PUBLIC_TEMPLATE_PUBLISHER_CONTRACT_VERSION as string,
      });
      setFeedback({message:`Campaign created successfully at ${contractAddress}`, type: "success"});
      setIsModalOpen(false);
      setIsCreated(true); 
  
    } catch (error) {
      console.log(error);
      setFeedback({message: `Transaction Failed: ${error}` , type: "error"});
    } finally {
      setIsDeployingContract(false);
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
              className={`w-full mt-1 px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-purple-500 ${errors.campaignName ? "border-red-500" : ""}`}
              placeholder="Enter campaign name"
            />
            {errors.campaignName && <p className="text-sm text-red-500">{errors.campaignName}</p>}
          </div>

          {/* Campaign Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={campaignDescription}
              onChange={(e) => setCampaignDescription(e.target.value)}
              className={`w-full mt-1 px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-purple-500 ${errors.campaignDescription ? "border-red-500" : ""}`}
              placeholder="Enter description"
            />
            {errors.campaignDescription && <p className="text-sm text-red-500">{errors.campaignDescription}</p>}
          </div>

          {/* Campaign Goal */}
          <div>
            <label className="text-sm font-medium text-gray-700">Goal Amount (Gwei | $)</label>
            <input
              type="number"
              value={campaignGoal.toString()}
              onChange={(e) => {
                const value = e.target.value.trim();
                setCampaignGoal(value === "" || isNaN(Number(value)) ? 1n : BigInt(value));
              }}
              className={`w-full mt-1 px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-purple-500 ${errors.campaignGoal ? "border-red-500" : ""}`}
              placeholder="Enter amount in Gwei"
              min="1"
            />
            {errors.campaignGoal && <p className="text-sm text-red-500">{errors.campaignGoal}</p>}
          </div>

          {/* Campaign Duration */}
          <div>
            <label className="text-sm font-medium text-gray-700">Duration (Days)</label>
            <input
              type="number"
              value={campaignDuration}
              onChange={(e) => {
                const value = e.target.value.trim();
                setCampaignDuration(value === "" || isNaN(Number(value)) ? 1 : parseInt(value));
              }}
              className={`w-full mt-1 px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-purple-500 ${errors.campaignDuration ? "border-red-500" : ""}`}
              min="1"
            />
            {errors.campaignDuration && <p className="text-sm text-red-500">{errors.campaignDuration}</p>}
          </div>

          {/* Create Campaign Button */}
          <button
            disabled={isDeployingContract}
            onClick={handleDeployContract}
            className={`w-full p-3 rounded-md font-medium shadow-md transition-all ${
              isDeployingContract ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 text-white hover:bg-purple-800"
            }`}
          >
            {isDeployingContract ? "Deploying..." : "Create Campaign"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignModal;
