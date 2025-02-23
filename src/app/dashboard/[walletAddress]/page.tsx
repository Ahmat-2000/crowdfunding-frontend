'use client';
import { useState, useEffect } from 'react';
import { client } from '@/app/client';
import CampaignCard from '@/app/components/CampaignCard';
import CreateCampaignModal from '@/app/components/CreateCampaignModal';
import React from 'react';
import { getContract } from 'thirdweb';
import { sepolia } from 'thirdweb/chains';
import { useActiveAccount, useReadContract } from 'thirdweb/react';

function DashboardPage() {
  const account = useActiveAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  
  const contract = getContract({
    client: client,
    chain: sepolia,
    address: process.env.NEXT_PUBLIC_TEMPLATE_CROWDFUNDING_FACTORY_ADDRESS as string,
  });

  const { data: campaigns, isLoading, refetch } = useReadContract({
    contract,
    method:
      "function getUserCampaigns(address _user) view returns ((address owner, address campaignAddress, string name, uint256 creationTime)[])",
    params: [account?.address as string],
  });

  useEffect(() => {
    if (isCreated) {
      refetch();
      setIsCreated(false); 
    }
  }, [isCreated, refetch]);

  return (
    <div className="px-4 py-6">
      {/* Dashboard Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Campaigns</h1>
        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 font-semibold text-white text-lg px-5 py-2 rounded-md shadow-md transition-all duration-300 hover:bg-purple-800 hover:shadow-lg active:scale-95 flex gap-1 justify-center items-center w-full sm:w-auto"
          >
            <span className='font-bold text-xl'>+</span> 
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {campaigns?.length && campaigns?.length > 0 ? (
              campaigns.map((campaign, index) => (
                <CampaignCard key={index} campaignAddress={campaign.campaignAddress} />
              ))
            ) : (
              <p className="col-span-full text-center text-lg text-gray-500">
                No campaigns found. <br /> 
                <span
                  className="text-purple-600 hover:underline cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  Create one now!
                </span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Create Campaign Modal */}
      {isModalOpen && (
        <CreateCampaignModal 
          setIsModalOpen={setIsModalOpen} 
          contract={contract} 
          setIsCreated={setIsCreated} 
        />
      )}
    </div>
  );
}

export default DashboardPage;
