import React from 'react';
import ReactDOM from 'react-dom';

const AlertModal = ({ open, children, onClose }) => {
  if (!open) return null;

  return ReactDOM.createPortal(
    <>
      <div className='modal__overlay' />
      <div className='modal__container'>
        {children}
        <div className='modal__button' onClick={onClose}>Close</div>
      </div>
    </>,
    document.getElementById('portal')
  );
};

export default AlertModal;
