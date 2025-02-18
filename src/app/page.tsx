"use client";

import { getContract } from "thirdweb";
import { client } from "./client";
import { sepolia } from "thirdweb/chains";
// import { CROWDFUNDING_FACTORY_ADDRESS } from "./constant/contracts";
import { useReadContract } from "thirdweb/react";
import CampaignCard from "./components/CampaignCard";

export default function Home() {
  const contract = getContract({
    client: client,
    chain: sepolia,
    address: process.env.NEXT_PUBLIC_TEMPLATE_CROWDFUNDING_FACTORY_ADDRESS as string,
  });

  const { data: campaigns, isLoading } = useReadContract({
    contract,
    method:
      "function getAllCampaigns() view returns ((address owner, address campaignAddress, string name, uint256 creationTime)[])",
    params: [],
  });

  return (
    <div className="mt-5 px-4">
      <h1 className="text-4xl font-bold text-center mb-6">Campaigns</h1>

      {/* Loading State */}
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
            <p className="text-center text-lg text-gray-500">
              No campaigns found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
