const axios = require('axios');
const fs = require('fs');

const grupoId = "120363104259665759@g.us";
const listenMessages = (client) => {
    client.onMessage((message) => {
        if(!message?.author){
            const nrm = message.from.split('@');
            client.reply(
                message.from,
                '🤖 Mi ser Bender insertar viga por favor (este número pertenece a un robot, en caso de que tengas alguna duda por favor escribe a Liss: 0997380157)\n\n Ten un buen día🌈',
                message.id
            );
            if(message?.content){
                client.sendText(
                    grupoId,
                    nrm[0] + "\n\n" + message.content
                )
            }
        }
        //todo else respuesta en grupo responder a la persona q escribio

        // const separateLines = message.body.split(/\r?\n|\r|\n/g);
        // if(separateLines>=3) {
        //     if(separateLines[0]==="Perro" && separateLines[1]>0){
        //         let aux = message.body.replace(separateLines[0], "");
        //         aux = aux.replace(separateLines[1], "");
        //         client.sendText(separateLines[1]+'@c.us', aux);
        //     }
        // }else{
        //     client.sendText('593995764837@c.us',message.from+"\n"+message.body)
        // }
    })
};

const codeB64 = async (url) => {
    try {
        const response = await axios.get(url, {responseType: 'arraybuffer'});

        if (response.status === 200) {
            const contentType = response.headers['content-type'];
            const dataBuffer = Buffer.from(response.data, 'binary');
            return `data:${contentType};base64,${dataBuffer.toString('base64')}`;
        } else {
            throw "Error al decodificar imagen de " + url
        }
    } catch (error) {
        throw error
    }
}

const validarParametros = (parametros) => {
    return (req, res, next) => {
        for (const param of parametros) {
            const { nombre, tipo } = param;
            if (!(nombre in req.body) || typeof req.body[nombre] !== tipo) {
                return res.status(422).json({val:false, response: `El parámetro ${nombre} es obligatorio y debe ser de tipo ${tipo}` });
            }
        }
        next();
    };
};

module.exports = {
    listenMessages,
    codeB64,
    validarParametros
};
