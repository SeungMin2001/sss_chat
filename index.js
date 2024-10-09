const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        // 메시지를 받은 후 다른 모든 클라이언트에 전송
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
    
    ws.send('Welcome to the chat!');
});
