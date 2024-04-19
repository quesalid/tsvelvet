<script lang="ts">

export let title = 'Chatter Box'
export let width = '30px'
export let height = '30px'
export let fill = '#fff'
export let avatar = 'LORENZO.png'

const userMessage = [
  ["hi", "hey", "hello"],
  ["sure", "yes", "no"],
  ["are you genious", "are you nerd", "are you intelligent"],
  ["i hate you", "i dont like you"],
  ["how are you", "how is life", "how are things", "how are you doing"],
  ["how is corona", "how is covid 19", "how is covid19 situation"],
  ["what are you doing", "what is going on", "what is up"],
  ["how old are you"],
  ["who are you", "are you human", "are you bot", "are you human or bot"],
  ["who created you", "who made you", "who is your creator"],

  [
    "your name please",
    "your name",
    "may i know your name",
    "what is your name",
    "what call yourself"
  ],
  ["i love you"],
  ["happy", "good", "fun", "wonderful", "fantastic", "cool", "very good"],
  ["bad", "bored", "tired"],
  ["help me", "tell me story", "tell me joke"],
  ["ah", "ok", "okay", "nice", "welcome"],
  ["thanks", "thank you"],
  ["what should i eat today"],
  ["bro"],
  ["what", "why", "how", "where", "when"],
  ["corona", "covid19", "coronavirus"],
  ["you are funny"],
  ["i dont know"],
  ["boring"],
  ["im tired"]
];
const botReply = [
  ["Hello!", "Hi!", "Hey!", "Hi there!"],
  ["Okay"],
  ["Yes I am! "],
  ["I'm sorry about that. But I like you dude."],
  [
    "Fine... how are you?",
    "Pretty well, how are you?",
    "Fantastic, how are you?"
  ],
  ["Getting better. There?", "Somewhat okay!", "Yeah fine. Better stay home!"],

  [
    "Nothing much",
    "About to go to sleep",
    "Can you guess?",
    "I don't know actually"
  ],
  ["I am always young."],
  ["I am just a bot", "I am a bot. What are you?"],
  ["Sabitha Kuppusamy"],
  ["I am nameless", "I don't have a name"],
  ["I love you too", "Me too"],
  ["Have you ever felt bad?", "Glad to hear it"],
  ["Why?", "Why? You shouldn't!", "Try watching TV", "Chat with me."],
  ["What about?", "Once upon a time..."],
  ["Tell me a story", "Tell me a joke", "Tell me about yourself"],
  ["You're welcome"],
  ["Briyani", "Burger", "Sushi", "Pizza"],
  ["Dude!"],
  ["Yes?"],
  ["Please stay home"],
  ["Glad to hear it"],
  ["Say something interesting"],
  ["Sorry for that. Let's chat!"],
  ["Take some rest, Dude!"]
];

const alternative = [
  "Same here, dude.",
  "That's cool! Go on...",
  "Dude...",
  "Ask something else...",
  "Hey, I'm listening..."
];

const synth = window.speechSynthesis;

function voiceControl(string) {
  let u = new SpeechSynthesisUtterance(string);
  u.text = string;
  u.lang = "en-aus";
  u.volume = 1;
  u.rate = 1;
  u.pitch = 1;
  synth.speak(u);
}

function sendMessage() {
  const inputField:any = document.getElementById("input");
  //let input:any = inputField.value.trim();
  let input:any = inputField.innerHTML.trim();
  input != "" && output(input);
  inputField.innerHTML = "";
}
document.addEventListener("DOMContentLoaded", () => {
  const inputField:any = document.getElementById("input");
  inputField.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {
      let input:any = inputField.value.trim();
      input != "" && output(input);
      inputField.value = "";
    }
  });
});

