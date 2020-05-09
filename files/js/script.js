'use strict';// This is done to avoid declaring undeclared variables

const socket = io(); // this is the package to faciliate 2 way comms between client and server

const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition(); // Here I am creating a instance of the class SpeechRecognition

recognition.lang = 'en'; // This is input language, Im using English,India
recognition.interimResults = false;
recognition.maxAlternatives = 1;

document.querySelector('button').addEventListener('click', () => {
  recognition.start();
});

recognition.addEventListener('speechstart', () => { // This is one should there is a speech detected
  console.log('Speech has been detected.'); 
});

recognition.addEventListener('result', (e) => { // Same as when a valuid search query has been fetched
  console.log('Result has been detected.');

  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;

  outputYou.textContent = text;
  console.log('Confidence: ' + e.results[0][0].confidence);

  socket.emit('chat message', text);
});

recognition.addEventListener('speechend', () => {
  recognition.stop();
});

recognition.addEventListener('error', (e) => {
  outputBot.textContent = 'Error: ' + e.error;
});

function synthVoice(text) { // This is the main function to modify the properties of speech

  

  const synth = window.speechSynthesis;

  var voices = synth.getVoices();



  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;

  utterance.voice=voices[5];
 

  synth.speak(utterance);
}

socket.on('bot reply', function(replyText) {
  synthVoice(replyText);

  if(replyText == '') replyText = '(No answer...)';
  outputBot.textContent = replyText;
});
