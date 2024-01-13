import React, { useState, useEffect } from "react";
import Input from "./Components/Input";
import io from "socket.io-client";
const socket = io("http://localhost:3000");

export default function App() {
  const [messages, setMessages] = useState([]);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((m) => [...m, data]);
    });
    socket.on('loggedIn', data => {
      setLoggedIn(data)
    });
    socket.on('users', (data)=>{
      setUsers(data);
    })
  }, []);

  const send = (message) => {
    socket.emit("message",message);
  }

  const login = (name) => {
    socket.emit("login", name);
  }

  return (
    
    <div id="container">
      <div>
        <h1>Active users:</h1>
        <ul>
        {users.map(u => <li>{u}</li>)}
        </ul>
      </div>

      <div class="flex">
      {!isLoggedIn &&(<>
        <h1 id="login">What's your name?</h1>
        <Input send={login} buttonText='login' />
        </>
      )}
      {isLoggedIn && (
      <div class="chat">
        <ul class="chat">
          {messages.map(m => <li>{m}</li>)}
        </ul>
        <Input send={send} buttonText='Send' /></div>)
      }
      </div>
    </div>
    );
}