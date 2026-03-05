// Хук для управления анимацией круговой карусели категорий
// Возвращает refs для контейнера карусели и кнопок, а также функцию вращения

import { useRef, useEffect } from "react";
import { UseCarouselAnimationProps } from "@/types/hooks";

import gsap from "gsap";

export const useCarouselAnimation = ({
  categories,
  currentCategoryIndex,
}: UseCarouselAnimationProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLButtonElement[]>([]);
  const currentAngleRef = useRef<number>(0);

  const radius = 265;
  const angleStep = categories.length > 0 ? 360 / categories.length : 0;
  const duration = 1.5;
  const ease = "power2.out";

  useEffect(() => {
    if (!carouselRef.current || categories.length === 0) return;

    const centerX = radius;
    const centerY = radius;

    buttonsRef.current.forEach((btn, index) => {
      if (!btn) return;
      const angle = (index * angleStep - 60) * (Math.PI / 180);
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      gsap.set(btn, {
        x,
        y,
        transformOrigin: "center",
      });
    });

    rotateCarouselToIndex(currentCategoryIndex, currentCategoryIndex);
  }, [categories, currentCategoryIndex]);

  const rotateCarouselToIndex = (currentIndex: number, targetIndex: number) => {
    if (!carouselRef.current || categories.length === 0) return;

    let diff = targetIndex - currentIndex;
    if (Math.abs(diff) > categories.length / 2) {
      diff = diff > 0 ? diff - categories.length : diff + categories.length;
    }
    const deltaRotation = -diff * angleStep;
    const targetAngle = currentAngleRef.current + deltaRotation;

    gsap.to(carouselRef.current, {
      rotation: targetAngle,
      duration,
      ease,
      transformOrigin: "center",
    });

    buttonsRef.current.forEach((btn) => {
      if (btn) {
        gsap.to(btn, {
          rotation: -targetAngle,
          duration,
          ease,
          transformOrigin: "center",
        });
      }
    });

    currentAngleRef.current = targetAngle;
  };

  return {
    carouselRef,
    buttonsRef,
    rotateCarouselToIndex,
  };
};