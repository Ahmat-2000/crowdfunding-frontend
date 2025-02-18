import { useState } from "react";
import { ThirdwebContract, prepareContractCall } from "thirdweb";
import { TransactionButton } from "thirdweb/react";

type CreateTierModalProps = {
  setIsModalOpen: (value: boolean) => void;
  contract: ThirdwebContract;
};

const CreateTierModal = ({ setIsModalOpen, contract }: CreateTierModalProps) => {
  const [tierName, setTierName] = useState("");
  const [tierAmount, setTierAmount] = useState<bigint>(1n);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold text-gray-800">Create a Funding Tier</p>
          <button 
            onClick={() => setIsModalOpen(false)}
            className="text-sm px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
          >
            ✖ Close
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Tier Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">Tier Name</label>
            <input
              type="text"
              value={tierName}
              onChange={(e) => setTierName(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Enter tier name"
            />
          </div>

          {/* Tier Amount */}
          <div>
            <label className="text-sm font-medium text-gray-700">Tier Amount (Gwei)</label>
            <input
              type="number"
              value={tierAmount.toString()}
              onChange={(e) => setTierAmount(BigInt(e.target.value))}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Enter amount in Gwei"
              min="1"
            />
          </div>

          {/* Create Tier Button */}
          <TransactionButton
            unstyled
            transaction={() =>
              prepareContractCall({
                contract,
                method: "function addTier(string,uint256)",
                params: [tierName, tierAmount],
              })
            }
            onTransactionConfirmed={() => {
              setIsModalOpen(false);
              alert("Tier Created Successfully!");
            }}
            onError={(error) => {
              alert(`Transaction Failed: ${error.message}`)
            }}
            className="w-full bg-purple-600 text-white py-2 rounded-md font-medium shadow-md hover:bg-purple-800 transition-all"
          >
            Create Tier
          </TransactionButton>
        </div>
      </div>
    </div>
  );
};

export default CreateTierModal;
