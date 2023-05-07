import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { Web3MessageStatus } from '../../src/web3Message/utils';
import * as testing from '@firebase/testing'
// using rewire to mock the config file
import rewire from 'rewire';
// const executorFunctionModule = rewire('../../../src/web3Message/executorFunction');

// const executor = executorFunctionModule.default;
import executor from '../../src/web3Message/executorFunction';
const { executorFunction, broadcastTx } = executor;
// executorFunctionModule.__set__('config', require('./config.mock').default);
  
const testEnv = functions();
const app = testing.initializeTestApp({ projectId: 'test-project' });
const mockFirestore = app.firestore();
describe('Executor Function', () => {
    let updateSpy: jest.SpyInstance;
    const docId = 'testDocId';
    const initialData = {
        status: Web3MessageStatus.SIGNED,
        rawTx: 'dummyTransaction',
    };

    beforeEach(() => {
        // updateSpy = jest.spyOn(admin.firestore().collection('web3Messages').doc(docId), 'update');
        updateSpy = jest.spyOn(admin, 'firestore').mockImplementation(() => mockFirestore as any);
    });

    afterEach(() => {
        updateSpy.mockRestore();
        testEnv.cleanup();
    });

    test('Does not broadcast transaction when status is not SIGNED', async () => {
        const wrapped = testEnv.wrap(executorFunction);
        const beforeSnapshot = testEnv.firestore.makeDocumentSnapshot({ ...initialData, status: Web3MessageStatus.PENDING }, `web3Messages/${docId}`);
        const afterSnapshot = testEnv.firestore.makeDocumentSnapshot({ status: Web3MessageStatus.PENDING }, `web3Messages/${docId}`);
        const change = testEnv.makeChange(beforeSnapshot, afterSnapshot );
        const context = { params: { messageId: docId } };

        await wrapped(change, context);

        expect(updateSpy).not.toHaveBeenCalled();
    });

    test('Broadcasts transaction when status is SIGNED and no condition is set', async () => {
        const wrapped = testEnv.wrap(executorFunction);
        const beforeSnapshot = testEnv.firestore.makeDocumentSnapshot({ ...initialData, status: Web3MessageStatus.PENDING }, `web3Messages/${docId}`);
        const afterSnapshot = testEnv.firestore.makeDocumentSnapshot(initialData, `web3Messages/${docId}`);
        const change = testEnv.makeChange(beforeSnapshot, afterSnapshot );
        const context = { params: { messageId: docId } };

        await wrapped(change, context);

        expect(updateSpy).toHaveBeenCalled();
    });

    test('Does not broadcast transaction when status is SIGNED but off-chain condition is not met', async () => {
        const wrapped = testEnv.wrap(executorFunction);
        const beforeEachSnapshot = testEnv.firestore.makeDocumentSnapshot({ ...initialData, status: Web3MessageStatus.PENDING }, `web3Messages/${docId}`);
        const afterEachSnapshot = testEnv.firestore.makeDocumentSnapshot({
            ...initialData,
            conditionalExecution: true,
            executionCondition: {
                keyName: 'testKey',
                keyValue: 'expectedValue',
                operator: '==',
                onChain: false,
            }
        }, `web3Messages/${docId}`);
        const change = testEnv.makeChange(beforeEachSnapshot, afterEachSnapshot);
        const context = { params: { messageId: docId } };

        await wrapped(change, context);

        expect(updateSpy).not.toHaveBeenCalled();
    });

    test('Broadcasts transaction when status is SIGNED and off-chain condition is met', async () => {
        const wrapped = testEnv.wrap(executorFunction);
        const beforeSnapshot = testEnv.firestore.makeDocumentSnapshot({ ...initialData, status: Web3MessageStatus.PENDING }, `web3Messages/${docId}`);
        const afterSnapshot = testEnv.firestore.makeDocumentSnapshot({
            ...initialData,
            conditionalExecution: true,
            executionCondition: {
                keyName: 'testKey',
                keyValue: 'expectedValue',
                operator: '==',
                onChain: false,
            },
            testKey: 'expectedValue',
        }, `web3Messages/${docId}`);
        const change = testEnv.makeChange(beforeSnapshot, afterSnapshot);
        const context = { params: { messageId: docId } };

        await wrapped(change, context);

        expect(updateSpy).toHaveBeenCalled();
    });

    test('Does not broadcast transaction when status is SIGNED and on-chain condition is set', async () => {
        const wrapped = testEnv.wrap(executorFunction);
        const beforeSnapshot = testEnv.firestore.makeDocumentSnapshot({ ...initialData, status: Web3MessageStatus.PENDING }, `web3Messages/${docId}`);
        const afterSnapshot = testEnv.firestore.makeDocumentSnapshot({
            ...initialData,
            conditionalExecution: true,
            executionCondition: {
                keyName: 'testKey',
                keyValue: 'expectedValue',
                operator: '==',
                onChain: true,
            },
        }, `web3Messages/${docId}`);
        const change = testEnv.makeChange(beforeSnapshot, afterSnapshot);
        const context = { params: { messageId: docId } };
        await wrapped(change, context);

        expect(updateSpy).not.toHaveBeenCalled();
    });

});
