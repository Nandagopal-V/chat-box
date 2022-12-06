const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


//get data from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
const socket = io();

//join chatroom
socket.emit('joinRoom', { username, room });

//get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRooms(room);
    outputUsers(users);
})

//message from server
socket.on('message', message => {
    console.log('msg isss');
    console.log(message);
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


//message submit 
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get msg text
    const msg = e.target.elements.msg.value;
    //emit msg to server
    socket.emit('chatMessage', msg)
    //clear input
    e.target.elements.msg.value = '';
})

//output msg to dom
outputMessage = (msg) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `		<p class="meta">      ${msg.username}
      ${msg.time}
      <span></span></p>
    <p class="text">
      ${msg.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);

}

//add rooms to dom
function outputRooms(room) {
    roomName.innerText = room;
}

//add user to dom
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join(' ')}
    `;
}







