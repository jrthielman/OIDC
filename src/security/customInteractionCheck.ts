import * as express from 'express';

export default async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    // Dit wordt als laatste aangeroepen, om te kijken of er nog wat nodig is om de gebruiker te authenticeren
    console.log('in the custom interaction');

    return false;
}
