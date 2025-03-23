import { useState } from 'react'
import './App.css'
import Login from "./components/Login";
import { app } from "./firebaseConfig";

function App() {
  return (
    <div>
      <h1>Firebase Connected SuccessFully</h1>
      <Login />
    </div>
  );
}



export default App;
