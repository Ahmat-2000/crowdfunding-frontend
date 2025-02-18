import { getContract } from "thirdweb";
import { client } from "../client";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";

const useCampaignData = (campaignAddress: string) => {
  const contract = getContract({
    client: client,
    chain: sepolia,
    address: campaignAddress,
  });

  const { data: campaignName, isLoading: isLoadingName } = useReadContract({
    contract,
    method: "function name() view returns (string)",
    params: [],
  });

  const { data: campaignDescription, isLoading: isLoadingDescription } = useReadContract({
    contract,
    method: "function description() view returns (string)",
    params: [],
  });

  const { data: campaignGoal, isLoading: isLoadingGoal } = useReadContract({
    contract,
    method: "function goal() view returns (uint256)",
    params: [],
  });

  const { data: campaignDeadline, isLoading: isLoadingDeadline } = useReadContract({
    contract,
    method: "function deadline() view returns (uint256)",
    params: [],
  });

  const { data: campaignBalance, isLoading: isLoadingBalance } = useReadContract({
    contract,
    method: "function getContractBalance() view returns (uint256)",
    params: [],
  });

  return {
    campaignName,
    campaignDescription,
    campaignGoal,
    campaignDeadline,
    campaignBalance,
    isLoading: isLoadingName || isLoadingDescription || isLoadingGoal || isLoadingDeadline || isLoadingBalance,
  };
};

export default useCampaignData;
