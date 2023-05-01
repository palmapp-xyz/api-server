import * as functions from 'firebase-functions';
import config from '../config';
import * as admin from 'firebase-admin';
import ethers from 'ethers';
import {Condition, Web3MessageClientProps, Web3MessageStatus} from './utils';

const executorFunction = functions.firestore
    .document('web3Messages/{messageId}')
    .onUpdate(async (change, _context) => {
      const data = change.after.data() as Web3MessageClientProps;
      const docId = change.after.id;

      // check if condition is met to execute the function

      // broadcast transaction if only status is signed
      if (data.status === Web3MessageStatus.SIGNED ) {
        // check if Condition is set
        if (data.conditionalExecution) {
          // ignor if condition is on-chain
          if (data.executionCondition.onChain) {
            // ignoring for now

          } else {
            // check if condition is met
            const condition: Condition = data.executionCondition;
            // get the value of the key from web3 message
            // get value of the key from data object as per condition keyName
            const {keyName} = condition;
            const {keyValue} = condition;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {operator} = condition; // skipping for now

            // get the value of the key from web3 message and compare it with the condition as per operator

            if ( data[keyName] === keyValue ) { // TODO: add support for other operators e.g: >, <, >=, <=, != etc (using switch case)
              // condition is met, execute the function])
              await broadcastTx(data.rawTx, docId);
            } else {
              // condition is not met, return

            }
          }
        } else {
        // broadcast transaction
          await broadcastTx(data.rawTx, docId);
        }
      }
    });

const broadcastTx = async (rawTx: string, docId: string) => {
  try {
  // broadcast transaction using ethers
    const provider = new ethers.JsonRpcProvider(config.RPC_URL); // TODO: add to config
    const tx = await provider.broadcastTransaction(rawTx);
    // update status to executing
    await admin.firestore().collection('web3Messages').doc(docId).update({status: Web3MessageStatus.EXECUTING, txHash: tx.hash});
    // update status to executing if transaction got 12 confirmations
    tx.wait(12).then(() => {
      admin.firestore().collection('web3Messages').doc(docId).update({status: Web3MessageStatus.EXECUTED});
    });
  } catch (err) {
    console.log(err);
    // update status to failed
    await admin.firestore().collection('web3Messages').doc(docId).update({status: Web3MessageStatus.FAILED});
  }
};
