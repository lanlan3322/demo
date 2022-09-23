import './App.css';
import Navbar from './components/Navbar.js';
import HashedPersona from './components/HashedPersona';
import HPcollection from './components/HPcollection';
import HPcards from './components/HPcards';
import HPnew from './components/HPnew';
import HPedit from './components/HPedit';
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
          <Route path="/HPcards" element={<HPcards />}/>
          <Route path="/HPnew" element={<HPnew />}/>             
          <Route path="/HPedit" element={<HPedit />}/>             
        </Routes>
    </div>
  );
}

export default App;
