const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require("socket.io")(server,  {origins: '*:*'});

app.use(express.static('public'));

io.on('connection', function(socket) {
    console.log(`socket with the id ${socket.id} is now connected`);

    
    socket.on('pokemon to add', ({id}) => {
        console.log('id: ',id);
        io.emit('pokemon from server', {id});
    });
    
    socket.on('disconnect', function() {
        console.log(`socket with the id ${socket.id} is now disconnected`);
    });
});

server.listen(8080, () => console.log("server up and running..."));