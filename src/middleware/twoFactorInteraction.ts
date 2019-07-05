import * as express from 'express';

export default async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    console.log('In the 2FA interaction');

    const provider = res.locals.provider;
    const details = await provider.interactionDetails(req);
    const {twoFactor} = req.body;

    if (twoFactor) {
        return await provider.interactionFinished(req, res, req.cookies['result'])
    }

    return await res.redirect(`/interaction/${details.uuid}/twofactor#1`);
}
