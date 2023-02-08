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
export declare function addStream(options: StreamOptions): Promise<{
    webhookUrl: string;
    description: string;
    tag: string;
    topic0?: string[] | null | undefined;
    allAddresses?: boolean | undefined;
    includeNativeTxs?: boolean | undefined;
    includeContractLogs?: boolean | undefined;
    includeInternalTxs?: boolean | undefined;
    getNativeBalances?: {
        selectors: string[];
        type: "tx" | "log" | "erc20transfer" | "erc20approval" | "nfttransfer" | "internalTx";
    }[] | undefined;
    abi?: {
        anonymous?: boolean | undefined;
        constant?: boolean | undefined;
        inputs?: {
            name: string;
            type: string;
            indexed?: boolean | undefined;
            components?: any[] | undefined;
            internalType?: string | undefined;
        }[] | undefined;
        name?: string | undefined;
        outputs?: {
            name: string;
            type: string;
            components?: any[] | undefined;
            internalType?: string | undefined;
        }[] | undefined;
        payable?: boolean | undefined;
        stateMutability?: string | undefined;
        type: string;
        gas?: number | undefined;
    }[] | null | undefined;
    advancedOptions?: {
        topic0: string;
        filter?: {
            [key: string]: unknown;
        } | undefined;
        includeNativeTxs?: boolean | undefined;
    }[] | null | undefined;
    chainIds: string[];
    demo?: boolean | undefined;
    triggers?: {
        type: "tx" | "log" | "erc20transfer" | "erc20approval" | "nfttransfer";
        contractAddress: string;
        inputs?: (string & unknown[])[] | undefined;
        functionAbi: {
            anonymous?: boolean | undefined;
            constant?: boolean | undefined;
            inputs?: {
                name: string;
                type: string;
                indexed?: boolean | undefined;
                components?: any[] | undefined;
                internalType?: string | undefined;
            }[] | undefined;
            name?: string | undefined;
            outputs?: {
                name: string;
                type: string;
                components?: any[] | undefined;
                internalType?: string | undefined;
            }[] | undefined;
            payable?: boolean | undefined;
            stateMutability?: string | undefined;
            type: string;
            gas?: number | undefined;
        };
        topic0?: string | undefined;
        callFrom?: string | undefined;
    }[] | null | undefined;
    id: string;
    status: "error" | "active" | "paused" | "terminated";
    statusMessage: string;
}>;
export declare function getStreams(): Promise<import("@moralisweb3/common-core").PaginatedJSONResponse<{
    webhookUrl: string;
    description: string;
    tag: string;
    topic0?: string[] | null | undefined;
    allAddresses?: boolean | undefined;
    includeNativeTxs?: boolean | undefined;
    includeContractLogs?: boolean | undefined;
    includeInternalTxs?: boolean | undefined;
    getNativeBalances?: {
        selectors: string[];
        type: "tx" | "log" | "erc20transfer" | "erc20approval" | "nfttransfer" | "internalTx";
    }[] | undefined;
    abi?: {
        anonymous?: boolean | undefined;
        constant?: boolean | undefined;
        inputs?: {
            name: string;
            type: string;
            indexed?: boolean | undefined;
            components?: any[] | undefined;
            internalType?: string | undefined;
        }[] | undefined;
        name?: string | undefined;
        outputs?: {
            name: string;
            type: string;
            components?: any[] | undefined;
            internalType?: string | undefined;
        }[] | undefined;
        payable?: boolean | undefined;
        stateMutability?: string | undefined;
        type: string;
        gas?: number | undefined;
    }[] | null | undefined;
    advancedOptions?: {
        topic0: string;
        filter?: {
            [key: string]: unknown;
        } | undefined;
        includeNativeTxs?: boolean | undefined;
    }[] | null | undefined;
    chainIds: string[];
    demo?: boolean | undefined;
    triggers?: {
        type: "tx" | "log" | "erc20transfer" | "erc20approval" | "nfttransfer";
        contractAddress: string;
        inputs?: (string & unknown[])[] | undefined;
        functionAbi: {
            anonymous?: boolean | undefined;
            constant?: boolean | undefined;
            inputs?: {
                name: string;
                type: string;
                indexed?: boolean | undefined;
                components?: any[] | undefined;
                internalType?: string | undefined;
            }[] | undefined;
            name?: string | undefined;
            outputs?: {
                name: string;
                type: string;
                components?: any[] | undefined;
                internalType?: string | undefined;
            }[] | undefined;
            payable?: boolean | undefined;
            stateMutability?: string | undefined;
            type: string;
            gas?: number | undefined;
        };
        topic0?: string | undefined;
        callFrom?: string | undefined;
    }[] | null | undefined;
    id: string;
    status: "error" | "active" | "paused" | "terminated";
    statusMessage: string;
}[]>>;
export declare function deleteStream(id: string): Promise<{
    webhookUrl: string;
    description: string;
    tag: string;
    topic0?: string[] | null | undefined;
    allAddresses?: boolean | undefined;
    includeNativeTxs?: boolean | undefined;
    includeContractLogs?: boolean | undefined;
    includeInternalTxs?: boolean | undefined;
    getNativeBalances?: {
        selectors: string[];
        type: "tx" | "log" | "erc20transfer" | "erc20approval" | "nfttransfer" | "internalTx";
    }[] | undefined;
    abi?: {
        anonymous?: boolean | undefined;
        constant?: boolean | undefined;
        inputs?: {
            name: string;
            type: string;
            indexed?: boolean | undefined;
            components?: any[] | undefined;
            internalType?: string | undefined;
        }[] | undefined;
        name?: string | undefined;
        outputs?: {
            name: string;
            type: string;
            components?: any[] | undefined;
            internalType?: string | undefined;
        }[] | undefined;
        payable?: boolean | undefined;
        stateMutability?: string | undefined;
        type: string;
        gas?: number | undefined;
    }[] | null | undefined;
    advancedOptions?: {
        topic0: string;
        filter?: {
            [key: string]: unknown;
        } | undefined;
        includeNativeTxs?: boolean | undefined;
    }[] | null | undefined;
    chainIds: string[];
    demo?: boolean | undefined;
    triggers?: {
        type: "tx" | "log" | "erc20transfer" | "erc20approval" | "nfttransfer";
        contractAddress: string;
        inputs?: (string & unknown[])[] | undefined;
        functionAbi: {
            anonymous?: boolean | undefined;
            constant?: boolean | undefined;
            inputs?: {
                name: string;
                type: string;
                indexed?: boolean | undefined;
                components?: any[] | undefined;
                internalType?: string | undefined;
            }[] | undefined;
            name?: string | undefined;
            outputs?: {
                name: string;
                type: string;
                components?: any[] | undefined;
                internalType?: string | undefined;
            }[] | undefined;
            payable?: boolean | undefined;
            stateMutability?: string | undefined;
            type: string;
            gas?: number | undefined;
        };
        topic0?: string | undefined;
        callFrom?: string | undefined;
    }[] | null | undefined;
    id: string;
    status: "error" | "active" | "paused" | "terminated";
    statusMessage: string;
}>;
export declare function updateStream(id: string, options: StreamOptions): Promise<{
    webhookUrl: string;
    description: string;
    tag: string;
    topic0?: string[] | null | undefined;
    allAddresses?: boolean | undefined;
    includeNativeTxs?: boolean | undefined;
    includeContractLogs?: boolean | undefined;
    includeInternalTxs?: boolean | undefined;
    getNativeBalances?: {
        selectors: string[];
        type: "tx" | "log" | "erc20transfer" | "erc20approval" | "nfttransfer" | "internalTx";
    }[] | undefined;
    abi?: {
        anonymous?: boolean | undefined;
        constant?: boolean | undefined;
        inputs?: {
            name: string;
            type: string;
            indexed?: boolean | undefined;
            components?: any[] | undefined;
            internalType?: string | undefined;
        }[] | undefined;
        name?: string | undefined;
        outputs?: {
            name: string;
            type: string;
            components?: any[] | undefined;
            internalType?: string | undefined;
        }[] | undefined;
        payable?: boolean | undefined;
        stateMutability?: string | undefined;
        type: string;
        gas?: number | undefined;
    }[] | null | undefined;
    advancedOptions?: {
        topic0: string;
        filter?: {
            [key: string]: unknown;
        } | undefined;
        includeNativeTxs?: boolean | undefined;
    }[] | null | undefined;
    chainIds: string[];
    demo?: boolean | undefined;
    triggers?: {
        type: "tx" | "log" | "erc20transfer" | "erc20approval" | "nfttransfer";
        contractAddress: string;
        inputs?: (string & unknown[])[] | undefined;
        functionAbi: {
            anonymous?: boolean | undefined;
            constant?: boolean | undefined;
            inputs?: {
                name: string;
                type: string;
                indexed?: boolean | undefined;
                components?: any[] | undefined;
                internalType?: string | undefined;
            }[] | undefined;
            name?: string | undefined;
            outputs?: {
                name: string;
                type: string;
                components?: any[] | undefined;
                internalType?: string | undefined;
            }[] | undefined;
            payable?: boolean | undefined;
            stateMutability?: string | undefined;
            type: string;
            gas?: number | undefined;
        };
        topic0?: string | undefined;
        callFrom?: string | undefined;
    }[] | null | undefined;
    id: string;
    status: "error" | "active" | "paused" | "terminated";
    statusMessage: string;
}>;
export declare function addAddress(id: string, address: string): Promise<{
    streamId: string;
    address: string & (string | undefined)[];
}>;
export declare function removeAddress(id: string, address: string): Promise<{
    streamId: string;
    address: string & (string | undefined)[];
}>;
export declare function getAllAddress(id: string, limit?: number): Promise<import("@moralisweb3/common-core").PaginatedJSONResponse<{
    address: string;
}[]>>;
export declare function setSettings({ region, }: {
    region: "us-east-1" | "us-west-2" | "eu-central-1" | "ap-southeast-1";
}): Promise<{
    region?: "us-east-1" | "us-west-2" | "eu-central-1" | "ap-southeast-1" | undefined;
}>;
export {};
