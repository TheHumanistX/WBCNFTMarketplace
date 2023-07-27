import { Navigate, Route, Routes } from 'react-router-dom';
import { Contact, Footer, Header, Home, Marketplace } from './components';
import './App.css';

function App() {
  return (
    <div className="app__wrapper">
      <Header />
      <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
