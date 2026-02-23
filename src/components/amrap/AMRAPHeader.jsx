import React from 'react';
import './AMRAPHeader.css';

const AMRAPHeader = ({ totalDurationSec, onStop }) => {
  const minutes = Math.floor(totalDurationSec / 60);

  return (
    <div className="amrap-header">
      <div className="amrap-header-info">
        <span className="amrap-header-title">INTERVALO</span>
        <span className="amrap-header-subtitle">
          Total workout time: {minutes} min
        </span>
      </div>
      <button className="amrap-stop-btn" onClick={onStop} aria-label="Stop workout">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect width="14" height="14" rx="2" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
};

export default AMRAPHeader;
