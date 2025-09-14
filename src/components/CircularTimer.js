import React from 'react';

const CIRCLE_RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export function CircularTimer({ seconds, formatTime, totalDuration }) { // 1. totalDuration prop 추가
  // 2. progress 계산 방식을 totalDuration 기준으로 변경
  // totalDuration이 0이 되는 경우(초기 상태 등)를 대비해 0으로 나누는 것을 방지
  const progress = totalDuration > 0 ? seconds / totalDuration : 0;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="circular-timer">
      <svg className="timer-svg" width="280" height="280" viewBox="0 0 200 200">
        <circle
          className="timer-circle-bg"
          r={CIRCLE_RADIUS}
          cx="100"
          cy="100"
        />
        <circle
          className="timer-circle-progress"
          r={CIRCLE_RADIUS}
          cx="100"
          cy="100"
          strokeDasharray={CIRCUMFERENCE}
          style={{ strokeDashoffset }}
        />
      </svg>
      <div className="time-display">{formatTime()}</div>
    </div>
  );
}