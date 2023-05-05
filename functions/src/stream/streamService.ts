import Moralis from "moralis";
import { EvmChain } from "moralis/common-evm-utils";
import { AbiItem } from "web3-utils";

interface StreamTriggerOptions {
  type: "tx" | "log" | "erc20transfer" | "erc20approval" | "nfttransfer";
  contractAddress: string;
  functionAbi: AbiItem;
  inputs?: (string | string[])[];
  topic0?: string;
  callFrom?: string;
}

interface StreamOptions {
  networkType: "evm";
  webhookUrl: string;
  triggers: StreamTriggerOptions[];
}

// valid abi of the event
// eslint-disable-next-line camelcase
const NFT_transfer_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" },
    ],
    name: "transfer",
    type: "event",
  },
];

const DESCRIPTION = "monitor all NFT transfers";
const TAG = "NFT_transfers";
const CHAINIDS = [EvmChain.ETHEREUM];

// eslint-disable-next-line require-jsdoc
export async function addStream(options: StreamOptions) {
  const { networkType, webhookUrl, triggers } = options;

  const result = await Moralis.Streams.add({
    networkType,
    webhookUrl,
    chains: CHAINIDS,
    tag: TAG,
    description: DESCRIPTION,
    // eslint-disable-next-line camelcase
    abi: NFT_transfer_ABI,
    includeContractLogs: true,
    allAddresses: true,
    topic0: ["transfer(address,address,uint256)"],
    advancedOptions: [
      {
        topic0: "transfer(address,address,uint256)",
      },
    ],
    triggers,
  });

  return result.raw;
}

// eslint-disable-next-line require-jsdoc
export async function getStreams() {
  const result = await Moralis.Streams.getAll({
    limit: 20,
    networkType: "evm",
  });

  return result.raw;
}

// eslint-disable-next-line require-jsdoc
export async function deleteStream(id: string) {
  const result = await Moralis.Streams.delete({
    id,
    networkType: "evm",
  });

  return result.raw;
}

// eslint-disable-next-line require-jsdoc
export async function updateStream(id: string, options: StreamOptions) {
  const { networkType, webhookUrl, triggers } = options;

  // TODO get all users
  const users = [
    "0x15d51e51CAF5585a40cB965080098Bfb68AF3336",
    "0x15F7320adb990020956D29Edb6ba17f3D468001e",
    "0xEd034B287ea77A14970f1C0c8682a80a9468dBB3",
    "0x405020c797A64f155c9966C88e5C677B2dbca5AB",
    "0x2d368d6A84B791D634E6f9f81908D884849fd43d",
  ];

  const filters: string[][] = [];
  for (const user in users) {
    if (!user) {
      continue;
    }
    filters.push(["from", user]);
    filters.push(["to", user]);
  }

  const result = await Moralis.Streams.update({
    id,
    networkType,
    webhookUrl,
    chains: CHAINIDS,
    tag: TAG,
    description: DESCRIPTION,
    // eslint-disable-next-line camelcase
    abi: NFT_transfer_ABI,
    includeContractLogs: true,
    allAddresses: true,
    topic0: ["transfer(address,address,uint256)"],
    advancedOptions: [
      {
        topic0: "transfer(address,address,uint256)",
        filter: { or: [{ in: ["from", users] }, { in: ["to", users] }] },
      },
    ],
    triggers,
  });

  return result.raw;
}

/**
 * Add address to existing moralis stream
 * @param {string} id - stream id in which the address will be added
 * @param {string} address - address to be added
 */
export async function addAddress(id: string, address: string) {
  // Add contract address
  const result = await Moralis.Streams.addAddress({
    id,
    networkType: "evm",
    address: [address],
  });
  return result.raw;
}

// eslint-disable-next-line require-jsdoc
export async function removeAddress(id: string, address: string) {
  // Add addresses
  const result = await Moralis.Streams.deleteAddress({
    id,
    networkType: "evm",
    address,
  });
  return result.raw;
}

// eslint-disable-next-line require-jsdoc
export async function getAllAddress(id: string, limit?: number) {
  // Add addresses
  const result = await Moralis.Streams.getAddresses({
    id,
    networkType: "evm",
    limit: limit || 100,
  });
  return result.raw;
}

// eslint-disable-next-line require-jsdoc
export async function setSettings({
  region,
}: {
  region: "us-east-1" | "us-west-2" | "eu-central-1" | "ap-southeast-1";
}) {
  const result = await Moralis.Streams.setSettings({
    region,
  });

  return result.raw;
}
