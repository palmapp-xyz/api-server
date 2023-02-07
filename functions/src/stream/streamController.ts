import {NextFunction, Request, Response} from "express";
// eslint-disable-next-line max-len
import {addStream, deleteStream, getStreams, updateStream, addAddress, removeAddress, getAllAddress} from "./streamService";


export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const {webhookUrl, triggers} = req.body;

    const result = await addStream({
      networkType: "evm",
      webhookUrl,
      triggers,
    });

    res.status(200).json({result});
  } catch (err) {
    next(err);
  }
}


export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const message = await getStreams();

    res.status(200).json({message});
  } catch (err) {
    next(err);
  }
}


export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const {webhookUrl, triggers} = req.body;
    const {id} = req.params;

    const message = await updateStream(id, {
      networkType: "evm",
      webhookUrl,
      triggers,
    });

    res.status(200).json({message});
  } catch (err) {
    next(err);
  }
}


export async function del(req: Request, res: Response, next: NextFunction) {
  try {
    const {id} = req.params;

    const message = await deleteStream(id);

    res.status(200).json({message});
  } catch (err) {
    next(err);
  }
}

export async function addAddr(req: Request, res: Response, next: NextFunction) {
  try {
    const {id} = req.params;
    const {address} = req.body;

    const result = await addAddress(id, address);

    res.status(200).json({result});
  } catch (err) {
    next(err);
  }
}


export async function removeAddr(req: Request, res: Response, next: NextFunction) {
  try {
    const {id} = req.params;
    const {address} = req.body;

    const result = await removeAddress(id, address);

    res.status(200).json({result});
  } catch (err) {
    next(err);
  }
}

export async function getAllAddr(req: Request, res: Response, next: NextFunction) {
  try {
    const {id} = req.params;

    const result = await getAllAddress(id);

    res.status(200).json({result});
  } catch (err) {
    next(err);
  }
}
