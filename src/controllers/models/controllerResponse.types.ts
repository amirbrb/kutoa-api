import {Response} from 'express';

export type KException = Error;

export interface SuccessResponse<T> extends Response {
  data?: T;
  message?: string;
}

export interface ErrorResponse extends Response {
  message?: string;
  error?: string;
}

export type ControllerResponse<T> = SuccessResponse<T> | ErrorResponse;
