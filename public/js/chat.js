const socket = io();

const $messageForm = document.querySelector('#message-form');
const $messageFormButton = $messageForm.querySelector('button');
const $messageFormInput = $messageForm.querySelector('input');
const $locationButton = document.querySelector('#location');
const $messages = document.querySelector('#messages');

// Templates 

const $messageTemplate = document.querySelector('#message-template').innerHTML;
const $locationTemplate = document.querySelector('#location-template').innerHTML;
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoScroll = () => {
    // Get last message sent
    const $newMessage = $messages.lastElementChild;

    // Get message height
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageBMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageBMargin;

    // Visible height 
    const visibleHeight = $messages.offsetHeight;
    // Container height
    const messagesHeight = $messages.scrollHeight;
    const scrollOffset =  $messages.scrollTop + visibleHeight;

    if (messagesHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
}

socket.on('message', message => {
    const html = Mustache.render($messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });

    $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('location', location => {
    if (location) {
        const html = Mustache.render($locationTemplate, {
            username: location.username,
            location: location.url,
            locText: 'This is my location.',
            createdAt: moment(location.createdAt).format('h:mm a')
        });
    
        $messages.insertAdjacentHTML('beforeend', html);
    }
});

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render($sidebarTemplate, {
        room,
        users
    });

    document.querySelector('#sidebar').innerHTML = html;
});

$messageForm.addEventListener('submit', e => {
    e.preventDefault();
    $messageFormButton.setAttribute('disabled', 'disabled');

    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message, error => {

    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();

        if (error) {
            return console.log(error);
        }

        console.log('Message delivered!');
    });
});

$locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Please use another browser which supports this feature.');
    }

    $locationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition(position => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, acknow => {
            console.log(acknow);
            $locationButton.removeAttribute('disabled');
        });
    });

    
});

socket.emit('join', { username, room }, error => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});