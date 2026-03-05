// Хук для плавной анимации изменения минимального и максимального года
// Возвращает анимированные значения

import { useState, useRef, useEffect } from "react";
import { UseYearAnimationProps } from "@/types/hooks";

import gsap from "gsap";

export const useYearAnimation = ({ minYear, maxYear }: UseYearAnimationProps) => {
  const [animatedMinYear, setAnimatedMinYear] = useState<number>(minYear);
  const [animatedMaxYear, setAnimatedMaxYear] = useState<number>(maxYear);

  const prevMinYearRef = useRef<number>(minYear);
  const prevMaxYearRef = useRef<number>(maxYear);
  const minYearTweenRef = useRef<gsap.core.Tween | null>(null);
  const maxYearTweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (prevMinYearRef.current === minYear && prevMaxYearRef.current === maxYear) return;

    const duration = 1.5;
    const ease = "power2.out";

    const isFirstRender = prevMinYearRef.current === 0 && prevMaxYearRef.current === 0;
    if (isFirstRender) {
      setAnimatedMinYear(minYear);
      setAnimatedMaxYear(maxYear);
      prevMinYearRef.current = minYear;
      prevMaxYearRef.current = maxYear;
      return;
    }

    // Убиваем предыдущие твины, если они есть
    if (minYearTweenRef.current) minYearTweenRef.current.kill();
    if (maxYearTweenRef.current) maxYearTweenRef.current.kill();

    // Сохраняем текущие анимированные значения как начальные для твина
    prevMinYearRef.current = animatedMinYear;
    prevMaxYearRef.current = animatedMaxYear;

    minYearTweenRef.current = gsap.to(prevMinYearRef, {
      current: minYear,
      duration,
      ease,
      onUpdate: () => {
        setAnimatedMinYear(Math.round(prevMinYearRef.current));
      },
      onComplete: () => {
        prevMinYearRef.current = minYear;
        minYearTweenRef.current = null;
      },
    });

    maxYearTweenRef.current = gsap.to(prevMaxYearRef, {
      current: maxYear,
      duration,
      ease,
      onUpdate: () => {
        setAnimatedMaxYear(Math.round(prevMaxYearRef.current));
      },
      onComplete: () => {
        prevMaxYearRef.current = maxYear;
        maxYearTweenRef.current = null;
      },
    });

    // Очистка при размонтировании
    return () => {
      if (minYearTweenRef.current) minYearTweenRef.current.kill();
      if (maxYearTweenRef.current) maxYearTweenRef.current.kill();
    };
  }, [minYear, maxYear]);

  return { animatedMinYear, animatedMaxYear };
};