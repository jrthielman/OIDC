import * as express from 'express';

export default async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    // Dit wordt als laatste aangeroepen, om te kijken of er nog wat nodig is om de gebruiker te authenticeren
    console.log('in the custom interaction');

    const provider = res.locals.provider;
    const details = await provider.interactionDetails(req);

    const {error} = details.interaction;

    if(error === 'login_required'){
        console.log('Custom interaction: login required');
        return {
            error: error
        }
    }

    return false;
}
