require('dotenv/config');
const express = require('express');
const {listenMessages} = require("./Controllers/messages");
const {response} = require("express");
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
        console.log(123)
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
