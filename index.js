require('dotenv/config');
const express = require('express');
const {listenMessages} = require("./Controllers/messages");
const app = express();
let clienteVenom = null;

const PORT = process.env.PORT || 3000;

function start(client) {
    clienteVenom = client;
    listenMessages(client);
}

function validacionMSG(body,res) {
    if(body){
        if(body.numero && body.mensaje){
            return body;
        }else{
            res.status(403).send({response:"No hay numero o mensaje"});
            return false;
        }
    }else{
        res.status(403).send({response:"No hay parametros"});
        return false;
    }
}

function validateIMG(body,res) {
    if(validacionMSG(body,res)){
        if(body.path && body.archivo){
            return body;
        }else{
            res.status(403).send({response:"No hay numero o mensaje"});
            return false;
        }
    }else{
        return false
    }
}

app.use(express.json());

app.get('/init', async function (req, res) {
    if(!clienteVenom){
        try{
            const venom = require("venom-bot");
        }catch (e) {
            console.log(e);
        }
        let aux = await venom.create(
            'session',
            (base64Qr, asciiQR, attempts, urlCode) => {
                const matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};
                if (matches.length !== 3) {
                    return new Error('Invalid input string');
                }
                response.type = matches[1];
                response.data = new Buffer.from(matches[2], 'base64');
                res.writeHead(200, {
                    'Content-Type': matches[1],
                    'Content-Length': response.data.length
                });
                res.end(response.data);

            },
            (statusSession, session) => {
                console.log('Status Session: ', statusSession);
                console.log('Session name: ', session);
            },
            {logQR: false}
        ).then((client) => {
            start(client)
            res.send('Ready!!!! '+ new Date());
        }).catch((e)=>console.log('Error al crear instacia',e));
    }else{
        res.send('Ya tienes iniciada una sesión');
    }
});

app.post('/send', function ({body}, res) {
    if(clienteVenom){
        const aux = validacionMSG(body, res);
        clienteVenom.sendText(aux.numero+'@c.us', aux.mensaje).then(response=>{
            res.status(595).send({val: true, response:response});
        }).catch(error=>{
            res.status(401).send({val: false, response:error});
        });
        return  true;
    }
    res.status(595).send({val: false,response:"No esta levantado los servicios"});
    return false;
});


app.post('/sendImg', function ({body}, res) {
    if(clienteVenom){
        const aux = validateIMG(body, res);
        clienteVenom.sendImage(aux.numero+'@c.us', aux.path,aux.archivo,aux.mensaje).then(response=>{
            res.status(595).send({val: true, response:response});
        }).catch(error=>{
            res.status(401).send({val: false, response:error});
        });
        return  true;
    }
    res.status(595).send({val: false,response:"No esta levantado los servicios"});
    return false;
});

app.listen(PORT, function () {
    console.log('Está arriba la aplicación! {'+PORT+'} ');
});
