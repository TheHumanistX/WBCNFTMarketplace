import { Navigate, Route, Routes } from 'react-router-dom';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { BuyNFT, Contact, CreateAuction, Header, Home, Marketplace, SellNFT, ViewAuctions } from './components';
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
            <Route path="/buy_nft" element={<BuyNFT />} />
            <Route path="/sell_nft" element={<SellNFT />} />
            <Route path="/create_auction" element={<CreateAuction />} />
            <Route path="/view_auctions" element={<ViewAuctions />} />
          </Routes>
        </div>
      </div>
    </ThirdwebProvider>
  );
}

export default App;
