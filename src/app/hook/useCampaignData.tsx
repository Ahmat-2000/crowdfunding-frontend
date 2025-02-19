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

  const { data: deadline, isLoading: isLoadingDeadline } = useReadContract({
    contract,
    method: "function deadline() view returns (uint256)",
    params: [],
  });

  const { data: campaignBalance, isLoading: isLoadingBalance } = useReadContract({
    contract,
    method: "function getContractBalance() view returns (uint256)",
    params: [],
  });

  const { data: campaignTiers , isLoading: isLoadingTiers } = useReadContract({
    contract,
    method:
      "function getTiers() view returns ((string name, uint256 amount, uint256 backers)[])",
    params: [],
  });

  const { data: campaignOwner, isLoading: isLoadingOwner } = useReadContract({
    contract,
    method: "function owner() view returns (address)",
    params: [],
  });

  const { data: campaignState, isLoading: isLoadingState } = useReadContract({
    contract,
    method: "function state() view returns (uint8)",
    params: [],
  });
  const { data: paused, isLoading: isLoadingPaused } = useReadContract({
    contract,
    method: "function paused() view returns (bool)",
    params: [],
  });
  const progressBar = campaignGoal && campaignBalance
  ? Math.min((Number(campaignBalance) / Number(campaignGoal)) * 100, 100)
  : 0;

  const campaignDeadline = deadline && new Date(Number(deadline) * 1000).toUTCString();
  
  return {
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
    paused,
    isLoading: isLoadingName || isLoadingDescription || isLoadingGoal || isLoadingDeadline || isLoadingBalance || isLoadingTiers || isLoadingOwner || isLoadingState || isLoadingPaused,
  };
};

export default useCampaignData;
