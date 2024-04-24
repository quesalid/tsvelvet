<script lang="ts">
import ChatBot from './ollama/ollamachat.js'

export let title = 'Process Assistant'
export let width = '30px'
export let height = '30px'
export let fill = '#fff'
export let avatar = 'LORENZO.png'
export let welcome = "Hello.. I'm listening! Go on.."
export let lang = "en-aus"

let bot:any = new ChatBot()

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

function voiceControl(str:any) {
  let u = new SpeechSynthesisUtterance(str);
  u.text = str;
  u.lang = lang;
  u.volume = 1;
  u.rate = 1;
  u.pitch = 1;
  if(speak)
  synth.speak(u);
}

async function sendMessage() {
  const inputField:any = document.getElementById("input");
  //let input:any = inputField.value.trim();
  let input:any = inputField.innerHTML.trim();
  let response = await bot.chat(input)

  input != "" && addChat(input, response)
  //input != "" && output(input)
  inputField.innerHTML = "";
}

function analizeProcess(ev:any) {
  console.log("ANALIZE PROCESS")
  output("who created you")
}

const speakOff = 'M39.719 33.566V8.207c0-1.57-1.149-2.883-2.79-2.883c-1.148 0-1.898.563-3.163 1.688l-10.829 9.633l2.602 2.625l9.68-8.79c.117-.093.234-.187.398-.187a.32.32 0 0 1 .328.328v19.172Zm7.054 16.407c.727.703 1.875.703 2.555 0c.703-.727.727-1.852 0-2.555L9.203 7.293a1.84 1.84 0 0 0-2.578 0c-.68.68-.68 1.875 0 2.555Zm-9.797-1.641c1.032 0 1.922-.539 2.461-1.594l-2.859-2.742l-11.883-10.289c-.515-.445-.797-.516-1.453-.516h-7.758c-.914 0-1.476-.562-1.476-1.476V21.59l-2.813-3c-.656.937-.96 2.133-.96 3.68v9.14c0 3.516 1.78 5.32 5.085 5.32h6.844c.234 0 .422.07.586.211l11.016 9.868c1.148 1.03 2.062 1.523 3.21 1.523'
const speakOn = 'M47.937 49.384c.737.497 1.713.298 2.29-.518C53.87 43.65 56 36.941 56 29.834c0-7.107-2.15-13.835-5.773-19.051c-.577-.816-1.553-1.015-2.29-.498c-.756.518-.876 1.513-.298 2.35c3.205 4.717 5.196 10.77 5.196 17.2s-1.931 12.561-5.196 17.2c-.578.816-.458 1.811.298 2.349M22.715 48.01c1.353 0 2.329-.995 2.329-2.33V13.929c0-1.334-.976-2.448-2.37-2.448c-.975 0-1.612.477-2.687 1.433l-9.356 8.301a.694.694 0 0 1-.498.18H4.22c-2.826 0-4.22 1.413-4.22 4.42v7.922c0 3.006 1.394 4.42 4.22 4.42h5.913c.199 0 .378.06.498.179l9.356 8.381c.976.876 1.752 1.294 2.728 1.294m17.2-4.061c.776.517 1.732.318 2.289-.478c2.628-3.663 4.16-8.54 4.16-13.637c0-5.116-1.512-9.993-4.16-13.656c-.577-.777-1.513-.976-2.29-.458c-.756.518-.875 1.493-.278 2.35c2.17 3.184 3.524 7.365 3.524 11.764c0 4.4-1.314 8.62-3.524 11.766c-.577.856-.478 1.831.279 2.349m-18.355-.14c-.1 0-.22-.06-.339-.179l-8.819-7.943c-.477-.438-.875-.537-1.413-.537h-6.63c-.776 0-1.154-.359-1.154-1.155v-8.44c0-.777.378-1.155 1.155-1.155h6.629c.537 0 .916-.08 1.413-.538l8.82-8.003c.099-.08.218-.159.338-.159c.179 0 .279.12.279.279v27.53c0 .18-.1.298-.28.298m10.412-5.235c.676.478 1.652.318 2.23-.458c1.552-2.09 2.487-5.156 2.487-8.282c0-3.125-.955-6.17-2.488-8.301c-.577-.776-1.533-.936-2.23-.458c-.875.577-.975 1.593-.338 2.469c1.155 1.552 1.851 3.921 1.851 6.29c0 2.37-.736 4.738-1.87 6.311c-.598.856-.499 1.832.357 2.429'
let speak = true

