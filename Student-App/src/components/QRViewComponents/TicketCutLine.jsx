// TicketCutLine.jsx
import React from 'react';

const TicketCutLine = ({
  holeSize = 'w-4 h-8',
  lineHeight = 'h-8',
  bgColor = 'bg-gray-100',
}) => {
  return (
    <div className={`relative bg-white ${lineHeight}`}>
      {/* 점선 */}
      <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-gray-300 transform -translate-y-1/2"></div>

      {/* 왼쪽 반원 구멍 - 오른쪽에만 테두리 */}
      <div
        className={`absolute left-0 top-1/2 transform -translate-y-1/2 ${holeSize} ${bgColor} rounded-r-full`}
      ></div>

      {/* 오른쪽 반원 구멍 - 왼쪽에만 테두리 */}
      <div
        className={`absolute right-0 top-1/2 transform -translate-y-1/2 ${holeSize} ${bgColor} rounded-l-full`}
      ></div>
    </div>
  );
};

export default TicketCutLine;
