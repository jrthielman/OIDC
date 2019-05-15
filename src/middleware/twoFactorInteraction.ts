import * as express from 'express';

export default async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    
    console.log('In the 2FA interaction');

    const provider = res.locals.provider;
    const details = await provider.interactionDetails(req);
    const { twoFactor } = req.body;

    if (twoFactor) {
        await provider.interactionFinished(req, res, req.cookies['result']);
        await next();
        
    } else {
        await res.redirect(`/interaction/${details.uid}/twofactor#1`);
    }
}