const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

// io.on('connection', (socket) => {
//   socket.on('message', doSomething);
// });

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('message', (message) => { 
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
   });
  socket.on('newUser', (user) => { 
    console.log('Oh, new user has arrived! Welcome ' + user.name );
    users.push(user);
    socket.broadcast.emit('newUserArrived', `${user.name} has joined the conversation!`);
   });
  socket.on('disconnect', () => { 
    console.log('Oh, socket ' + socket.id + ' has left');
    users.forEach(user => {
      const index = users.indexOf(user);
      user.id === socket.id && users.splice(index, 1);
      socket.broadcast.emit('userHasLeft', `${user.name} has left the conversation...`);
    });
  });
  console.log('I\'ve added a listener on message event \n');
});