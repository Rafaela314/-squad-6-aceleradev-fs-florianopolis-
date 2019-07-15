import React from 'react';

//import components
import SideBar from './components/Sidebar';
import Loginform from './components/Loginform';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <div className="App">

     
          <SideBar />
          <Dashboard />
          <Loginform />
 
    </div>
  );
}

export default App;
