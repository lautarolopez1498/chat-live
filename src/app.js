// Imports
const express = require('express');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const routerViews = require('./router/views.router');

const app = express();

// Server
const httpServer = app.listen(8080, () => {
  console.log('server is running on port 8080');
});

// Socket
const io = new Server(httpServer);

const messages = [];

io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado');

  socket.on('newUser', (data) => {
    socket.broadcast.emit('newUser', data)
  })

  socket.emit('history', messages)

  socket.on('message', (data) => {
    messages.push(data);
    io.emit('message', data)
  })
});

// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Middleware
app.use(express.static(__dirname + '/public'));

// Ruta
app.use('/', routerViews);
