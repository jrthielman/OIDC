import * as express from 'express';

export default async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    console.log('in the interaction');

    const provider = res.locals.provider;
    const details = await provider.interactionDetails(req);

    await res.redirect(`/interaction/${details.uid}/login`);
    return;
}