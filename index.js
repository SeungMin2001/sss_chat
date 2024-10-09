const chatLog = document.getElementById('chat-log');
const inputField = document.getElementById('chat-input-field');
const sendButton = document.getElementById('send-button');

const ws = new WebSocket('ws://localhost:3000');

// 닉네임 설정
const nickname = prompt('닉네임을 입력하세요:');

// 서버 연결이 열렸을 때, 닉네임을 서버로 전송
ws.onopen = () => {
    ws.send(JSON.stringify({ type: 'set_nickname', nickname: nickname }));
};

// 서버로부터 메시지를 받았을 때 처리
ws.onmessage = (event) => {
    const message = JSON.parse(event.data);

    // 매칭 또는 대기 메시지 표시
    if (message.type === 'match' || message.type === 'waiting') {
        const systemMessageElement = document.createElement('p');
        systemMessageElement.textContent = message.message;
        systemMessageElement.style.color = 'gray'; // 시스템 메시지는 회색으로 표시
        chatLog.appendChild(systemMessageElement);
    }

    // 채팅 메시지 표시
    if (message.type === 'chat_message') {
        const messageElement = document.createElement('p');
        messageElement.textContent = `${message.nickname}: ${message.text}`;
        chatLog.appendChild(messageElement);
        chatLog.scrollTop = chatLog.scrollHeight; // 스크롤 자동 하단 이동
    }
};

// 메시지 전송 기능 (버튼 클릭 시)
sendButton.onclick = () => {
    sendMessage();
};

// Enter 키를 눌렀을 때도 메시지를 전송할 수 있게 추가
inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// 메시지를 서버로 전송하고, 내 화면에 추가하는 함수
function sendMessage() {
    const text = inputField.value;
    if (text) {
        // 서버로 메시지 전송
        ws.send(JSON.stringify({ type: 'chat_message', text: text }));

        // 내 화면에 내가 보낸 메시지 추가
        const messageElement = document.createElement('p');
        messageElement.textContent = `${nickname}: ${text}`;
        messageElement.style.color = 'lightgreen'; // 내가 보낸 메시지는 다른 색으로 표시
        chatLog.appendChild(messageElement);
        chatLog.scrollTop = chatLog.scrollHeight; // 스크롤 자동 하단 이동

        // 입력 필드 비우기
        inputField.value = '';
    }
}
