import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { AlertModal, Header } from './components';
import { BuyNFT, Contact, CreateAuction, Home, Marketplace, SellNFT, ViewAuctions } from './pages';
import { EthersProvider } from "./context";
import './App.css';

const activeChain = "goerli"

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  return (
    <ThirdwebProvider activeChain={activeChain}>
      <EthersProvider>
        <div className="app__wrapper">
          <Header setIsOpen={setIsOpen} setModalText={setModalText} />
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
          <AlertModal open={isOpen} onClose={() => setIsOpen(false)}>
            {modalText}
          </AlertModal>
        </div>
      </EthersProvider>
    </ThirdwebProvider>
  );
}

export default App;
