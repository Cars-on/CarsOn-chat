/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */

// const e = require("cors");

// eslint-disable-next-line no-undef
const socket = io('http://localhost:9999');

let idChatRoom = '';

function onloadPage() {
  const defaultAvatar =
    'https://www.seekpng.com/png/detail/428-4287240_no-avatar-user-circle-icon-png.png';
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('name');
  const email = urlParams.get('email');
  const ad_owner_name = urlParams.get('ad_owner_name');
  const ad_owner_email = urlParams.get('ad_owner_email');

  socket.emit('start', {
    name,
    avatar: defaultAvatar,
    email,
  });

  if (ad_owner_email && ad_owner_name) {
    socket.emit('start', {
      name: ad_owner_name,
      avatar: defaultAvatar,
      email: ad_owner_email,
    });
  }
}

function onLoad() {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('name');
  const email = urlParams.get('email');

  const defaultAvatar =
    'https://www.seekpng.com/png/detail/428-4287240_no-avatar-user-circle-icon-png.png';

  document.querySelector('.user_logged').innerHTML += `
    <img
      class="avatar_user_logged"
      src=${defaultAvatar}
    />
    <strong id="user_logged">${name}</strong>
  `;

  socket.on('new_users', user => {
    const existInDiv = document.getElementById(`user_${user._id}`);

    if (!existInDiv) {
      addUser(data);
    }
  });

  socket.emit('get_users', users => {
    users.map(user => {
      if (user.email !== email) {
        addUser(user);
      }
    });
  });

  socket.on('message', data => {
    if (data.message.roomId === idChatRoom) {
      addMessage(data);
    }
  });

  socket.on('notification', data => {
    const user = document.getElementById(`user_${data.from._id}`);
    if (data.roomId !== idChatRoom) {
      user.insertAdjacentHTML(
        'afterbegin',
        `
      <div class="notification"></div>`,
      );
    }
  });
}

function addMessage(data) {
  const divMessageUser = document.getElementById('message_user');
  divMessageUser.innerHTML += `
  <span class="user_name user_name_date">
      <img
        class="img_user"
        src=${data.user.avatar}
      />
      <strong> ${data.user.name} &nbsp; </strong>
      <span>  ${dayjs(data.message.created_at).format(
        'DD/MM/YYYY HH:mm',
      )} </span></span
    >
    <div class="messages">
      <span class="chat_message"> ${data.message.text}</span>
    </div>
  `;
}

function addUser(user) {
  const usersList = document.getElementById('users_list');
  usersList.innerHTML += `
    <li
      class="user_name_list"
      id="user_${user._id}"
      idUser="${user._id}"
    >
      <img
        class="nav_avatar"
        src=${user.avatar}
      />
      ${user.name}
    </li>
  `;
}

document.getElementById('users_list').addEventListener('click', e => {
  const inputMessage = document.getElementById('user_message');
  inputMessage.classList.remove('hidden');

  document
    .querySelectorAll('li.user_name_list')
    .forEach(itme => itme.classList.remove('user_in_focus'));

  document.getElementById('message_user').innerHTML = '';

  if (e.target && e.target.matches('li.user_name_list')) {
    const idUser = e.target.getAttribute('idUser');

    e.target.classList.add('user_in_focus');

    const notification = document.querySelector(
      `#user_${idUser} .notification`,
    );

    if (notification) {
      notification.remove();
    }

    socket.emit('start_chat', { idUser }, response => {
      idChatRoom = response.room.idChatRoom;

      response.messages.forEach(message => {
        const data = {
          message,
          user: message.to,
        };

        addMessage(data);
      });
    });
  }
});

document.getElementById('user_message').addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    const message = e.target.value;

    e.target.value = '';

    const data = {
      message,
      idChatRoom,
    };

    socket.emit('message', data);
  }
});

onLoad();
