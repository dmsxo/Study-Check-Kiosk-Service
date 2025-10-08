// TicketBackground.jsx
// SVG로 구성된 세로형 티켓 배경 컴포넌트
// 중앙 구멍 없이 양옆에 하나씩만 실제로 투명하게 뚫린 구멍이 있고, 그 사이에 절취선이 이어지는 형태
// 외곽선 제거, 절취선 색상만 props로 조절 가능, 반응형 지원

export default function TicketBackground({
  radius = 20,
  notchRatioY = 0.5, // 높이 대비 구멍 위치 비율
  notchRatioRadius = 0.05, // 폭 대비 구멍 반지름 비율
  cutLineColor = '#9ca3af', // 절취선 색상
  className = '',
  children,
}) {
  return (
    <div className={`relative aspect-[360/600] ${className}`}>
      {' '}
      {/* 기본 비율 유지 */}
      <svg viewBox="0 0 360 600" className="w-full h-full block">
        {/* 티켓 형태 기본 외곽과 구멍을 포함한 전체 경계 */}
        <defs>
          <mask id="ticketMask">
            <rect
              x="0"
              y="0"
              width="360"
              height="600"
              rx={radius}
              ry={radius}
              fill="white"
            />
            {/* 양쪽 구멍을 투명하게 뚫기 */}
            <circle
              cx={0}
              cy={600 * notchRatioY}
              r={360 * notchRatioRadius}
              fill="black"
            />
            <circle
              cx={360}
              cy={600 * notchRatioY}
              r={360 * notchRatioRadius}
              fill="black"
            />
          </mask>
        </defs>

        {/* 배경 */}
        <rect
          x="0"
          y="0"
          width={360}
          height={600}
          rx={radius}
          ry={radius}
          fill="#ffffff"
          mask="url(#ticketMask)"
        />

        {/* 절취선 */}
        <line
          x1={360 * notchRatioRadius * 2}
          y1={600 * notchRatioY}
          x2={360 - 360 * notchRatioRadius * 2}
          y2={600 * notchRatioY}
          stroke={cutLineColor}
          strokeWidth="2"
          strokeDasharray="6 8"
        />
      </svg>
      {/* 사용자 콘텐츠 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full flex flex-col">{children}</div>
      </div>
    </div>
  );
}
