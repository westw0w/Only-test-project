import { useState, useId, useRef, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Virtual, Pagination } from "swiper/modules";
import type { PaginationOptions } from "swiper/types";
import { useNewsData } from "@/hooks/useNewsData";
import { useCarouselAnimation } from "@/hooks/useCarouselAnimation";
import { useYearAnimation } from "@/hooks/useYearAnimation";
import { NewsItem } from "@/types/history";

import Loader from "@/components/Loader";
import gsap from "gsap";

import "swiper/css";

const History = () => {
  const { data, loading, error } = useNewsData();
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number>(0);
  const uniqueId = useId().replace(/:/g, "_");
  const swiperWrapperRef = useRef<HTMLDivElement>(null);

  const categories = data ? Object.keys(data.news) : [];
  const currentCategory = categories[currentCategoryIndex] || "";
  const newsByYear = data && currentCategory ? data.news[currentCategory as keyof typeof data.news] || {} : {};
  const newsItems: NewsItem[] = Object.entries(newsByYear).map(([year, description]) => ({
    year: parseInt(year, 10),
    description: description as string,
  }));
  const { minYear, maxYear } = newsItems.length === 0
    ? { minYear: 0, maxYear: 0 }
    : {
      minYear: Math.min(...newsItems.map(item => item.year)),
      maxYear: Math.max(...newsItems.map(item => item.year)),
    };

  const { animatedMinYear, animatedMaxYear } = useYearAnimation({
    minYear,
    maxYear,
  });

  const { carouselRef, buttonsRef, rotateCarouselToIndex } =
    useCarouselAnimation({
      categories,
      currentCategoryIndex,
    });

  const swiperNavigation = {
    prevEl: `.swiper--prev-${uniqueId}`,
    nextEl: `.swiper--next-${uniqueId}`,
  };

  const swiperPagination = {
    el: `.swiper--pagination-${uniqueId}`,
    type: "bullets" as const,
    clickable: true,
  };

  const isAnimatingRef = useRef(false);

  const switchCategoryWithAnimation = useCallback(async (targetIndex: number) => {
    if (!swiperWrapperRef.current || isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    gsap.killTweensOf(swiperWrapperRef.current);

    await gsap.to(swiperWrapperRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
    });

    const currentIndex = currentCategoryIndex;
    setCurrentCategoryIndex(targetIndex);
    rotateCarouselToIndex(currentIndex, targetIndex);
    gsap.to(swiperWrapperRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });
  }, [currentCategoryIndex, rotateCarouselToIndex]);

  const handleCategoryClick = useCallback((targetIndex: number) => {
    switchCategoryWithAnimation(targetIndex);
  }, [switchCategoryWithAnimation]);

  const handlePrevCategory = useCallback(() => {
    const newIndex =
      currentCategoryIndex === 0 ? categories.length - 1 : currentCategoryIndex - 1;
    switchCategoryWithAnimation(newIndex);
  }, [currentCategoryIndex, categories.length, switchCategoryWithAnimation]);

  const handleNextCategory = useCallback(() => {
    const newIndex =
      currentCategoryIndex === categories.length - 1 ? 0 : currentCategoryIndex + 1;
    switchCategoryWithAnimation(newIndex);
  }, [currentCategoryIndex, categories.length, switchCategoryWithAnimation]);

  if (loading) {
    return (
      <section>
        <div className="container">
          <div className="history">
            <h2 className="history__title">Исторические даты</h2>
            <Loader />
            <div className="history__bg-lines">
              <div className="history__bg-line"></div>
              <div className="history__bg-line"></div>
              <div className="history__bg-line"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section>
        <div className="container">
          <div className="history">
            <h2 className="history__title">Исторические даты</h2>
            <p>Ошибка: {error || "Данные не найдены"}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="container">
        <div className="history">
          <h2 className="history__title">Исторические даты</h2>
          <div className="history__dates">
            <span className="history__dates-start">{animatedMinYear}</span>
            <span className="history__dates-end">{animatedMaxYear}</span>
          </div>
          <div className="history__category-list" ref={carouselRef}>
            {categories.map((category, index) => (
              <button
                key={index}
                className={`history__category-btn ${index === currentCategoryIndex
                  ? "history__category-btn--active"
                  : ""
                  }`}
                type="button"
                ref={(el) => {
                  if (el) buttonsRef.current[index] = el;
                }}
                onClick={() => handleCategoryClick(index)}
              >
                {index + 1}
                <span className="history__category-name">{category}</span>
              </button>
            ))}
          </div>
          <div className="history__bg-lines">
            <div className="history__bg-line"></div>
            <div className="history__bg-line"></div>
            <div className="history__bg-line"></div>
          </div>
          <div className="history__navigation">
            <span className="history__nav-category">
              {(currentCategoryIndex + 1).toString().padStart(2, "0")} /{" "}
              {categories.length.toString().padStart(2, "0")}
            </span>
            <div className="history__nav-wrapper">
              <button
                className={
                  currentCategoryIndex === 0
                    ? "history__nav-button history__category-prev history__nav-button--disabled"
                    : "history__nav-button history__category-prev"
                }
                onClick={handlePrevCategory}
                aria-label="Предыдущая категория"
              >
                &lt;
              </button>
              <button
                className={
                  currentCategoryIndex === categories.length - 1
                    ? "history__nav-button history__category-next history__nav-button--disabled"
                    : "history__nav-button history__category-next"
                }
                onClick={handleNextCategory}
                aria-label="Следующая категория"
              >
                &gt;
              </button>
            </div>
          </div>
          <div className="history__swiper-wrapper" ref={swiperWrapperRef}>
            <button
              className={`history__nav-button history__nav-button--colored history__swiper-button--prev swiper--prev-${uniqueId}`}
              aria-label="Предыдущая новость"
            >
              &lt;
            </button>
            <button
              className={`history__nav-button history__nav-button--colored history__swiper-button--next swiper--next-${uniqueId}`}
              aria-label="Следующая новость"
            >
              &gt;
            </button>
            <Swiper
              modules={[Navigation, Virtual, Pagination]}
              spaceBetween={window.innerWidth > 1023 ? 80 : 25}
              slidesPerView={window.innerWidth > 1023 ? 3 : 1.6}
              navigation={swiperNavigation}
              pagination={swiperPagination}
              virtual
            >
              {newsItems.map((item, index) => (
                <SwiperSlide key={item.year} virtualIndex={index}>
                  <div className="history__news">
                    <span className="history__news-year">{item.year}</span>
                    <p className="history__news-description">
                      {item.description}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className={`swiper-pagination swiper--pagination-${uniqueId}`} />
        </div>
      </div>
    </section>
  );
};

export default History;
