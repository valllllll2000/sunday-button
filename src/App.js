import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import firebase from "firebase/compat/app"
import 'firebase/compat/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

firebase.initializeApp(firebaseConfig);

function App() {
  const [message, setMessage] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [savedMessages, setSavedMessages] = useState([]);
  const [username, setUsername] = useState('');

   useEffect(() => {
      const fetchUsername = async () => {
        try {
          const response = await axios.get('https://api.ipify.org?format=json');
          const ip = response.data.ip;
          setUsername(ip);
        } catch (error) {
          console.error('Error fetching the IP address:', error);
        }
      };

      fetchUsername();
    }, []);

      // Load saved messages from Firebase Realtime Database
      useEffect(() => {
        const messagesRef = firebase.database().ref('messages');
        messagesRef.on('value', (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setSavedMessages(Object.values(data));
          }
        });

        return () => messagesRef.off('value');
      }, []);

  const handleClick = () => {
      const today = new Date();
        const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
        if (dayOfWeek === 0) {
          setMessage('Yeah! It is Sunday 🌞, we will meet in a few hours 😘');
        } else {
          setMessage("Sorry, it is not Sunday :( but you're amazing");
        }
  };

   const handleInputChange = (event) => {
      setUserMessage(event.target.value);
    };

    const handleSaveMessage = () => {
      if (userMessage.trim() !== '') {
        const messageWithUsername = `user${username}: ${userMessage}`;
        //setSavedMessages([...savedMessages, messageWithUsername]);
        firebase.database().ref('messages').push(messageWithUsername);
        setUserMessage('');
      }
    };

    const handleDeleteMessages = () => {
        //setSavedMessages([]);
        firebase
            .database()
            .ref('messages')
            .remove()
            .then(() => {
              // Clear the saved messages state
              setSavedMessages([]);
            })
            .catch((error) => {
              console.error('Error deleting messages:', error);
            });
     };

  return (
    <div className="App">
      <header className="App-header">
        <button className="App-button" onClick={handleClick}>
          Is it Sunday?
        </button>
        {message && <p className="App-message">{message}</p>}

        <div className="input-container">
                  <input
                    type="text"
                    value={userMessage}
                    onChange={handleInputChange}
                    placeholder="Write a message"
                  />
                  <button className="App-button" onClick={handleSaveMessage}>
                    Save Message
                  </button>
                </div>
                <div className="saved-messages">
                  <h3>Saved Messages</h3>
                  <ul>
                    {savedMessages.map((msg, index) => (
                      <li key={index}>{msg}</li>
                    ))}
                  </ul>
                  {savedMessages.length > 0 && (
                              <button className="App-button" onClick={handleDeleteMessages}>
                                Delete All Messages
                              </button>
                            )}
                </div>
      </header>
    </div>
  );
}

export default App;
