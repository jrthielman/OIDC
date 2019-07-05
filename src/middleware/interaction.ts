import * as express from 'express';

export default async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    console.log('in the interaction');

    const provider = res.locals.provider;
    const details = await provider.interactionDetails(req);

    if (req.cookies._session) {
        await provider.interactionFinished(req, res, req.cookies['result']);
        return next();
    }

    await res.redirect(`/interaction/${details.uuid}/login`);
    return next();
}