function output(input) {
  let product;

  let text = input.toLowerCase().replace(/[^\w\s\d]/gi, "");

  text = text
    .replace(/[\W_]/g, " ")
    .replace(/ a /g, " ")
    .replace(/i feel /g, "")
    .replace(/whats/g, "what is")
    .replace(/please /g, "")
    .replace(/ please/g, "")
    .trim();

  let comparedText = compare(userMessage, botReply, text);

  product = comparedText
    ? comparedText
    : alternative[Math.floor(Math.random() * alternative.length)];
  addChat(input, product);
}

function compare(triggerArray:any, replyArray:any, str:any) {
  let item;
  for (let x = 0; x < triggerArray.length; x++) {
    for (let y = 0; y < replyArray.length; y++) {
      if (triggerArray[x][y] == str) {
        let items = replyArray[x];
        item = items[Math.floor(Math.random() * items.length)];
      }
    }
  }
  //containMessageCheck(string);
  if (item) return item;
  else return containMessageCheck(str);
}

function containMessageCheck(str:any) {
  let expectedReply = [
    [
      "Good Bye, dude",
      "Bye, See you!",
      "Dude, Bye. Take care of your health in this situation."
    ],
    ["Good Night, dude", "Have a sound sleep", "Sweet dreams"],
    ["Have a pleasant evening!", "Good evening too", "Evening!"],
    ["Good morning, Have a great day!", "Morning, dude!"],
    ["Good Afternoon", "Noon, dude!", "Afternoon, dude!"]
  ];
  let expectedMessage = [
    ["bye", "tc", "take care"],
    ["night", "good night"],
    ["evening", "good evening"],
    ["morning", "good morning"],
    ["noon"]
  ];
  let item;
  for (let x = 0; x < expectedMessage.length; x++) {
    if (expectedMessage[x].includes(str)) {
      let items = expectedReply[x];
      item = items[Math.floor(Math.random() * items.length)];
    }
  }
  return item;
}
function addChat(input:any, product:any) {
  const mainDiv = document.getElementById("message-section");
  let userDiv = document.createElement("div");
  userDiv.id = "user";
  userDiv.classList.add("message");
  userDiv.innerHTML = `<span id='user-response'>${input}</span> <img class="user-avatar" src="/LORENZO.png" alt="Lorenzo"/>`;
  mainDiv.appendChild(userDiv);

  let botDiv = document.createElement("div");
  botDiv.id = "bot";
  botDiv.classList.add("message");
  botDiv.innerHTML = `<span id="bot-response">${product}</span>`;
  mainDiv.appendChild(botDiv);
  var scroll = document.getElementById("message-section");
  scroll.scrollTop = scroll.scrollHeight;
  voiceControl(product);
}
</script>

 <div class="chat-bot-box">
    <div id="header">
      <svg fill="{fill}" width="{width}" height="{height}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.928 11.607c-.202-.488-.635-.605-.928-.633V8c0-1.103-.897-2-2-2h-6V4.61c.305-.274.5-.668.5-1.11a1.5 1.5 0 0 0-3 0c0 .442.195.836.5 1.11V6H5c-1.103 0-2 .897-2 2v2.997l-.082.006A1 1 0 0 0 1.99 12v2a1 1 0 0 0 1 1H3v5c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5a1 1 0 0 0 1-1v-1.938a1.006 1.006 0 0 0-.072-.455zM5 20V8h14l.001 3.996L19 12v2l.001.005.001 5.995H5z"/>
            <ellipse cx="8.5" cy="12" rx="1.5" ry="2"/>
            <ellipse cx="15.5" cy="12" rx="1.5" ry="2"/>
            <path d="M8 16h8v2H8z"/>
      </svg>
      <h1>{title}</h1>
    </div>
    <div id="message-section">
      <div class="message" id="bot"><span id="bot-response">Hello.. I'm listening! Go on..</span></div>
    </div>
    <div id="input-section">
      <div id="input" contenteditable="true" placeholder="Type a message"  autofocus></div>
      <button class="send" on:click="{sendMessage}">
        <div class="circle"><i class="zmdi zmdi-mail-send"></i>send</div>
      </button>
    </div>
  </div>

