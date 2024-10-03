import React from 'react';
import Modal from 'react-modal';
import MathGame from '../components/mathGame';

Modal.setAppElement('#root'); 

const MathModal = ({ isOpen, onRequestClose, userId }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Math Game Modal"
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '50%', 
          padding: '20px',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)', 
        },
      }}
    >
      <button onClick={onRequestClose} style={{ float: 'right' }}>Close</button>
      <MathGame userId={userId} />
    </Modal>
  );
};

export default MathModal;
