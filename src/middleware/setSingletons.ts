import * as express from "express"
import { Instance } from "../singletons/instance";

export default (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Instance.setInstance('random value');
    next();
}