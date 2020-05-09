'use strict';

var apiai = require('apiai'); // the package to provide cloud sevices for chatbot service
var APIAI_TOKEN =apiai("90c37ae6f33e408db11a58d2ea0ae19e"); // This is my API token key
const APIAI_SESSION_ID = "ai-chat-bot-kbxqxv"; // This is the API session ID

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/views')); // This is the HTML component
app.use(express.static(__dirname + '/files')); // These contain JS,CSS and images

const server = app.listen(process.env.PORT || 3000, () => { // I am using the port 5000 to start the server
  console.log('Server listening on port %d ', server.address().port);
});

const io = require('socket.io')(server);
io.on('connection', function(socket){
  console.log('a user connected');
});



// Web UI
app.get('/', (req, res) => { // Here i am sending the file for the frontend.  
  res.sendFile('index.html'); // We could also use EJS package and render it directly
});

io.on('connection', function(socket) {
  socket.on('chat message', (text) => {
    console.log('Message: ' + text);

    // Get a reply from API.ai

    let apiaiReq = APIAI_TOKEN.textRequest(text, {
      sessionId: APIAI_SESSION_ID
    });

    apiaiReq.on('response', (response) => { // similar to  try and  catch response
      let aiText = response.result.fulfillment.speech;
      console.log('Bot reply: ' + aiText);
      socket.emit('bot reply', aiText);
    });

    apiaiReq.on('error', (error) => {
      console.log(error);
    });

    apiaiReq.end();

  });
});
