import React, { useState, useEffect, useRef } from 'react';
import GameImage from '../assets/posters/GameImage.png';
import KioskImage from '../assets/posters/KioskImage.png';
import RobloxImage from '../assets/posters/RobloxImage.png';

const Carousel = () => {
  const images = [
    { id: 1, file: KioskImage, title: '키오스크' },
    { id: 2, file: GameImage, title: '게임' },
    { id: 3, file: RobloxImage, title: '로블록스' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const autoPlayRef = useRef(null);

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    startAutoPlay();
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    startAutoPlay();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    startAutoPlay();
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - e.currentTarget.offsetLeft);
    stopAutoPlay();
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
    stopAutoPlay();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = x - startX;
    setTranslateX(walk);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX;
    const walk = x - startX;
    setTranslateX(walk);
  };

  const handleDragEnd = () => {
    setIsDragging(false);

    if (Math.abs(translateX) > 50) {
      if (translateX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    } else {
      startAutoPlay();
    }

    setTranslateX(0);
  };

  return (
    <div className="w-full h-full relative overflow-hidden rounded-2xl bg-white">
      {/* 이미지 컨테이너 */}
      <div
        className="h-full relative cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
      >
        <div
          className="h-full flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))`,
            transition: isDragging ? 'none' : 'transform 0.5s ease-out'
          }}
        >
          {images.map((image) => (
            <div
              key={image.id}
              className="min-w-full h-full min-h-0 flex items-center justify-center"
            >
              <img
                src={image.file}
                alt={image.title}
                className="h-full obect-contain"
                draggable="false"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 인디케이터 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
