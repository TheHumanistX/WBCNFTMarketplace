import { Navigate, Route, Routes } from 'react-router-dom';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { BuyNFT, Contact, CreateAuction, Header, Home, Marketplace, SellNFT, ViewAuction } from './components';
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
            <Route path="/buynft" element={<BuyNFT />} />
            <Route path="/sellnft" element={<SellNFT />} />
            <Route path="/create_auction" element={<CreateAuction />} />
            <Route path="/view_auction" element={<ViewAuction />} />
          </Routes>
        </div>
      </div>
    </ThirdwebProvider>
  );
}

export default App;