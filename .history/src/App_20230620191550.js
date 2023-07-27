import { Navigate, Route, Routes } from 'react-router-dom';
import { Contact, Footer, Header, Home } from './components';
import './App.css';

function App() {
  return (
    <div className="app__wrapper">
      <Header />
      <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
