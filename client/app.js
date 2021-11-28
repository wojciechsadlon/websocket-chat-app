const loginForm = document.querySelector('#welcome-form');
const messagesSection = document.querySelector('#messages-section');
const messagesList = document.querySelector('#messages-list');
const addMessageForm = document.querySelector('#add-messages-form');
const userNameInput = document.querySelector('#username');
const messageContentInput = document.querySelector('#message-content');
const socket = io();

socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('newUserArrived', (content) => addMessage('chatBot', content));
socket.on('userHasLeft', (content) => addMessage('chatBot', content));

let userName = '';

loginForm.addEventListener('submit', function login(e){
  e.preventDefault();

  if(!userNameInput.value) alert('Please enter name');
  else {
    userName = userNameInput.value;
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
    socket.emit('newUser', {name: userName, id: socket.id});
  }
});

addMessageForm.addEventListener('submit', function sendMessage(e){
  e.preventDefault();

  if(!messageContentInput.value) alert('Sorry, nothing to send!')
  else{
    addMessage(userName, messageContentInput.value);
    socket.emit('message', { author: userName, content: messageContentInput.value });
    messageContentInput.value = '';
  }
})

const addMessage = (author, content) => {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');

  if(author === userName){
    message.classList.add('message--self');
  };

  if(author === 'chatBot'){
    message.classList.add('chatBot');
  };

  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author }</h3>
    <div class="message__content">
      ${content}
    </div>
  `;

  messagesList.appendChild(message);
}