import { NextFunction, Request, Response } from "express";
export declare function create(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function update(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function del(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function addAddr(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function removeAddr(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getAllAddr(req: Request, res: Response, next: NextFunction): Promise<void>;
