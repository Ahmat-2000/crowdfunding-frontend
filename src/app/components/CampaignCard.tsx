import React from "react";
import useCampaignData from "../hook/useCampaignData";
import Link from "next/link";

type CampaignCardProps = {
  campaignAddress: string;
};

const CampaignCard = ({ campaignAddress }: CampaignCardProps) => {
  const {
    campaignName,
    campaignDescription,
    progressBar,
    isLoading,
  } = useCampaignData(campaignAddress);

  return (
    <div className="flex flex-col gap-4 bg-gray-50 shadow-lg rounded-md p-3 border border-gray-200 sm:transition-all sm:transform sm:duration-300 sm:hover:scale-105 ">
      {isLoading ? (
        <div className="w-full flex flex-col gap-4 animate-pulse">
          <div className="h-5 bg-gray-300 rounded "/>
          <div className="w-3/4 h-4 bg-gray-300 rounded "/>
          <div className="h-16 bg-gray-300 rounded "/>
          <div className="w-full h-12 bg-gray-300 rounded-md "/>
        </div>
      ) : (
        <>
         <div className="relative w-full bg-gray-200 rounded-full ">
            <span className="absolute inset-0 rounded-full flex items-center justify-center text-xs font-bold text-black">
              {progressBar.toFixed(2)}%
            </span>
            <div
              className="bg-purple-600 h-5 rounded-full"
              style={{ width: `${progressBar}%` }}
            ></div>
          </div>

          <h2 className="text-lg sm:text-md font-semibold">{campaignName}</h2>

          <p className="text-gray-600 text-sm line-clamp-2">
            {campaignDescription}
          </p>
         
          <Link
            href={`/campaign/${campaignAddress}`}
            className="bg-purple-600/90 text-slate-50 mt-auto px-2 py-2 rounded-md shadow-md transition-all duration-700 hover:bg-purple-800 hover:shadow-lg active:scale-95 flex items-center justify-center font-medium text-sm "
          >
            View Campaign →
          </Link>
        </>
      )}
    </div>
  );
};

export default CampaignCard;
