import { NextFunction, Request, Response } from "express";

import { firestore } from "../../index";

/**
 * Create a new profile
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {void}
 * @description - create a new user's profile
 * @example - create(req, res, next)
 * */
export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    // check if profile already exists
    const result = await firestore
      .collection("profile")
      .doc(res.locals.displayName)
      .get();
    if (result.exists) {
      throw new Error("profile already exists");
    }

    await firestore
      .collection("profile")
      .doc(res.locals.displayName)
      .set(
        {
          ...req.body,
        },
        {
          merge: false,
        }
      );

    res.status(200).json({ message: "profile created" });
  } catch (err) {
    next(err);
  }
}

/**
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {void}
 * @description - get user's profile
 * @example - get(req,res, next)
 * @throws - profile not found
 *
 * */
export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    // get id from req.params
    const { id } = req.params;
    // fetch doc from firestore using id
    const result = await firestore.collection("profile").doc(id).get();
    // check if doc exists
    if (!result.exists) {
      throw new Error("profile not found");
    }
    // remove sendbird_token from result
    const { sendbird_token, ...rest } = result.data() as {
      sendbird_token: string;
    };

    res.status(200).json({ result: rest });
  } catch (err) {
    next(err);
  }
}

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
export async function getSendbirdToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // fetch doc from firestore using id
    const result = await firestore
      .collection("profile")
      .doc(res.locals.displayName)
      .get();
    // check if doc exists
    if (!result.exists) {
      throw new Error("profile not found");
    }

    const { sendbird_token } = result.data() as { sendbird_token: string };

    res.status(200).json({ result: { sendbird_token } });
  } catch (err) {
    next(err);
  }
}

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
export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    // fetch doc from firestore using id and update it with req.body
    // eslint-disable-next-line max-len
    await firestore
      .collection("profile")
      .doc(res.locals.displayName)
      .update(req.body);
    res.status(200).json({ message: "profile updated" });
  } catch (err) {
    next(err);
  }
}

/**
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {void}
 * @description - delete user's profile
 * @example - del(req, res, next)
 *
 * */
export async function del(req: Request, res: Response, next: NextFunction) {
  try {
    // eslint-disable-next-line max-len
    await firestore.collection("profile").doc(res.locals.displayName).delete();

    res.status(200).json({ message: "profile deleted" });
  } catch (err) {
    next(err);
  }
}
