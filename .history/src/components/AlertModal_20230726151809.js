import React from 'react';
import ReactDOM from 'react-dom';

// CSS in JS styling for example. Replace with your own styles or CSS classes.
const modalStyles = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#FFF',
  padding: '50px',
  zIndex: 1000,
};

const overlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, .7)',
  zIndex: 1000,
};

const AlertModal = ({ open, children, onClose }) => {
  if (!open) return null;

  return ReactDOM.createPortal(
    <>
      <div className='modal__overlay' />
      <div className='modal__container'>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </>,
    document.getElementById('portal')
  );
};

export default AlertModal;
