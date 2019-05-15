import * as express from 'express';

export default async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    console.log('in the custom interaction');

    return false;
}