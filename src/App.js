import React, { useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState(false);

  const handleClick = () => {
      const today = new Date();
        const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
        if (dayOfWeek === 0) {
          setMessage('It is Sunday');
        } else {
          setMessage("Sorry, it is not Sunday :( but you're amazing");
        }
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={handleClick}>
          Is it Sunday?
        </button>
        {message && <p>{message}</p>}
      </header>
    </div>
  );
}

export default App;
