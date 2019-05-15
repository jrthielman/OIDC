import * as express from 'express';

export default (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(200);
    res.send(`
    <script>
        switch(window.location.hash){
            case "#1":
                document.write('<div><p style="color:red">You must provide a 2FA code</p></div>');
                break;
            default:
        }
    </script>
    <h1>Two way authentication</h1>
    <form method="POST">
    <input type="text" name="twoFactor" placeholder="2FA Code" />
    <input type="submit" value="Submit" />
    <form>`
    );
}