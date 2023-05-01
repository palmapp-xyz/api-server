import {Request, Response, NextFunction} from 'express';
import {Web3MessageProps} from './utils';
import {firestore} from '../index';

export const releaseWeb3Message = async (req: Request, res: Response, next: NextFunction) => {
  const web3Message = req.body.message as Web3MessageProps;

  try {
    // check if web3Message already exists
    const result = await firestore.collection('palmStore').where('contractAddress', '==', web3Message.contractAddress).get();
    if (result.size > 0) {
      // update existing web3Message
      await firestore.collection('palmStore').doc(result.docs[0].id).update(
          {
            ...web3Message,
          });
    }

    const response = await firestore.collection('palmStore').add(
        {
          ...web3Message,
        }
    );

    res.status(200).json({message: 'web3Message created', id: response.id});
  } catch (err) {
    next(err);
  }
};
