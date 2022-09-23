import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import HPnew from './components/HPnew';
import HPedit from './components/HPedit';
import HashedPersona from './components/HashedPersona';
import HPcollection from './components/HPcollection';
import HPcards from './components/HPcards';
import HPdetails from './components/HPdetails';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HashedPersona />}/>
        <Route path="/HPnew" element={<HPnew />}/> 
        <Route path="/HPdetails/:tokenId" element={<HPdetails />}/>        
        <Route path="/HPcollection" element={<HPcollection />}/> 
        <Route path="/HPcards" element={<HPcards />}/> 
        <Route path="/HPedit/:tokenId" element={<HPedit />}/>             
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
