
const listenMessages = (client) => {
    client.onMessage((message) => {
        const separateLines = message.body.split(/\r?\n|\r|\n/g);
        if(separateLines>=3) {
            if(separateLines[0]==="Perro" && separateLines[1]>0){
                let aux = message.body.replace(separateLines[0], "");
                aux = aux.replace(separateLines[1], "");
                client.sendText(separateLines[1]+'@c.us', aux);
            }
        }else{
            client.sendText('593995764837@c.us',message.from+"\n"+message.body)
        }
    })
};

module.exports = {
    listenMessages,
};
