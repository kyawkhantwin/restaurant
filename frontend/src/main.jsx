import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Nav} from './components/Nav';
import App from './routes/App';
import Admin from './routes/Admin';
import AdminNav from './Admin/AdminNav';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      
      <Routes>
        <Route path="/admin/*" element={<><AdminNav/><Admin /></>} />
        <Route path="/*" element={<><Nav /><App /></>} />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  </React.StrictMode>,
 
);
