const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require("socket.io")(server,  {origins: '*:*'});

if (process.env.NODE_ENV == "production") {
    console.log('adding the following middleware...');
    app.use((req, res, next) => {
        console.log('req.headers: ',req.headers);
        if (req.headers["x-forwarded-proto"].startsWith("https")) {
            return next();
        }
        res.redirect(`https://${req.hostname}${req.url}`);
    });
}

app.use(express.static('public'));

console.log('process.env.NODE_ENV: ',process.env.NODE_ENV);


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

server.listen(process.env.PORT || 8080, () => console.log("server up and running!"));
