import React, { useState, useEffect } from 'react';

const TimeRemaining = ({ expiration, timerComplete, setTimerComplete }) => {
  const [distance, setDistance] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());
  
  function calculateTimeRemaining() {
    const now = Date.now();
    const calculatedDistance = expiration * 1000 - now;
    setDistance(calculatedDistance);

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(calculatedDistance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((calculatedDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((calculatedDistance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((calculatedDistance % (1000 * 60)) / 1000);
    
    let result = "";
    if (days > 0) result += days === 1 ? `${days} Day ` : `${days} Days `;
    if (hours > 0) result += hours === 1 ? `${hours} Hour ` : `${hours} Hours `;
    if (minutes > 0) result += minutes === 1 ? `${minutes} Minute ` : `${minutes} Minutes `;
    if (seconds >= 0) result += seconds === 1 ? `${seconds} Second` : `${seconds} Seconds`;

    return result.trimEnd();
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if(distance <= 0) {
      setTimerComplete(!timerComplete);
    }
  }, [distance, setTimerComplete, timerComplete]);

  return <span>{timeRemaining}</span>;
}

export default TimeRemaining;