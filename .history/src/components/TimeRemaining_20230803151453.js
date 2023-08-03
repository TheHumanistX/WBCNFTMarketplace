import React, { useState, useEffect } from 'react';

const TimeRemaining = ({ expiration, timerComplete, setTimerComplete }) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [distance, setDistance] = useState(null);

  function calculateTimeRemaining() {
    const now = Date.now();
    const distance = expiration * 1000 - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    let result = "";
    if (days > 0) result += days === 1 ? `${days} Day ` : `${days} Days `;
    if (hours > 0) result += hours === 1 ? `${hours} Hour ` : `${hours} Hours `;
    if (minutes > 0) result += minutes === 1 ? `${minutes} Minute ` : `${minutes} Minutes `;
    if (seconds >= 0) result += seconds === 1 ? `${seconds} Second` : `${seconds} Seconds`;
    
    return {time: result.trimEnd(), distance};
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const result = calculateTimeRemaining();
      console.log('result: ', result)
      console.log('result.time: ', result.time)
      console.log('result.distance: ', result.distance)
      setTimeRemaining(result.time);
      setDistance(result.distance);
      if (result.distance <= 0) {
        setTimerComplete(!timerComplete);
        clearInterval(timer);
      } else if (expiration * 1000 < Date.now()) {
        setTimerComplete(!timerComplete);
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [setTimerComplete, timerComplete]);

  console.log('Time Remaining: ', timeRemaining)
  return <span>{timeRemaining}</span>;
}

export default TimeRemaining;