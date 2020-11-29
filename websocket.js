function setWebSocket(){
    const ws = new WebSocket('ws://62.217.127.19:8011');
    ws.addEventListener('open',(e)=>{
        console.log('Connection established');
    });
    ws.addEventListener('close',(e)=>{
        console.log(`Connection closed: ${e.reason}`);
    });
    ws.addEventListener('error',(e)=>{
        console.log(`Connection Error: ${e}.`);
    });
    ws.addEventListener('message',(e)=>{
        //listen websocket for data
    try {
        let data = JSON.parse(e.data);
        for (var i=0;i<data.length;i++){
            processData(data[i]);
        }
    } catch (error) {
        console.log('Invalid JSON: ', error);
        ws.send(JSON.stringify({"message":"${error}"}));
        return;
    }
});
}

			