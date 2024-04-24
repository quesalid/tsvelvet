// https://medium.com/@gabrielrodewald/running-models-with-ollama-step-by-step-60b6f6125807
import { ChatOpenAI } from "@langchain/openai";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { HumanMessage } from "@langchain/core/messages";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";


//process.env.OPENAI_API_KEY = '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'

class ChatBot {
    constructor(apikey) {
        this.chatbot = new ChatOpenAI({
            model: "gpt-3.5-turbo-16k",
            temperature: 0.2,
            apiKey: apikey ? apikey : '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',
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
        await this.history.addMessage(
            new HumanMessage(
                message
            )
        );

        const responseMessage = await this.chain.invoke({
            messages: await this.history.getMessages(),
        });

        await this.history.addMessage(responseMessage);

        return responseMessage.content
    }

}

export default ChatBot

