'use client';
import { useState } from 'react';
import { client } from '@/app/client';
import CampaignCard from '@/app/components/CampaignCard';
import CreateCampaignModal from '@/app/components/CreateCampaignModal';
import { CROWDFUNDING_FACTORY_ADDRESS } from '@/app/constant/contracts';
import React from 'react';
import { getContract } from 'thirdweb';
import { sepolia } from 'thirdweb/chains';
import { useActiveAccount, useReadContract } from 'thirdweb/react';
import Link from 'next/link';

function DashboardPage() {
  const account = useActiveAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const contract = getContract({
    client: client,
    chain: sepolia,
    address: CROWDFUNDING_FACTORY_ADDRESS,
  });

  const { data: campaigns, isLoading } = useReadContract({
    contract,
    method:
      "function getUserCampaigns(address _user) view returns ((address owner, address campaignAddress, string name, uint256 creationTime)[])",
    params: [account?.address as string],
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Campaigns</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-300 hover:bg-purple-800 hover:shadow-lg active:scale-95"
        >
          + Create Campaign
        </button>
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
      {isModalOpen && <CreateCampaignModal setIsModalOpen={setIsModalOpen} contract={contract} />}
    </div>
  );
}

export default DashboardPage;
