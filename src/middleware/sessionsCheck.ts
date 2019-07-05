import * as express from "express"

export default async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    if(req.originalUrl === '/register' || req.cookies._session){
        return next();
    }

    // Handmatig de client ID en redirect uri toegevoegd
    return await res.redirect(`http://localhost:2100/oauth/auth?client_id=123&redirect_uri=http://localhost:1000/home&scope=openid&response_type=code&state=12&nonce=123`);
}
