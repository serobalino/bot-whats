const axios = require('axios');
const fs = require('fs');

const grupoId = "120363104259665759@g.us";
let respondidos = [];
const listenMessages = (client) => {
    client.onMessage((message) => {
        if(message?.from!==grupoId){
            const flag = respondidos.find(i=>i===message.from);
            const nrm = message.from.split('@');
            if(message?.type==='chat'){
                client.sendText(
                    grupoId,
                    nrm[0] + "\n\n" + message.content
                )
            }
            if(!flag){
                const nrm = message.from.split('@');
                client.reply(
                    message.from,
                    '🤖 Mi ser Bender insertar viga por favor (este número es de un robot).\n Tu mensaje ha sido envíado a un humano pronto te van a responder.\n\n Ten un buen día 🌈',
                    message.id
                ).then(()=>{
                    respondidos.push(message.from)
                });
            }
        }else{
            if(message?.quotedMsg && message.type==='chat'){
                const nrm = message.quotedMsg.body.split('\n\n');
                if(nrm[0]>0){
                    client.sendText(
                        nrm[0]+"@c.us",
                        message.content
                    )
                }
            }
        }
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
