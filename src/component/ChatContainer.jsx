import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessage, setCurrentUser ,clearChat } from '../redux/chatSlice'
import io from 'socket.io-client';

function ChatContainer() {
    const [switchPage, setSwitchPage] = useState(true);
    const [userName, setUserName] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [socket, setSocket] = useState(null);
 const messages = useSelector(state => state.chatReducer.messages);
const currentUser = useSelector(state => state.chatReducer.currentUser);
    const dispatch = useDispatch();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            dispatch(setCurrentUser(savedUser));
            setSwitchPage(false);
            connectSocket(savedUser);
        }
    }, [dispatch]);

    const connectSocket = (user) => {
        
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'https://chat-app-backend-0u7m.onrender.com';
    const newSocket = io(socketUrl);
    
    setSocket(newSocket);

        newSocket.on('message', (message) => {
            dispatch(sendMessage(message));
        });

        return () => newSocket.close();
    };

    const handleLogin = () => {
        if (!userName.trim()) {
            alert("Please enter user name");
            return;
        }
        
        localStorage.setItem("user", userName);
        dispatch(setCurrentUser(userName));
        setSwitchPage(false);
        connectSocket(userName);
    };

    const handleLogout = () => {
        if (socket) socket.disconnect();
        localStorage.removeItem("user");
        dispatch(setCurrentUser(null));
        setSwitchPage(true);
        setUserName('');
        dispatch(clearChat())
    };

    const handleSendMessage = () => {
        if (!messageInput.trim() || !currentUser) return;

        const messageData = {
            id: Date.now(),
            text: messageInput,
            user: currentUser,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        if (socket) {
            socket.emit('message', messageData);
        }
        setMessageInput('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    return (
        <>
            {switchPage ? (
                <div className='d-flex align-items-center justify-content-center vh-100 ' style={ {background:'url(./bg.jpeg)' , backgroundRepeat:"no-repeat" , backgroundSize:'cover' }}>
                    <div className=' shadow p-4' style={{width: '300px', backdropFilter: 'blur(10px)',}}>
                        <h3 className='text-danger text-center mb-3'>Chat Login</h3>
                        <input 
                            type="text" 
                            placeholder='Enter Your Name' 
                            value={userName} 
                            onChange={e => setUserName(e.target.value)}
                            className='form-control mb-3' 
                        />
                        <button onClick={handleLogin} className='btn btn-danger w-100'>
                            Start Chatting
                        </button>
                    </div>
                </div>
            ) : (
                <div className='d-flex justify-content-center align-items-center vh-100 ' style={{background:'url("/chat.jpg")'}}>
                    <div className='shadow' style={{height:'600px', width:"400px", backdropFilter: 'blur(10px)',}}>

                        <header className='bg-dark text-white p-3 d-flex justify-content-between align-items-center'>
                            <div>
                                <strong>Chat App</strong>
                                <span className='ms-2'>- {currentUser}</span>
                            </div>
                            <button className='btn btn-danger btn-sm' onClick={handleLogout}>
                                Logout
                            </button>
                        </header>

                        <div className='p-3 ' style={{
                            height: '450px', 
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                          
                           
                        }}>
                            {messages.map((message) => (
                                <div 
                                    key={message.id} 
                                    className={`d-flex mb-2 ${
                                        message.user === currentUser ? 'justify-content-end' : 'justify-content-start'
                                    }`}
                                >
                                    <div 
                                        className={`p-2 rounded ${
                                            message.user === currentUser 
                                                ? 'bg-primary text-white' 
                                                : 'bg-light border'
                                        }`}
                                        style={{ maxWidth: '70%' }}
                                    >
                                        {message.user !== currentUser && (
                                            <small className='text-muted d-block'>{message.user}</small>
                                        )}
                                        <div>{message.text}</div>
                                        <small className={`${message.user === currentUser ? 'text-white-50' : 'text-muted'}`}>
                                            {message.timestamp}
                                        </small>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <footer className='p-3 border-top bg-dark'>
                            <div className='input-group'>
                                <input 
                                    type="text" 
                                    placeholder='Type a message...' 
                                    value={messageInput}
                                    onChange={e => setMessageInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className='form-control'
                                />
                                <button 
                                    onClick={handleSendMessage} 
                                    className='btn btn-danger'
                                    disabled={!messageInput.trim()}
                                >
                                    Send
                                </button>
                            </div>
                        </footer>

                    </div>
                </div>
            )}
        </>
    );
}

export default ChatContainer;