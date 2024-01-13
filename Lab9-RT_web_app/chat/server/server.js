const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer,{
    // ...
});

const server = io.listen(3000);
var users = [];

server.on('connect', (socket) => {
    console.log('Connected '+ socket.id);
    //server.emit('message', 'Hello, World!');
    var nicks = users.map((user) =>user.nick);
    socket.on('login', (name) => {
        users.push({"nick":name,"socketId":socket.id});
        console.log("User logged in as: "+name);
        socket.emit('loggedIn', true);
        nicks = users.map((user) =>user.nick);
        server.emit('users',nicks)
        socket.broadcast.emit('message', name + " has connected!")
    })
    socket.on('message', (message) => {
        const currentDate = new Date();

        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const seconds = currentDate.getSeconds();

        const nick = users.filter((user)=>user.socketId == socket.id)[0].nick;
        console.log(nick+" sent "+message);
        
        const msg = `${hours}:${minutes}:${seconds} ${nick}: ${message}`;
        server.emit('message', msg) ;
    });
    socket.on('disconnect', () =>{
        const nick = users.filter((user)=>user.socketId == socket.id)[0].nick;
        users = users.filter((user)=>user.socketId != socket.id);
        nicks = users.map((user) =>user.nick);
        server.emit('users',nicks);
        server.emit('message', nick +"has disconnected.")
    })
    socket.emit('users',nicks);
});
