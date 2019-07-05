export default (ctx, error) => {
    ctx.type = 'html';
    ctx.body = `

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Toegang.org</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
   <meta name="description" content="Toegang.org geeft je toegang tot je leermiddelen">
    <meta name="keywords" content="toegang,leermiddelen,beschikbaarheid">
    <meta name="robots" content="all">
    <meta http-equiv="Content-Language" content="nl_NL">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:site" content="Toegang.org">
    <meta name="twitter:title" content="Toegang.org">
    <meta name="twitter:description" content="Toegang.org geeft je toegang tot je leermiddelen!">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300" rel="stylesheet">
    <style>
    .mainButton,
    a {
        text-decoration: none
    }
    
    h1 {
        font-size: 20px;
        margin: 5px 0
    }
    
    .mainButton {
        background-color: teal;
        border: none;
        color: #fff;
        padding: 13px 20px;
        text-align: center;
        display: inline-block;
        font-size: 16px;
        border-radius: 5px;
        cursor: pointer;
        transition: all .3s ease 0s
    }
    
    button:hover {
        opacity: .8
    }
    
    button:active {
        opacity: .6
    }
    
    .mainInputField {
        width: 100%;
        padding: 10px;
        margin: 10px 0;
        box-sizing: border-box;
        border-radius: 5px;
        border: 1px solid #c5e4f2
    }
    
    .bottomRow {
        padding: 10px 0 20px;
        position: absolute;
        bottom: 0px;
        width: 100%;
    }
    
    .inlineBottomRow {
        padding: 10px 0 20px;
        position: absolute;
        bottom: 0px;
        width: 450px;
    }
    
    .supportTextContainer {
      width: 100%;
      text-align: center;
    }
    
    .supportTextContainer > p {
        margin: 8px 0;
    }
    
    /* Footer styling */
    .supportBottomRow {
      padding: 2px 25px 10px 25px;
      height: 80px;
    }
    
    .meldcode {
      font-size: small;
      font-family: "Courier New", Courier, monospace;
    }
    
    .buttonContainer {
        display: flex;
        flex-direction: row-reverse
    }
    
    .buttonContainer>button {
        margin-left: 10px
    }
    
    body {
        font-family: 'Dosis', sans-serif;
        background-color: #008080;
    }
    
    .app {
        width: 50%;
        max-width: 500px;
        min-width: 375px;
        min-height: 500px;
        background: #FFF;
        border-radius: 15px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .5);
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%)
    }
    
    .appContainer:before{
        content: "";
        position: fixed;
        margin: -10px;
        padding: 10px;
        left: 0;
        right: 0;
        z-index: -1;
        display: block;
        width: 100%;
        height: 100%;
        background: grey;
        background-size:cover;
        -webkit-filter: blur(5px);
        -moz-filter: blur(5px);
        -o-filter: blur(5px);
        -ms-filter: blur(5px);
        filter: blur(5px);
    
    }
    
    .contentContainer {
        padding: 10px 25px
    }
    
    a {
        color: #ff7f7f
    }
    
    .topRow {
        padding: 25px 25px 10px;
        height: 30px
    }
    
    .headerImage {
        height: 20px;
        width: 130px
    }
    
    .headerImageContainer {
        float: left
    }
    
    .contentDivider {
        border: 0;
        height: 0;
        border-top: 1px solid rgba(0, 0, 0, .1);
        border-bottom: 1px solid rgba(255, 255, 255, .2);
        margin: 0 5px
    }
    
    .errorMessageContainer {
        text-align: center;
    }
    
    .errorMessage {
        color: #ff0000;
        font-weight: bold;
    }
    
    </style>
</head>
<body>
<div class="appContainer">
    <div id="app">
        <div class="app">
            <hr class="contentDivider" />
            <div class="contentContainer">
                <h1>Er is iets misgegaan</h1>
                <div class="errorMessageContainer">
                    <div>
                        ${new Date().toLocaleTimeString()}
                        ${new Date().toLocaleDateString()}
                    </div>
                    <p><span class="errorMessage">${error['error_description']}</span></p>
                </div>
            </div>
            <div class='bottomRow'>
            </div>
        </div>
    </div>
</div>

</body>
</html>
`;
}
