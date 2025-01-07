import '../styles/Chat.css';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import Cookies from 'js-cookie';

function ChatPage() {

  const [messages, setMessages] = useState([
  ]);

  const handleSendMessage = async (userMessage) => {
    const newMessage = { user_text: userMessage, ai_text: "Typing..." }; 
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  
    try {
      const csrfToken = Cookies.get('csrftoken');

      const response = await fetch('http://localhost:8000/message/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'X-CSRFTOKEN': csrfToken,
        },
        body: JSON.stringify({ user_text: userMessage }),
      });

  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1].ai_text = data.ai_text;
        return updatedMessages;
      });


    } catch (error) {
      console.error("Failed to call API:", error);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1].ai_text = "Error: Failed to get a response.";
        return updatedMessages;
      });
    }
  };

  return (
    <div className="ChatPage">
      <Navbar />
      <Chat messages={messages} />
      <TextInput onSendMessage={handleSendMessage} />
    </div>
  );
}


function Chat({ messages }) {
  return (
    <div className="Chat">
      {messages.map((msg, index) => (
        <React.Fragment key={index}>
          <Message msg={msg} />
          <br />
        </React.Fragment>
      ))}
    </div>
  );
}

function TextInput({ onSendMessage }) {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText); 
      setInputText("");
    }
  };

  return (
    <form className="TextInput" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Write here your request..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)} 
      />
      <button type="submit">Send</button>
    </form>
  );
}


function Message({ msg }) {
  return (
    <div className="Message">
      <p><strong>You:</strong> {msg.user_text}</p>
      <hr />
      <p><strong>AI:</strong> <ReactMarkdown>{msg.ai_text}</ReactMarkdown></p>
    </div>
  );
}

export default ChatPage;