const express = require('express');
const socket = require('socket.io');

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
})

<<<<<<< HEAD
const server = app.listen(proccess.env.PORT || 3000, () => {
=======
const server = app.listen(80, () => {
>>>>>>> de782a6e6e973db2cd63c7a4d8ba851b376262c9
    console.log('Server Running')
})

const io = socket(server);

io.on('connection', (socket) => {
    socket.on('chat', (data) =>{
        io.sockets.emit('chat', data);
    })

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data)
    })
})
