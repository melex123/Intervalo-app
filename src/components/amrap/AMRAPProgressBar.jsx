import React from 'react';
import './AMRAPProgressBar.css';

const AMRAPProgressBar = ({ progressFraction }) => {
  return (
    <div className="amrap-progress-bar">
      <div
        className="amrap-progress-fill"
        style={{ width: `${Math.min(100, progressFraction * 100)}%` }}
      />
    </div>
  );
};

export default AMRAPProgressBar;