function toggleAudio(ev:any) {

  let arr = Array.from(ev.target.children);
  let path:any = arr[0]
  if(path){
      if(speak)
        path.setAttribute('d',speakOff)
      else
        path.setAttribute('d',speakOn)
  }else{
      if(speak)
        ev.target.setAttribute('d',speakOff)
      else
        ev.target.setAttribute('d',speakOn)
  }
   speak = !speak
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
  userDiv.innerHTML = `<span id='user-response'>${input}</span> <img class="user-avatar" src="/`+avatar+`" alt="Lorenzo"/>`;
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
      <div class="message" id="bot"><span id="bot-response">{welcome}</span></div>
    </div>
    <div id="input-section">
      <div id="input" contenteditable="true" placeholder="Type a message"  autofocus></div>
      <!--button class="send" on:click="{sendMessage}">
        <div class="circle"><i class="zmdi zmdi-mail-send"></i>send</div>
      </!--button-->
       <!-- svelte-ignore a11y-click-events-have-key-events -->
       <!-- svelte-ignore a11y-no-static-element-interactions -->
       <svg on:click={sendMessage} class="send" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32">
			<path fill="currentColor" d="M11 23a1 1 0 0 1-1-1V10a1 1 0 0 1 1.447-.894l12 6a1 1 0 0 1 0 1.788l-12 6A1.001 1.001 0 0 1 11 23m1-11.382v8.764L20.764 16Z"/><path fill="currentColor" d="M16 4A12 12 0 1 1 4 16A12 12 0 0 1 16 4m0-2a14 14 0 1 0 14 14A14 14 0 0 0 16 2"/>
		</svg>
    </div>
    <div id="auto-input-section">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
       <!-- svelte-ignore a11y-no-static-element-interactions -->
       <svg on:click={analizeProcess} class="send"  xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
            <path fill="currentColor" d="M9 17H7v-7h2zm4 0h-2V7h2zm4 0h-2v-4h2zm2 2H5V5h14v14.1M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2"/>
        </svg>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
       <!-- svelte-ignore a11y-no-static-element-interactions -->
        <svg id="audio-toggle" on:click={toggleAudio} class="send" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 56 56">
            <path  fill="currentColor" d="M47.937 49.384c.737.497 1.713.298 2.29-.518C53.87 43.65 56 36.941 56 29.834c0-7.107-2.15-13.835-5.773-19.051c-.577-.816-1.553-1.015-2.29-.498c-.756.518-.876 1.513-.298 2.35c3.205 4.717 5.196 10.77 5.196 17.2s-1.931 12.561-5.196 17.2c-.578.816-.458 1.811.298 2.349M22.715 48.01c1.353 0 2.329-.995 2.329-2.33V13.929c0-1.334-.976-2.448-2.37-2.448c-.975 0-1.612.477-2.687 1.433l-9.356 8.301a.694.694 0 0 1-.498.18H4.22c-2.826 0-4.22 1.413-4.22 4.42v7.922c0 3.006 1.394 4.42 4.22 4.42h5.913c.199 0 .378.06.498.179l9.356 8.381c.976.876 1.752 1.294 2.728 1.294m17.2-4.061c.776.517 1.732.318 2.289-.478c2.628-3.663 4.16-8.54 4.16-13.637c0-5.116-1.512-9.993-4.16-13.656c-.577-.777-1.513-.976-2.29-.458c-.756.518-.875 1.493-.278 2.35c2.17 3.184 3.524 7.365 3.524 11.764c0 4.4-1.314 8.62-3.524 11.766c-.577.856-.478 1.831.279 2.349m-18.355-.14c-.1 0-.22-.06-.339-.179l-8.819-7.943c-.477-.438-.875-.537-1.413-.537h-6.63c-.776 0-1.154-.359-1.154-1.155v-8.44c0-.777.378-1.155 1.155-1.155h6.629c.537 0 .916-.08 1.413-.538l8.82-8.003c.099-.08.218-.159.338-.159c.179 0 .279.12.279.279v27.53c0 .18-.1.298-.28.298m10.412-5.235c.676.478 1.652.318 2.23-.458c1.552-2.09 2.487-5.156 2.487-8.282c0-3.125-.955-6.17-2.488-8.301c-.577-.776-1.533-.936-2.23-.458c-.875.577-.975 1.593-.338 2.469c1.155 1.552 1.851 3.921 1.851 6.29c0 2.37-.736 4.738-1.87 6.311c-.598.856-.499 1.832.357 2.429"/>
        </svg>
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

.chat-bot-box #auto-input-section {
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  overflow: hidden;
  width: 100%;
  margin-top: 5%;
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

</style>