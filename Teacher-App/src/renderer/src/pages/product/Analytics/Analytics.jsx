import { useState, useEffect, useRef } from 'react';
import AnalyticsMainContents from './AnalyiticsMainContents';
import SideView from './SideView';

function Analytics() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [contentWidth, setContentWidth] = useState(50); // % 기준
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(50);

  const containerRef = useRef(null);
  const animationRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.clientX);
    setStartWidth(contentWidth);
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const MIN_WIDTH = 40; // 최소 퍼센트
    const MAX_WIDTH = 60; // 최대 퍼센트

    animationRef.current = requestAnimationFrame(() => {
      const containerWidth = containerRef.current.offsetWidth;
      const delta = ((e.clientX - startX) / containerWidth) * 100;
      const newWidth = startWidth + delta;
      const boundedWidth = Math.min(Math.max(newWidth, MIN_WIDTH), MAX_WIDTH);
      setContentWidth(boundedWidth);
    });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    document.body.style.userSelect = '';
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div ref={containerRef} className="flex h-full">
      {/* Main Contents */}
      <div
        style={selectedStudent ? { width: `${contentWidth}%`, minWidth: '200px' } : { flex: 1 }}
        className="flex flex-col overflow-auto scrollbar-hide"
      >
        <AnalyticsMainContents
          setSelectedStudent={setSelectedStudent}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
      </div>

      {/* Handle */}
      {selectedStudent && (
        <div
          onMouseDown={handleMouseDown}
          className="w-1 bg-gray-200 hover:bg-blue-500 cursor-col-resize transition-colors relative group shrink-0 ml-4"
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-16 bg-gray-300 group-hover:bg-blue-600 rounded-full"></div>
        </div>
      )}

      {/* SideView */}
      {selectedStudent && (
        <SideView
          contentWidth={contentWidth}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
        />
      )}
    </div>
  );
}

export default Analytics;
