import * as Provider from 'oidc-provider';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import login from '../views/login';
import interaction from '../middleware/interaction';
import loginInteraction from '../middleware/loginInteraction';
import customInteractionCheck from './customInteractionCheck';
import twoFactor from '../views/twoFactor';
import twoFactorInteraction from '../middleware/twoFactorInteraction';
import { createConnection } from 'typeorm';
import { User } from '../database/entity/user';
import errorHandler from './errorHandler';

createConnection().then(connection => {

  const userRepository = connection.getRepository(User);

  const oidcApi = express();

  const clients =
    [
      {
        client_id: '123',
        client_secret: '123',
        redirect_uris: ['http://localhost:2000/entrycode'],
        // + other client properties
      }
    ];

  const configuration = {
    renderError: errorHandler,
    interactionCheck: customInteractionCheck,
    interactionUrl: (ctx, interaction) => { // eslint-disable-line no-unused-vars
      return `/interaction/${ctx.oidc.uid}`;
    },
    async findById(ctx, id) { // De ID wordt per entity bepaald. De ID is de unieke identifier dat wordt meegegeven in de logininteraction
      return {
        accountId: id,
        async claims() { return { sub: id }; },
      };
    },
    features: {
      devInteractions: false,
      clientCredentials: true,
      introspection: true
    }
  };

  const PORT = 2100;
  const PATH = `http://localhost:${PORT}`;

  const oidc = new Provider(PATH, configuration);

  oidc.initialize({ clients }).then(() => {
    const setProvider = (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.locals.provider = oidc;
      next();
    }

    const setRepositories = (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.locals.repositories = {
        user: userRepository
      }
      next();
    }

    oidcApi.use('/', cookieParser())

    oidcApi.use('/oauth', oidc.callback);

    oidcApi.use('/interaction', setProvider);
    oidcApi.use('/interaction', setRepositories);

    oidcApi.use('/interaction/:grant', bodyParser.json())
    oidcApi.get('/interaction/:grant', interaction);

    oidcApi.post('/interaction/:grant/login', bodyParser.urlencoded({ extended: true }));
    oidcApi.post('/interaction/:grant/login', loginInteraction);
    oidcApi.get('/interaction/:grant/login', login);

    oidcApi.post('/interaction/:grant/twofactor', express.urlencoded({ extended: true }));
    oidcApi.post('/interaction/:grant/twofactor', twoFactorInteraction);
    oidcApi.get('/interaction/:grant/twofactor', twoFactor);

    oidcApi.listen(PORT)
  });


});

// or just expose a server standalone, see /examples/standalone.js
// const server = oidc.listen(3000, () => {
//   console.log('oidc-provider listening on port 3000, check http://localhost:3000/.well-known/openid-configuration');
// });