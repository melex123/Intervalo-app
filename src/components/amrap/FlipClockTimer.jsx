import React from 'react';
import './FlipClockTimer.css';

const FlipDigit = ({ digit }) => (
  <div className="flip-digit">
    <div className="flip-digit-top">
      <span>{digit}</span>
    </div>
    <div className="flip-digit-divider" />
    <div className="flip-digit-bottom">
      <span>{digit}</span>
    </div>
  </div>
);

const FlipClockTimer = ({ timeMs }) => {
  const totalSeconds = Math.max(0, Math.ceil(timeMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const m1 = Math.floor(minutes / 10);
  const m2 = minutes % 10;
  const s1 = Math.floor(seconds / 10);
  const s2 = seconds % 10;

  return (
    <div className="flip-clock">
      <div className="flip-clock-group">
        <FlipDigit digit={m1} />
        <FlipDigit digit={m2} />
      </div>
      <div className="flip-clock-colon">:</div>
      <div className="flip-clock-group">
        <FlipDigit digit={s1} />
        <FlipDigit digit={s2} />
      </div>
    </div>
  );
};

export default FlipClockTimer;
