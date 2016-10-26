var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = [];

app.get('/', function (request, response) {
  response.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.on('new user', function (username) {
    users.push(username);
    socket.username = username;
    io.emit('user connected', {username: username});
    updateUsers();
  });

  socket.on('chat message', function (message) {
    socket.broadcast.emit('chat message', {
      message: message,
      username: socket.username
    });
  });

  socket.on('disconnect', function (data) {
    users.splice(users.indexOf(socket.username), 1);

    io.emit('user disconnected', {username: socket.username});
    updateUsers();
  });

  function updateUsers() {
    io.emit('get users', users);
  }
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
