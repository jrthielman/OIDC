import * as express from 'express';
import { createConnection } from 'typeorm';
import { User } from './database/entity/user';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import logging from './middleware/logging';
import send from './middleware/send';
import presetLocals from './middleware/presetLocals';
import { Instance } from './singletons/instance';
import setSingletons from './middleware/setSingletons';
import sessionsCheck from "./middleware/sessionsCheck";

createConnection().then(connection => {

    const userRepository = connection.getRepository(User);

    // create and setup express app
    const PORT = 1000;
    const app = express();

    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(sessionsCheck);
    app.use(presetLocals);
    app.use(setSingletons);

    app.get('/home', (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.send(`<ul>
                            <li><a href="http://localhost:1000/createinstance">Create instance</a></li>
                            <li><a href="http://localhost:1000/users">All registered users</a></li>
                            <li><a href="http://localhost:1000/register">Register a user</a></li>
                            <li><p>Get specific user by adding their ID after users/add/:id</p></li>
                            <li><p>Remove specific user by using their ID after users/add/:id</p></li>
                            <li><p>Access token: ${req.cookies._session}</p></li>
                        </ul>`
        )
    });

    app.get('/createinstance', (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const instance = Instance.getInstance();
        res.send(`<h1>Instance was created</h1>
        <p>Instance value: ${instance.value}</p>
        <p>Instances created: ${instance.counter}</p>`);
    });

    // register routes
    app.get("/register", async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

        res.send(`<h1>Register</h1>
       <form method="POST">
       <input type="text" placeholder="firstname" name="firstname"/>
       <input type="text" placeholder="lastname" name="lastname"/>
       <input type="text" placeholder="username" name="username"/>
       <input type="password" placeholder="password" name="password"/>
       <input type="submit" value="submit"/>
       </form>`)
    });

    app.post('/register', bodyParser.urlencoded({extended: true}));
    app.post("/register", async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

        const { firstname, lastname, username, password } = req.body;

        const user: User = await userRepository.findOne({ where: { username: username } });

        if (!user) {
            try {
                const savedUser: User = await userRepository.save({firstname:firstname, lastname: lastname, username: username, password: password});
                res.locals.data = { type: 'entity', body: savedUser };
                res.status(201);
                next();
                return;
            }catch(e){
                res.send(e);
                return;
            }
        }

        res.send({ error: 'This user already exists' });
        return;

    });

    app.get("/users", async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        const users: User[] = await userRepository.find();

        if (!users) {
            res.send({ error: 'WE DO NOT HAVE ANY USERS LISTED' });
            return;
        }

        res.locals.data = { type: 'list', body: users, size: users.length };
        res.status(302);
        next();
    });

    app.get("/users/:id", async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        const user: User = await userRepository.findOne(req.params.id);

        if (!user) {
            res.status(404);
            res.send({ error: 'USER NOT FOUND' });
            return;
        }

        res.status(302);
        res.locals.data = { type: 'entity', body: user };
        next();
    });

    app.post("/users", async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

        try {
            const user = userRepository.create(req.body);
            const createdUser = await userRepository.save(user);

            res.status(201);
            res.locals.data = { type: 'entity', body: createdUser };
            next();
        } catch (e) {
            res.status(400);
            res.send({ error: e.message });
            return;
        }
    });

    app.put("/users/:id", async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        const user = await userRepository.findOne(req.params.id);
        const oldUser = Object.assign({}, user);

        if (!user) {
            res.status(404);
            res.send({ error: 'USER NOT FOUND' });
            return;
        }

        userRepository.merge(user, req.body);
        const savedUser = await userRepository.save(user);

        res.status(200);
        res.locals.data = { type: 'entity', body: { old: oldUser, new: savedUser } };
        next();
    });

    app.delete("/users/:id", async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

        const removedUser = await userRepository.remove(await userRepository.findOne(req.params.id));

        if (!removedUser) {
            res.status(404);
            res.send({ error: 'USER NOT FOUND' });
            return;
        }

        res.status(200);
        res.locals.data = { type: "entity", body: removedUser };
        next();
    });

    app.use(logging, send);

    // start express server
    app.listen(PORT, () => {
        console.log(`service is listening on port ${PORT}, check http://localhost:${PORT}/home or register a user here http://localhost:${PORT}/register`);
    });
});
