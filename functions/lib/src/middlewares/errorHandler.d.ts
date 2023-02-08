import { MoralisError } from '@moralisweb3/common-core';
import { NextFunction, Request, Response } from 'express';
import { AxiosError } from 'axios';
export declare function errorHandler(error: Error | MoralisError | AxiosError, req: Request, res: Response, _next: NextFunction): void;
