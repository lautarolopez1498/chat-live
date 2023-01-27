const socket = io();
console.log('hola mundo desde cliente');

let user;

Swal.fire({
  icon: 'success',
  title: 'Iniciar sesión',
  text: 'Para acceder debes estar autenticado',
  confirmButtonText: 'Aceptar',
  allowOutsideClick: false,
  input: 'text',
  inputLabel: 'Ingresa tu nombre',
  inputValidator: (value) => {
    if (!value) {
      return 'Debes ingresar al menos un carácter'
    }
    user = value;
  },
}).then((result) => {
  socket.emit('newUser', {user: result.value});
  socket.on('newUser', (data) => {
    Swal.fire({
      title: 'Nuevo usuario conectado',
      text: `${data.user} se ha conectado`,
      toast: true,
      position: 'top-right',
    })
  })
  value = result.value
});


socket.on('history', (data) => {
  let history = document.getElementById('history')
  console.log(data);
  data.forEach(element => {
    history.innerHTML += `<div class="${data.user == user ? 'myMessage' : ''}">
                            <p><strong>${element.user}:</strong> ${element.message}</p>
                          </div>`
  });
})

const chatBox = document.getElementById('chatBox')
chatBox.addEventListener('keyup', (e) => {
  if (e.key == 'Enter' && e.target.value != '' ) {
    let message = e.target.value;
    socket.emit('message', {
      user,
      message
    });
    e.target.value = '';
  }
})


socket.on('message', (data) => {
  let history = document.getElementById('history')
  history.innerHTML += `<div class="${data.user == user ? 'myMessage' : ''}"><p><strong>${data.user}:</strong> ${data.message}</p></div>`
})