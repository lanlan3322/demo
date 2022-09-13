import './App.css';
import Navbar from './components/Navbar.js';
import HashedPersona from './components/HashedPersona';
import HPcollection from './components/HPcollection';
import HPCards from './components/HPcards';
import HPnew from './components/HPnew';
import HPdetails from './components/HPdetails';
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <div className="container">
        <Routes>
          <Route path="/" element={<HashedPersona />}/>
          <Route path="/HPdetails" element={<HPdetails />}/>        
          <Route path="/HPcollection" element={<HPcollection />}/>
          <Route path="/HPcards" element={<HPCards />}/>
          <Route path="/HPnew" element={<HPnew />}/>             
        </Routes>
    </div>
  );
}

export default App;
