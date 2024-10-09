const express = require("express")
const { WebSocketServer } = require("ws")
const app = express()

app.use(express.static("public"))
const port=process.env.PORT || 8000;

app.listen(8000, () => {
  console.log(`Example app listening on port 8000`)
})


const wss = new WebSocketServer({ port: 8001 })

wss.broadcast = (message) => {
    wss.clients.forEach((client) => {
      client.send(message);
    });
  };
  
  wss.on("connection", (ws, request) => {
    // 새로운 클라이언트가 연결되었을 때 메시지 전송
    const welcomeMessage = `새로운 유저가 접속했습니다. 현재 유저 ${wss.clients.size} 명`;
    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(welcomeMessage);
        }
    });

    // 메세지 수신
    ws.on("message", (data) => {
        wss.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
                client.send(data.toString());
            }
        });
    });

    // 클라이언트가 연결을 종료할 때
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
