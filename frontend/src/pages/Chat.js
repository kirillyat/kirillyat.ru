import '../styles/Chat.css';
import Navbar from '../components/Navbar';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import Cookies from 'js-cookie';
import { FiSend, FiTrash2, FiMessageCircle } from 'react-icons/fi';

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatContainerRef = useRef(null);

  // Load chat history when component mounts
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/chat/history/', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to load chat history: ${response.status}`);
      }

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
      setError('Failed to load chat history. Please try refreshing the page.');
    }
  };

  const clearChat = async () => {
    try {
      const csrfToken = Cookies.get('csrftoken');
      const response = await fetch('http://localhost:8000/chat/clear/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFTOKEN': csrfToken,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to clear chat: ${response.status}`);
      }

      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat:', error);
      setError('Failed to clear chat. Please try again.');
    }
  };

  const handleSendMessage = async (userMessage) => {
    // Add user message to UI immediately with current timestamp
    const timestamp = new Date().toISOString();
    const newMessage = {
      user_text: userMessage,
      ai_text: "Thinking...",
      timestamp: timestamp,
      isLoading: true
    };
    
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsLoading(true);
    setError(null);
  
    try {
      const csrfToken = Cookies.get('csrftoken');

      const response = await fetch('http://localhost:8000/message/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'X-CSRFTOKEN': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ user_text: userMessage }),
      });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastIndex = updatedMessages.length - 1;
        updatedMessages[lastIndex] = {
          ...updatedMessages[lastIndex],
          ai_text: data.ai_text,
          isLoading: false
        };
        return updatedMessages;
      });
    } catch (error) {
      console.error("Failed to call API:", error);
      setError("Failed to get a response from the AI. Please try again.");
      
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastIndex = updatedMessages.length - 1;
        updatedMessages[lastIndex] = {
          ...updatedMessages[lastIndex],
          ai_text: "Error: Failed to get a response. Please try again.",
          isLoading: false
        };
        return updatedMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ChatPage">
      <Navbar />
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-title">
            <FiMessageCircle size={24} />
            <h1>AI Chat Assistant</h1>
          </div>
          <button
            className="clear-chat-button"
            onClick={clearChat}
            disabled={isLoading || messages.length === 0}
            title="Clear conversation"
          >
            <FiTrash2 size={16} />
            <span>Clear Chat</span>
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="chat-messages" ref={chatContainerRef}>
          {messages.length === 0 ? (
            <div className="empty-chat">
              <div className="empty-chat-icon">
                <FiMessageCircle size={48} color="#CBD5E0" />
              </div>
              <p>No messages yet. Start a conversation!</p>
              <p className="empty-chat-subtitle">Ask me anything about programming, technology, or general knowledge.</p>
            </div>
          ) : (
            <Chat messages={messages} />
          )}
        </div>
        
        <TextInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}

function Chat({ messages }) {
  return (
    <div className="Chat">
      {messages.map((msg, index) => (
        <React.Fragment key={index}>
          <Message msg={msg} />
        </React.Fragment>
      ))}
    </div>
  );
}

function TextInput({ onSendMessage, disabled }) {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputText.trim() && !disabled) {
      onSendMessage(inputText);
      setInputText("");
    }
  };

  const handleKeyDown = (event) => {
    // Submit on Enter key (but not with Shift+Enter)
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <div className="TextInput">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ask me anything..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoFocus
        />
        <button type="submit" disabled={disabled || !inputText.trim()}>
          {disabled ? 'Sending...' : <FiSend size={18} />}
        </button>
      </form>
    </div>
  );
}

function Message({ msg }) {
  // Format the timestamp
  const formattedTime = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  }) : '';

  return (
    <div className="Message">
      {/* User message */}
      <div className="user-message-container">
        <div className="message-header">
          <span className="message-sender">You</span>
          {formattedTime && <span className="message-time">{formattedTime}</span>}
        </div>
        <div className="message-content user-message">
          {msg.user_text}
        </div>
      </div>
      
      {/* AI message */}
      <div className="ai-message-container">
        <div className="message-header">
          <span className="message-sender">AI Assistant</span>
        </div>
        <div className="message-content ai-message">
          {msg.isLoading ? (
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            <ReactMarkdown className="markdown-content">{msg.ai_text}</ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;