export interface Web3MessageProps {
    contractAddress: string;
    name: string;
    symbol: string;
    description: string;
    logo_url: string;
    messageTypes: Web3MessageTypeProps[];
    creatorId: string;
  }

export interface Web3MessageTypeProps {
        functionName: string;
        abi: {[p: string]: any};
        interactions: Web3MessageInteraction[];
    }

export interface Web3MessageInteraction {
        name: string;
    }
export interface Web3MessageClientProps {
        coreMessageId: string;
        functionName: string;
        parameters: {[name: string]: string};
        receivers: string[];
        sender: string;
        rawData: string;
        rawTx: string;
        sigCount: number;
        conditionalExecution: boolean;
        executionCondition: Condition;
        expiresAt: string;
        memo: string;
        status: Web3MessageStatus;
    }

export enum Web3MessageStatus {
        PENDING = 'PENDING',
        EXECUTING = 'EXECUTING',
        REJECTED = 'REJECTED',
        CANCELLED = 'CANCELLED',
        EXECUTED = 'EXECUTED',
        SIGNING = 'SIGNING', // TODO: IS THIS NEEDED?
        EXPIRED = 'EXPIRED',
        FAILED = 'FAILED', // due to revert or other error e.g: validation error (invalid parameters) TODO: what if out of gas?
        SIGNED = 'SIGNED',
    }
export interface Condition {
        keyName: string;
        keyValue: string;
        operator: string;
        onChain: boolean;
    }
