import * as express from 'express';

export default (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(200);
    res.send(`
    <script>
        switch(window.location.hash){
            case "#1":
                document.write('<div><p style="color:red">The given password and username combination do not match</p></div>');
                break;
            default:
        }
    </script>
    <h1>Login please</h1>
    <form method="POST">
    <input type="text" name="username" placeholder="Emailadres" class="mainInputField" />
    <input type="password" name="password" placeholder="Wachtwoord" class="mainInputField" />
    <div class="inlineBottomRow">
        <div class="buttonContainer">
            <input type="submit" value="Inloggen" class="mainButton" />
        </div>
    </div>
<form>`);
}
