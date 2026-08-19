'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './EmergencyCallControl.module.css';

const HOLD_MS = 3000;

export default function EmergencyCallControl() {
  const [holding, setHolding] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const startedRef = useRef(0);
  const rafRef = useRef(null);

  const stopAnimation = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const resetHold = () => {
    clearTimeout(timerRef.current);
    stopAnimation();
    if (!unlocked) setProgress(0);
    setHolding(false);
  };

  const animate = () => {
    const elapsed = Date.now() - startedRef.current;
    setProgress(Math.min(100, (elapsed / HOLD_MS) * 100));
    if (elapsed < HOLD_MS) rafRef.current = requestAnimationFrame(animate);
  };

  const startHold = (event) => {
    if (unlocked) return;
    event.preventDefault();
    startedRef.current = Date.now();
    setHolding(true);
    setProgress(0);
    rafRef.current = requestAnimationFrame(animate);
    timerRef.current = setTimeout(() => {
      stopAnimation();
      setProgress(100);
      setHolding(false);
      setUnlocked(true);
    }, HOLD_MS);
  };

  useEffect(() => () => {
    clearTimeout(timerRef.current);
    stopAnimation();
  }, []);

  const slide = (event) => {
    const value = Number(event.target.value);
    setProgress(value);
    if (value >= 98) {
      event.target.value = '100';
      window.location.href = 'tel:000';
    }
  };

  return (
    <section className={styles.wrap} aria-label="Emergency call control">
      <div className={styles.heading}>
        <strong>Emergency — Call 000</strong>
        <span>Two deliberate actions prevent accidental calls.</span>
      </div>

      {!unlocked ? (
        <button
          type="button"
          className={`${styles.holdButton} ${holding ? styles.holding : ''}`}
          onPointerDown={startHold}
          onPointerUp={resetHold}
          onPointerCancel={resetHold}
          onPointerLeave={resetHold}
          onContextMenu={(event) => event.preventDefault()}
          aria-label="Press and hold for three seconds to unlock emergency call slider"
        >
          <span className={styles.fill} style={{ width: `${progress}%` }} aria-hidden="true" />
          <span className={styles.buttonText}>{holding ? 'Keep holding… 3 seconds' : 'Press & hold for 3 seconds'}</span>
        </button>
      ) : (
        <div className={styles.sliderPanel}>
          <label htmlFor="emergency-slide">Slide all the way to call 000</label>
          <input
            id="emergency-slide"
            className={styles.slider}
            type="range"
            min="0"
            max="100"
            defaultValue="0"
            onChange={slide}
            aria-label="Slide all the way to call triple zero"
          />
          <button type="button" className={styles.cancel} onClick={() => { setUnlocked(false); setProgress(0); }}>
            Cancel
          </button>
        </div>
      )}
    </section>
  );
}
