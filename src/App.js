import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { CircularTimer } from './components/CircularTimer.js';
import { Controls } from './components/Controls.js';

// --- 상수 정의 ---
const PLANK_TIME = 3600; // 운동 시간 (초)
const REST_TIME = 900;  // 휴식 시간 (초)
const TOTAL_SETS = 3;  // 총 세트 수

function App() {
  
  // --- 상태 관리 ---
  const [seconds, setSeconds] = useState(PLANK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);

  // --- 오디오 Ref ---
  // public/sounds 폴더에 오디오 파일을 위치시켜야 합니다.
  const startSound = useRef(new Audio('/sounds/start.mp3'));
  const finishSound = useRef(new Audio('/sounds/finish.mp3'));

  // formatTime 함수를 useEffect보다 위에 정의해야 합니다.
  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  // --- 타이머 로직 (핵심) ---
  useEffect(() => {
    let interval = null;
    const originalTitle = "포모도로 타이머";

    // 타이머가 활성화 상태일 때만 제목을 변경합니다.
    if (isActive) {
      // 현재 모드(운동/휴식)와 시간을 조합하여 제목을 만듭니다.
      const modeText = isResting ? '휴식' : '공부';
      const newTitle = `[${formatTime()}] ${modeText}  - ${originalTitle}`;
      document.title = newTitle;
    } else {
      // 타이머가 멈추면 원래 제목으로 되돌립니다.
      document.title = originalTitle;
    }

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000);
    } else if (isActive && seconds === 0) {
      finishSound.current.play(); // 시간 종료 시 사운드 재생
      setIsActive(false);

      // 운동 시간이 끝났고, 마지막 세트가 아니라면 -> 휴식 시작
      if (!isResting && currentSet < TOTAL_SETS) {
        setIsResting(true);
        setSeconds(REST_TIME);
        // 휴식 후 자동으로 다음 세트 시작
        setTimeout(() => setIsActive(true), 1000); 
      } 
      // 휴식 시간이 끝났다면 -> 다음 세트 운동 시작
      else if (isResting) {
        setIsResting(false);
        setCurrentSet(prev => prev + 1);
        setSeconds(PLANK_TIME);
        // 다음 세트 자동으로 시작
        setTimeout(() => setIsActive(true), 1000);
      }
    }

    return () => {clearInterval(interval);
      document.title=originalTitle;
    }
  }, [isActive, seconds, currentSet, isResting, formatTime]); // <-- formatTime을 여기에 추가했습니다.

  // --- 컨트롤 함수 ---
  const toggleTimer = () => {
    // 처음 시작할 때만 시작 사운드 재생
    if (!isActive && seconds === PLANK_TIME && currentSet === 1 && !isResting) {
      startSound.current.play();
    }
    setIsActive(!isActive);
  };

  const adjustTime = (amount) => {
    if (isActive) return;
    // 운동 시간 설정만 조절 가능하도록
    if (!isResting) {
        setSeconds(prev => Math.max(0, prev + amount));
    }
  };

  const reset = () => {
    setIsActive(false);
    setIsResting(false);
    setCurrentSet(1);
    setSeconds(PLANK_TIME);
  };

  // 현재 타이머의 전체 시간 (원형 UI 계산용)
  const totalDuration = isResting ? REST_TIME : PLANK_TIME;

  return (
    <div className="timer-app-container">
      <div className={`timer-ui-container ${isResting ? 'resting' : ''}`}>
        <div className="status-display">
          <p className="set-counter">SET {currentSet} / {TOTAL_SETS} {isResting ? '      REST' : ''}</p>
        </div>
        <CircularTimer 
            seconds={seconds} 
            formatTime={formatTime}
            totalDuration={totalDuration} // 전체 시간을 prop으로 전달
        />
        <Controls 
          isActive={isActive}
          toggleTimer={toggleTimer}
          adjustTime={adjustTime}
          reset={reset}
        />
      </div>
    </div>
  );
}

export default App;
