import * as express from 'express';
import {User} from "../database/entity/User";

export default async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    console.log('In the login interaction');

    const provider = res.locals.provider;
    const details = await provider.interactionDetails(req);
    const { username, password } = req.body;

    if (username && password) {

        const knownUser: User = await validateCredentials(username, password, res.locals.repositories.user);

        if (knownUser) {

            const result = {
                login: {
                    account: knownUser.firstname,
                    acr: 'rookie',
                    remember: true,
                    ts: Date.now()
                },
                consent: {},
                meta: { acr: 'rookie' }
            }

            res.cookie('result', result, { expires: false });
            await res.redirect(`/interaction/${details.uid}/twofactor`);
            return;
        }

    }

    await res.redirect(`/interaction/${details.uid}/login#1`);
}

async function validateCredentials(username: string, password: string, userRepository: any): Promise<User> {

        return await userRepository.findOne({where: {username: username, password: password}});
}