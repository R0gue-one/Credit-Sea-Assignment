import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UploadPage from './components/upload'
import CreditProfilesPage from './components/creditProfiles';
import ProfilePage from './components/profile';

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/credit-profiles" element={<CreditProfilesPage />} />
        <Route path="/profile/:id" element={<ProfilePage/>}/>
      </Routes>
    </Router>
  )
}

export default App
