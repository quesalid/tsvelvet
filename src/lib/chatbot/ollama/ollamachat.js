import { Ollama } from "@langchain/community/llms/ollama"
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { HumanMessage, ChatMessage} from "@langchain/core/messages";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";



class ChatBot {
    constructor() {
        this.chatbot = new Ollama({
            baseUrl: "http://localhost:11434",
            model: "llama2",
          });

        this.history = new ChatMessageHistory();
        const prompt = ChatPromptTemplate.fromMessages([
            [
                "system",
                "You are a helpful assistant. Answer all questions to the best of your ability.",
            ],
            new MessagesPlaceholder("messages"),
        ]);

        this.chain = prompt.pipe(this.chatbot);

    }

    async chat(message) {
        console.log("ollama bot ---->",message)
        await this.history.addMessage(
            new HumanMessage(
                message
            )
        );
        
        const responseMessage = await this.chain.invoke({
            messages: await this.history.getMessages(),
        });

        console.log("ollama bot ---->",responseMessage)

        let cm = new ChatMessage({content:responseMessage,role:'chatbot'})
        await this.history.addMessage(cm);

        return cm.content
    }

}

export default ChatBot