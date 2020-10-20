const output = document.getElementById('output');
const handle = document.getElementById('handle');
const message = document.getElementById('message');
const send = document.getElementById('send');
const feedback = document.getElementById('feedback')

const socket = io.connect('http://localhost:3000');


send.addEventListener('click', () =>{
    socket.emit('chat', {
        handle: handle.value,
        message: message.value
    })
    message.value = '';
})

message.addEventListener('keypress', () => {
    socket.emit('typing', {handle: handle.value})
})

socket.on('chat', (data) => {
    output.innerHTML += '<p><strong>' + data.handle + '</strong>: ' + data.message + '</p>';
    feedback.innerHTML = '';
})

socket.on('typing', (data) => {
    feedback.innerHTML = '<p><em>' + data.handle + ' is typing...</em></p>';
})