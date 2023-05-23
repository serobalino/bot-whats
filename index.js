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

app.listen(PORT, function () {
    console.log('Está arriba la aplicación! {'+PORT+'} ');
});
