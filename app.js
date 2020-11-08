const express = require('express');
const socket = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
var port = process.env.PORT || 3000;

//Store connected Users
var users = {}

//Funtion to get users online in a room
function getUsers(arr){
    onlineUsers = []
    arr.forEach((onlineUser) => {
        onlineUsers.push(Object.values(onlineUser)[0])
    })
    return onlineUsers
}

//Render Index page
app.get('/', (req, res) => {
    res.render('index')
})

//Get username and roomname from form and pass it to room
app.post('/room', (req, res) => {
    roomname = req.body.roomname;
    username = req.body.username;
    res.redirect(`/room?username=${username}&roomname=${roomname}`)
})

app.get('/room', (req, res)=>{
    res.render('room')
})

//Start Server
const server = app.listen(port, () => {
    console.log(`Server Running on ${port}`)
})

const io = socket(server);

//Socket connection
io.on('connection', (socket) => {

    socket.on('joined-user', (data) =>{
        //Storing users connected in a room in memory
        var user = {};
        user[socket.id] = data.username;
        if(users[data.roomname]){
            users[data.roomname].push(user);
        }
        else{
            users[data.roomname] = [user];
        }
        
        //Joining the Socket Room
        socket.join(data.roomname);

        //Emitting New Username to Clients
        io.to(data.roomname).emit('joined-user', {username: data.username});

        //Send online users array
        io.to(data.roomname).emit('online-users', getUsers(users[data.roomname]))
    })

    //Emitting messages to Clients
    socket.on('chat', (data) =>{
        io.to(data.roomname).emit('chat', {username: data.username, message: data.message});
    })

    //Broadcasting the user who is typing
    socket.on('typing', (data) => {
        socket.broadcast.to(data.roomname).emit('typing', data.username)
    })

    //Remove user from memory when they disconnect
    socket.on('disconnecting', ()=>{
        var rooms = Object.keys(socket.rooms);
        var socketId = rooms[0];
        var roomname = rooms[1];
        users[roomname].forEach((user, index) => {
            if(user[socketId]){
                users[roomname].splice(index, 1)
            }
        });

        //Send online users array
        io.to(roomname).emit('online-users', getUsers(users[roomname]))
    })
})
