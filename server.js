const express = require("express")
const { WebSocketServer } = require("ws")
const app = express()

app.use(express.static("public"))

const PORT = process.env.PORT || 8000; // 3000은 로컬 개발 시 사용할 포트
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const wss=new WebSocketServer({port:process.env.PORT || 8001});

// HTTP 서버 생성
//const server = http.createServer(app);

// HTTP 서버와 동일한 포트로 WebSocket 서버 실행


wss.broadcast = (message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(message);
      }
    });
};
  
wss.on("connection", (ws, request) => {
    const welcomeMessage = `새로운 유저가 접속했습니다. 현재 유저 ${wss.clients.size} 명`;
    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(welcomeMessage);
        }
    });

    ws.on("message", (data) => {
        wss.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
                client.send(data.toString());
            }
        });
    });

    ws.on("close", () => {
        const goodbyeMessage = `유저 한명이 떠났습니다. 현재 유저 ${wss.clients.size} 명`;
        wss.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
                client.send(goodbyeMessage);
            }
        });
    });

    console.log(`새로운 유저 접속: ${request.socket.remoteAddress}`);
});

