import * as express from 'express';
import { createConnection } from 'typeorm';
import { User } from './database/entity/user';
import * as bodyParser from 'body-parser';
import logging from './middleware/logging';
import send from './middleware/send';
import presetLocals from './middleware/presetLocals';

createConnection().then(connection => {

    const userRepository = connection.getRepository(User);

    // create and setup express app
    const app = express();

    app.use(bodyParser.json());
    app.use(presetLocals);

    app.get('/entrycode', async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
        res.send(`auth code received: ${req.query['code']}`);
        // return;
    });

    app.post('/users/add', bodyParser.urlencoded({extended: true}));

    app.get("/users/add", async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        
        res.send(`<h1>Register</h1>
       <form method="POST">
       <input type="text" placeholder="firstname" name="firstname"/>
       <input type="text" placeholder="lastname" name="lastname"/>
       <input type="text" placeholder="username" name="username"/>
       <input type="password" placeholder="password" name="password"/>
       <input type="submit" value="submit"/>
       </form>`)
    });

    app.post("/users/add", async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

        const { firstname, lastname, username, password } = req.body;

        const user: User = await userRepository.findOne({ where: { username: username } })

        if (!user) {
            try {
                const savedUser: User = await userRepository.save({firstname:firstname, lastname: lastname, username: username, password: password});
                res.locals.data = { type: 'entity', body: savedUser }
                res.status(201);
                next();
                return;
            }catch(e){
                res.send(e);
                return;
            }
        }

        res.send({ error: 'This user already exists' })
        return;

    });

    // register routes
    app.get("/users", async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        const users: User[] = await userRepository.find()

        if (!users) {
            res.send({ error: 'WE DO NOT HAVE ANY USERS LISTED' })
            return;
        }

        res.locals.data = { type: 'list', body: users, size: users.length }
        res.status(302);
        next();
    });

    app.get("/users/:id", async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        const user: User = await userRepository.findOne(req.params.id);

        if (!user) {
            res.status(404);
            res.send({ error: 'USER NOT FOUND' })
            return;
        }

        res.status(302);
        res.locals.data = { type: 'entity', body: user }
        next();
    });

    app.post("/users", async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

        try {
            const user = userRepository.create(req.body);
            const createdUser = await userRepository.save(user);

            res.status(201);
            res.locals.data = { type: 'entity', body: createdUser }
            next();
        } catch (e) {
            res.status(400);
            res.send({ error: e.message })
            return;
        }
    });

    app.put("/users/:id", async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        const user = await userRepository.findOne(req.params.id);
        const oldUser = Object.assign({}, user);

        if (!user) {
            res.status(404);
            res.send({ error: 'USER NOT FOUND' })
            return;
        }

        userRepository.merge(user, req.body);
        const savedUser = await userRepository.save(user);

        res.status(200);
        res.locals.data = { type: 'entity', body: { old: oldUser, new: savedUser } }
        next();
    });

    app.delete("/users/:id", async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

        const removedUser = await userRepository.remove(await userRepository.findOne(req.params.id));

        if (!removedUser) {
            res.status(404);
            res.send({ error: 'USER NOT FOUND' })
            return;
        }

        res.status(200);
        res.locals.data = { type: "entity", body: removedUser };
        next();
    });

    app.use(logging, send);

    // start express server
    app.listen(2000);
});