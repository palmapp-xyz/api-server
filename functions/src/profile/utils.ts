import {NextFunction, Request, Response} from 'express';

/**
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {void}
 * @description - validate body of profile creation request
 * @example - validateBody(req, res, next)
 * @throws - invalid body, minimum 6 keys are required
 * @throws - nft_image_url is required
 * @throws - nft_contract_addr is required
 * @throws - nft_tokenId is required
 * @throws - bio is required
 * @throws - user_name is required
 * @throws - sendbird_token is required
 * @throws - invalid token
 * */
// eslint-disable-next-line complexity
export async function isValidProfile(req: Request, res: Response, next: NextFunction) {
  try {
    // eslint-disable-next-line camelcase
    // @ts-ignore
    // eslint-disable-next-line max-len
    const {nft_image_url, nft_contract_addr, nft_tokenId, bio, user_name, sendbird_token} = req.body;

    // check: body should be defined & minimum 6 keys are required
    if (!req.body || Object.keys(req.body).length < 6) {
      throw new Error('invalid body, minimum 6 keys are required');
    }
    // eslint-disable-next-line max-len
    // check: individually check that each key defined above should be present in body
    if (!nft_image_url) {
      throw new Error('nft_image_url is required');
    }
    if (!nft_contract_addr) {
      throw new Error('nft_contract_addr is required');
    }
    if (!nft_tokenId) {
      throw new Error('nft_tokenId is required');
    }
    if (!bio) {
      throw new Error('bio is required');
    }
    if (!user_name) {
      throw new Error('user_name is required');
    }
    if (!sendbird_token) {
      throw new Error('sendbird_token is required');
    }

    next();
  } catch (err) {
    next(err);
  }
}
