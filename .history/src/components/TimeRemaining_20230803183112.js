import React, { useState, useEffect } from 'react';

const TimeRemaining = ({ expiration, setTimerComplete }) => {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const distance = expiration * 1000 - now;

      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      let result = "";
      if (days > 0) result += days === 1 ? `${days} Day ` : `${days} Days `;
      if (hours > 0) result += hours === 1 ? `${hours} Hr ` : `${hours} Hrs `;
      if (minutes > 0) result += minutes === 1 ? `${minutes} Min ` : `${minutes} Mins `;
      if (seconds >= 0) result += seconds === 1 ? `${seconds} Sec` : `${seconds} Secs`;
      
      setTimeRemaining(result.trimEnd());

      if (distance <= 0) {
        console.log('Entered if statement because distance <= 0')
        setTimerComplete(prevTimerComplete => !prevTimerComplete);
        console.log('setTimerComplete in if statement....')
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [expiration, setTimerComplete]);

  console.log('Time Remaining: ', timeRemaining)
  return <span>{timeRemaining}</span>;
}

export default TimeRemaining;