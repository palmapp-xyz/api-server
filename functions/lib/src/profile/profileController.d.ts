import { NextFunction, Request, Response } from 'express';
/**
 * Create a new profile
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {void}
 * @description - create a new user's profile
 * @example - create(req, res, next)
* */
export declare function create(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {void}
 * @description - get user's profile
 * @example - get(req, res, next)
 * @throws - profile not found
 *
* */
export declare function get(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {void}
 * @description - get user's sendbird token
 * @example - get(req, res, next)
 * @throws - profile not found
 *
* */
export declare function getSendbirdToken(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {void}
 * @description - update user's profile
 * @example - update(req, res, next)
 * @throws - profile not found
 *
 * */
export declare function update(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {void}
 * @description - delete user's profile
 * @example - del(req, res, next)
 *
 * */
export declare function del(req: Request, res: Response, next: NextFunction): Promise<void>;
