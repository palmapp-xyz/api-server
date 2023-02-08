import { NextFunction, Request, Response } from "express";
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
export declare function isValidProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