<style>
* {
  font-size: 0.9vw;
  font-family: "Epilogue", sans-serif;
}

:global(:root) {
  --scrollbarBG: #fff;
  --thumbBG: #90a4ae;
  --backColor: #999;
  --headerBackColor: #666;
}

body {
  background: #ccc;
}
.chat-bot-box {
  height: 20vw;
  width: 20vw;
  background-color: white;
  margin-left: 30vw;
  margin-top: 1vw;
  /*box-shadow: 2vw 2vw 12vw 3vw #ccc;*/
}
.chat-bot-box #header {
  /*height: 5vw;*/
  display: flex;
  justify-content: left ;
  background: var(--headerBackColor);
  padding: 0vw;
}
.chat-bot-box #header h1 {
  color: #fff;
  font-size: 1.5vw;
  font-family: "Arial", cursive;
  padding: 0.5vw;
  margin-left: 10%;
}
.chat-bot-box #header svg {
     margin-top: 2%;
     margin-left: 2%;
     padding: 2px;
     /*border: 1px solid #fff;
     border-radius: 50%;*/
}
.chat-bot-box #message-section::-webkit-scrollbar {
  width: 10px;
}
.chat-bot-box #message-section {
  height: 20vw;
  padding: 0 1.5vw;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--thumbBG) var(--scrollbarBG);
}
.chat-bot-box #message-section::-webkit-scrollbar-track {
  background: var(--scrollbarBG);
}
.chat-bot-box #message-section::-webkit-scrollbar-thumb {
  background-color: var(--thumbBG);
  border-radius: 6px;
  border: 3px solid var(--scrollbarBG);
}
:global(.chat-bot-box #message-section #bot),
:global(.chat-bot-box #message-section #user){
  position: relative;
  bottom: 0;
  min-height: 1vw;
  border: 0.15vw solid #777;
  background-color: #fff;
  border-radius: 0px 1.5vw 1.5vw 1.8vw;
  padding: 1vw;
  margin: 0.5vw 0;
  font-size: 0.9vw;
}
:global(.chat-bot-box #message-section #user) {
  display:flex;
  border: 1.5px solid var(--backColor);
  /*border-radius: 1.5vw 0vw 1.5vw 1.8vw;*/
  border-radius: 1.5vw 1.5vw 1.5vw 1.8vw;
  background-color: var(--backColor);
  float: right;
}
:global(.chat-bot-box #message-section .message .user-avatar) {
    border: 1px solid #fff;
    border-radius: 50%;
    margin-left: 8%;
    margin-RIGHT: 8%;
    background-color: #fff;
    width:25px;
    height: 25px;
}
:global(.chat-bot-box #message-section #user #user-response) {
  color: #fff;
}
:global(.chat-bot-box #message-section .message) {
  color: #000;
  clear: both;
  line-height: 1vw;
  font-size: 0.9vw;
  padding: 1px;
  position: relative;
  margin: 4px 0;
  max-width: 85%;
  word-wrap: break-word;
  z-index: 2;
}
.chat-bot-box #input-section {
  z-index: 1;
  padding: 0 2.5vw;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  overflow: hidden;
  height: 6vw;
  width: 100%;
}
.chat-bot-box #input-section #input {
  color: #000;
  min-width: 80%;
  outline: none;
  /*height: 5vw;*/
  /*width: 35vw;*/
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: solid #000 0.1vw;
  font-size: 0.9vw;
}
:global(.chat-bot-box .send) {
  background: transparent;
  border: 0;
  cursor: pointer;
  flex: 0 0 auto;
  margin-left: 1.4vw;
  margin-right: 0vw;
  padding: 0;
  position: relative;
  outline: none;
}
.chat-bot-box .send .circle {
  position: relative;
  width: 4.8vw;
  height: 4.8vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chat-bot-box .send .circle i {
  font-size: 3vw;
  margin-left: -1vw;
  margin-top: 1vw;
}
</style>