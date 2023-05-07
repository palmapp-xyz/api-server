import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { Web3MessageStatus } from '../../src/web3Message/utils';
import nock from 'nock';
import * as testing from '@firebase/testing'
import { JsonRpcProvider, TransactionResponse } from 'ethers';

// using rewire to mock the config file
import rewire from 'rewire';
// const executorFunctionModule = rewire('../../../src/web3Message/executorFunction');

import executor from '../../src/web3Message/executorFunction';
const { executorFunction, broadcastTx } = executor;
// executorFunctionModule.__set__('config', require('./config.mock').default);

import { configMock as config} from './config.mock';
const testEnv = functions();
const app = testing.initializeTestApp({ projectId: 'test-project' });
const mockFirestore = app.firestore();
const mockTx = {
    hash: 'mockedTxHash',
}

describe('Broadcast Tx Function', () => {
  const rawTx = 'dummyTransaction';
  const docId = 'testDocId';
  const txHash = '0x1234567890abcdef';

  jest.spyOn(admin, 'firestore').mockImplementation(() => mockFirestore as any);
  // Spy on the broadcastTransaction method and replace its implementation
  const broadcastTransactionSpy = jest
  .spyOn(JsonRpcProvider.prototype, 'broadcastTransaction')
  .mockImplementation( async () => Promise.resolve(mockTx) as any);

  // Spy on the WaitForTransaction method and replace its implementation
    const waitForTransactionSpy = jest
    .spyOn(TransactionResponse.prototype, 'wait')
    .mockImplementation( async () => Promise.resolve(mockTx) as any);

  beforeEach(() => {
  });

  afterEach(() => {
    nock.cleanAll();
  });

  test('Broadcasts transaction successfully', async () => {
    const updateSpy = jest.spyOn(admin.firestore().collection('web3Messages').doc(docId), 'update');

    await broadcastTx(rawTx, docId);

    expect(updateSpy).toHaveBeenCalledWith({ status: Web3MessageStatus.EXECUTING, txHash });
    expect(updateSpy).toHaveBeenCalledWith({ status: Web3MessageStatus.EXECUTED });

    updateSpy.mockRestore();
  });

  test('Fails to broadcast transaction', async () => {
    nock.cleanAll();

    nock(config.RPC_URL)
      .post('/', { jsonrpc: '2.0', id: /[\d]+/, method: 'eth_sendRawTransaction', params: [rawTx] })
      .replyWithError('Something went wrong');

    const updateSpy = jest.spyOn(admin.firestore().collection('web3Messages').doc(docId), 'update');

    await broadcastTx(rawTx, docId);

    expect(updateSpy).toHaveBeenCalledWith({ status: Web3MessageStatus.FAILED });

    updateSpy.mockRestore();
  });
});
