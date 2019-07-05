import * as express from 'express';

export default async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    console.log('in the interaction');

    const provider = res.locals.provider;
    const details = await provider.interactionDetails(req);

    if(details.interaction.error === 'login_required'){
        await res.redirect(`/interaction/${details.uuid}/login`);
        return next();
    }

    if (req.cookies._session) {
        if(req.cookies['result'].login.acr === 'rookie'){
            await provider.interactionFinished(req, res, req.cookies['result']);
            return next();
        }
        await res.redirect(`/interaction/${details.uuid}/login`);
        return next();
    }

    await res.redirect(`/interaction/${details.uuid}/login`);
    return next();
}
