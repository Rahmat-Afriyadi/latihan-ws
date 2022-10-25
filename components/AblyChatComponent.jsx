import React, { useEffect, useState } from 'react';
import { useChannel } from "./AblyReactEffect";

const AblyChatComponent = () => {
    let inputBox = null;
    let messageEnd = null;

    const [messageText, setMessageText] = useState("");
    const [receivedMessages, setMessages] = useState([]);
    const messageTextIsEmpty = messageText.trim().length === 0;

    const [channel, ably] = useChannel("chat-demo", (message) => {
        // Here we're computing the state that'll be drawn into the message history
        // We do that by slicing the last 199 messages from the receivedMessages buffer
        console.log(message)
        // const history = receivedMessages.slice(-199);
        setMessages(receivedMessages => ([...receivedMessages.slice(-199), message]));

        // Then finally, we take the message history, and combine it with the new message
        // This means we'll always have up to 199 message + 1 new message, stored using the
        // setMessages react useState hook
    });

    const sendChatMessage = (messageText) => {
        channel.publish({ name: "test gk sih", data: messageText });
        setMessageText("");
        inputBox.focus();
    }

    const handleFormSubmission = (event) => {
        event.preventDefault();
        sendChatMessage(messageText);
    }

    const handleKeyPress = (event) => {
        if (event.charCode !== 13 || messageTextIsEmpty) {
        return;
        }
        sendChatMessage(messageText);
        event.preventDefault();
    }

    const messages = receivedMessages.map((message, index) => {
        const author = message.connectionId === ably.connection.id ? "me" : "other";
        return <span key={index} data-author={author}>{message.data}<br></br></span>;
    });

    useEffect(() => {
        messageEnd.scrollIntoView({ behaviour: "smooth" });
    });

    return (
        <div>
        <div>
            {messages}
            <div ref={(element) => { messageEnd = element; }}></div>
        </div>
        <form onSubmit={handleFormSubmission}>
            <textarea
            ref={(element) => { inputBox = element; }}
            value={messageText}
            placeholder="Type a message..."
            onChange={e => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
        
            ></textarea>
            <button type="submit" disabled={messageTextIsEmpty}>Send</button>
        </form>
        </div>
    )
}

export default AblyChatComponent;