require('dotenv/config');
const express = require('express');
const venom = require("venom-bot");
const {listenMessages, codeB64, validarParametros} = require("./Controllers/messages");
const app = express();
let clienteVenom = null;

const PORT = process.env.PORT || 3000;

function start(client) {
    clienteVenom = client;
    listenMessages(client);
}

app.use(express.json());

app.get('/init', async function (req, res, next) {
    if (!clienteVenom) {
        await venom.create({
            session: 'bot' //name of session
        }).then((client) => {
            start(client)
            res.send('Instancia lista: ' + new Date());
        }).catch((e) => console.log('Error al crear instacia', e));
    } else {
        res.send('Ya tienes iniciada una sesión');
    }
});

app.post('/convert', async function ({body}, res) {
    const aux = await codeB64(body.path);
    res.status(200).send('<img src="' + aux + '"/>');
});

app.post('/send', (req, res, next) => {
    const tipo = req.query?.tipo;

    let parametros;
    let funcion;

    switch (tipo) {
        case 'imagen':
            parametros = [
                {nombre: 'numero', tipo: 'string'},
                {nombre: 'archivo', tipo: 'string'},
                {nombre: 'url', tipo: 'string'},
                {nombre: 'texto', tipo: 'string'},
            ];
            funcion = fnImg;
            break;
        case 'ubicacion':
            parametros = [
                {nombre: 'numero', tipo: 'string'},
                {nombre: 'latitud', tipo: 'number'},
                {nombre: 'longitud', tipo: 'number'},
                {nombre: 'titulo', tipo: 'string'},
            ];
            funcion = fnUbi;
            break;
        case 'boton':
            parametros = [
                {nombre: 'numero', tipo: 'string'},
                {nombre: 'titulo', tipo: 'string'},
                {nombre: 'subtitulo', tipo: 'string'},
                {nombre: 'botones', tipo: 'object'},
            ];
            funcion = fnBtn;
            break;
        default:
            parametros = [
                {nombre: 'numero', tipo: 'string'},
                {nombre: 'contenido', tipo: 'string'},
            ];
            funcion = fnTexto;
            break;
    }
    validarParametros(parametros)(req, res, () => {
        funcion(req, res);
    });
});

const fnTexto = (req, res) => {
    const {numero, contenido} = req.body;
    const parametros = [numero + '@c.us', contenido];
    enviarDatos(req, res, clienteVenom, 'sendText', parametros);
};

const fnImg = (req, res) => {
    const {numero, archivo, url, texto} = req.body;
    const parametros = [numero + '@c.us', url, archivo, texto];
    enviarDatos(req, res, clienteVenom, 'sendImage', parametros);
};

const fnUbi = (req, res) => {
    const {numero, latitud, longitud, titulo} = req.body;
    const parametros = [numero + '@c.us', latitud, longitud, titulo];
    enviarDatos(req, res, clienteVenom, 'sendLocation', parametros);
};

const fnBtn = (req, res) => {
    const {numero, titulo, subtitulo, botones} = req.body;
    const btnObj = botones.map((palabra, indice) => {
        return {
            buttonId: (indice + 1).toString(), // Puedes asignar un ID único a cada botón
            buttonText: {
                displayText: palabra,
            },
            type: 1,
        };
    });
    const parametros = [numero + '@c.us', titulo, btnObj, subtitulo];
    enviarDatos(req, res, clienteVenom, 'sendButtons', parametros);
};
const enviarDatos = (req, res, clienteVenom, metodo, parametros) => {
    if (clienteVenom) {
        clienteVenom[metodo](...parametros)
            .then(response => {
                res.status(200).send({val: true, response: response});
            })
            .catch(error => {
                res.status(403).send({val: false, response: error});
            });
    } else {
        res.status(433).send({val: false, response: "No están levantados los servicios"});
    }
};


app.listen(PORT, function () {
    console.log('Está arriba la aplicación! {' + PORT + '} ');
});
