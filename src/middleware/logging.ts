import * as express from 'express'

export default (req: express.Request, res: express.Response, next: express.NextFunction) => {

    const body = JSON.stringify(res.locals.data.body);
    
    if (body && body.length > 2) {
        const type = res.locals.data.type;
        const method = req.method;
        const referer = req.headers['referer'];
        let oldValue: string;
        let newValue: string;

        const isDelete = method === 'DELETE';
        const isPost = method === 'POST';
        const isPut = method === 'PUT';

        if (isPut) {
            oldValue = JSON.stringify(res.locals.data.body.old);
            newValue = JSON.stringify(res.locals.data.body.new);
        }

        console.log(`${method} request was done at ${referer}. The following ${isDelete ? `was removed: ${body}` :
            isPost ? `was added: ${body}` : isPut ? `was changed from: ${oldValue} to ${newValue}` :
                `${type === 'list' ? 'items were' : 'item was'} requested: ${body}`}`);

        if (type === 'list') {
            console.log("list size: " + res.locals.data.size);
        }
    }

    next();
}
