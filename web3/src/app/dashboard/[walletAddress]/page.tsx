"use client";
import { client } from "@/app/client";
import { CROWDFUNDING_FACTORY } from "@/app/constants/contract";
import { MyCampaignCard } from "@/app/components/MyCampaignCard";
import { useEffect, useState } from "react";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { deployPublishedContract } from "thirdweb/deploys";
import { useActiveAccount, useReadContract } from "thirdweb/react";

export default function DashboardPage() {
  const account = useActiveAccount();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const contract = getContract({
    client: client,
    chain: sepolia,
    address: CROWDFUNDING_FACTORY,
  });

  // Get Campaigns
  const {
    data: myCampaigns,
    isLoading: isLoadingMyCampaigns,
    refetch,
  } = useReadContract({
    contract: contract,
    method:
      "function getUserCampaigns(address _user) view returns ((address campaignAddress, address owner, string name, uint256 creationTime)[])",
    params: [account?.address as string],
  });

  return (
    <div className="mx-auto max-w-7xl px-4 mt-16 sm:px-6 lg:px-8">
      <div className="flex flex-row justify-between items-center mb-8">
        <p className="text-4xl font-semibold">Dashboard</p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => setIsModalOpen(true)}
        >
          Create Campaign
        </button>
      </div>
      <p className="text-2xl font-semibold mb-4">My Campaigns:</p>
      <div className="grid grid-cols-3 gap-4">
        {!isLoadingMyCampaigns &&
          (myCampaigns && myCampaigns.length > 0 ? (
            myCampaigns.map((campaign, index) => (
              <MyCampaignCard
                key={index}
                contractAddress={campaign.campaignAddress}
              />
            ))
          ) : (
            <p>No campaigns</p>
          ))}
      </div>

      {isModalOpen && (
        <CreateCampaignModal
          setIsModalOpen={setIsModalOpen}
          refetch={refetch}
        />
      )}
    </div>
  );
}

type CreateCampaignModalProps = {
  setIsModalOpen: (value: boolean) => void;
  refetch: () => void;
};

const CreateCampaignModal = ({
  setIsModalOpen,
  refetch,
}: CreateCampaignModalProps) => {
  const account = useActiveAccount();
  const [isDeployingContract, setIsDeployingContract] =
    useState<boolean>(false);
  const [campaignName, setCampaignName] = useState<string>("");
  const [campaignDescription, setCampaignDescription] = useState<string>("");
  const [campaignGoal, setCampaignGoal] = useState<number>(1);
  const [campaignDeadline, setCampaignDeadline] = useState<number>(1);

  // Deploy contract from CrowdfundingFactory
  const handleDeployContract = async () => {
    setIsDeployingContract(true);
    try {
      console.log("Deploying contract...");
      const contractAddress = await deployPublishedContract({
        client: client,
        chain: sepolia,
        account: account!,
        contractId: "Crowdfunding",
        contractParams: {
          _name: campaignName,
          _description: campaignDescription,
          _goal: campaignGoal,
          _durationInDays: campaignDeadline,
        },
        publisher: "0x0E9BBA9D7b753E91Bca6dE213457F520a8D61047",
        version: "1.0.0",
      });
      alert("Contract deployed successfully!");
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeployingContract(false);
      setIsModalOpen(false);
      refetch;
    }
  };

  const handleCampaignGoal = (value: number) => {
    if (value < 1) {
      setCampaignGoal(1);
    } else {
      setCampaignGoal(value);
    }
  };

  const handleCampaignLengthhange = (value: number) => {
    if (value < 1) {
      setCampaignDeadline(1);
    } else {
      setCampaignDeadline(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800 bg-opacity-90 flex justify-center items-center backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Create a Campaign
          </h2>
          <button
            className="text-gray-400 hover:text-gray-600 transition duration-200"
            onClick={() => setIsModalOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col space-y-5">
          <label className="text-gray-700 font-medium">Campaign Name:</label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="Enter a catchy campaign name"
            className="mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
          />
          <label className="text-gray-700 font-medium">
            Campaign Description:
          </label>
          <textarea
            value={campaignDescription}
            onChange={(e) => setCampaignDescription(e.target.value)}
            placeholder="Briefly describe your campaign"
            className="mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
          ></textarea>
          <label className="text-gray-700 font-medium">Campaign Goal:</label>
          <input
            type="number"
            value={campaignGoal}
            onChange={(e) => handleCampaignGoal(parseInt(e.target.value))}
            className="mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
          />
          <label className="text-gray-700 font-medium">{`Campaign Length (Days)`}</label>
          <div className="flex space-x-4">
            <input
              type="number"
              value={campaignDeadline}
              onChange={(e) =>
                handleCampaignLengthhange(parseInt(e.target.value))
              }
              className="mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
            />
          </div>

          <button
            className="mt-6 w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-300"
            onClick={handleDeployContract}
          >
            {isDeployingContract ? (
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span>Creating Campaign...</span>
              </div>
            ) : (
              "Create Campaign"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
