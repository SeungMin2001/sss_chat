const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 3000 });
let clients = [];

server.on('connection', (ws) => {
    // 새 클라이언트 연결 시 클라이언트 배열에 추가
    clients.push(ws);

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        // 닉네임 설정
        if (data.type === 'set_nickname') {
            ws.nickname = data.nickname;
            // 사용자에게 대기 메시지 전송
            ws.send(JSON.stringify({ type: 'waiting', message: '다른 사용자를 기다리고 있습니다...' }));
            matchClients(ws);
        } else if (data.type === 'chat_message') {
            // 모든 클라이언트에게 메시지 전송
            broadcastMessage(data);
        }
    });

    ws.on('close', () => {
        // 클라이언트가 연결을 종료할 때 클라이언트 배열에서 제거
        clients = clients.filter(client => client !== ws);
    });
});

// 두 클라이언트를 매칭하는 함수
function matchClients(newClient) {
    if (clients.length >= 2) {
        const partner = clients.find(client => client !== newClient);
        if (partner) {
            // 두 클라이언트에게 매칭 메시지 전송
            newClient.send(JSON.stringify({ type: 'match', message: `당신은 ${partner.nickname}와 연결되었습니다.` }));
            partner.send(JSON.stringify({ type: 'match', message: `당신은 ${newClient.nickname}와 연결되었습니다.` }));
        }
    }
}

// 모든 클라이언트에게 메시지를 전송하는 함수
function broadcastMessage(data) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'chat_message', nickname: data.nickname, text: data.text }));
        }
    });
}

console.log('WebSocket 서버가 3000번 포트에서 실행 중입니다.');
