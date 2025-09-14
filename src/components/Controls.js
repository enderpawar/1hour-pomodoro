export function Controls({ isActive, toggleTimer, adjustTime, reset }) {
  return (
    <>
      <div className="controls">
        <button onClick={() => adjustTime(-900)} disabled={isActive}>-15분</button>
        <button onClick={toggleTimer} className="play-pause-btn">
          {isActive ? '일시정지' : '시작'}
        </button>
        <button onClick={() => adjustTime(900)} disabled={isActive}>+15분</button>
      </div>
      <button onClick={reset} className="reset-btn">RESET</button>
    </>
  );
}
