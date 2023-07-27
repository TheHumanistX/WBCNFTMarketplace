import { Navigate, Route, Routes } from 'react-router-dom';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { Contact, Header, Home, Marketplace } from './components';
import './App.css';

function App() {
  return (
    <ThirdwebProvider>
      <div className="app__wrapper">
        <Header />
        <div className='routes__container'>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </div>
    </ThirdwebProvider>
  );
}

export default App;
