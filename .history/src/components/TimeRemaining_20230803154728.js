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
    console.log('Entered FIRST userEffect() in TimeRemaining.js...')
    const timer = setInterval(() => {
      const result = calculateTimeRemaining();
      setTimeRemaining(result.time);
      console.log('setTimeRemaining in FIRST useEffect... ')
      setDistance(result.distance);
      console.log('setDistance in FIRST useEffect... ')
    }, 1000);
    
    return () => clearInterval(timer);
  }, [calculateTimeRemaining]);
  
  useEffect(() => {
    console.log('Entered SECOND userEffect() in TimeRemaining.js...')
    if (distance <= 0) {
      console.log('Entered if statement in SECOND useEffect() in TimeRemaining.js...')
      setTimerComplete(true);
    }
  }, [distance]);

  console.log('Time Remaining: ', timeRemaining)
  return <span>{timeRemaining}</span>;
}

export default TimeRemaining;