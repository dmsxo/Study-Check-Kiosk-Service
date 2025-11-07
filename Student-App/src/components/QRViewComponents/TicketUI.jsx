export default function TicketBackground({
  rounded = '2xl',
  notchPosition = 'center', // 'top', 'center', 'bottom' 등으로 구멍 위치 조절
  notchSize = 500000000, // 구멍 반지름(px)
  cutLineColor = '#9ca3af', // 절취선 색상
  backgroundColor = '#ffffff', // 배경색
  className = '',
  style = {},
  children,
}) {
  // notchPosition을 비율로 변환
  const notchY =
    notchPosition === 'top'
      ? '25%'
      : notchPosition === 'bottom'
      ? '75%'
      : '50%';

  return (
    <div
      className={`relative overflow-hidden rounded-${rounded} ${className}`}
      style={{ backgroundColor, ...style }}
    >
      {/* 왼쪽 구멍 */}
      <div
        className="absolute bg-transparent"
        style={{
          left: 0,
          top: `calc(${notchY} - ${notchSize}px)`,
          width: `${notchSize * 2}px`,
          height: `${notchSize * 2}px`,
          borderRadius: '50%',
          boxShadow: `0 0 0 100vmax ${backgroundColor}, inset 0 0 0 100vmax transparent`,
          WebkitMaskImage:
            'radial-gradient(circle, transparent 70%, black 71%)',
          maskImage: 'radial-gradient(circle, transparent 70%, black 71%)',
        }}
      />

      {/* 오른쪽 구멍 */}
      <div
        className="absolute bg-transparent"
        style={{
          right: 0,
          top: `calc(${notchY} - ${notchSize}px)`,
          width: `${notchSize * 2}px`,
          height: `${notchSize * 2}px`,
          borderRadius: '50%',
          boxShadow: `0 0 0 100vmax ${backgroundColor}, inset 0 0 0 100vmax transparent`,
          WebkitMaskImage:
            'radial-gradient(circle, transparent 70%, black 71%)',
          maskImage: 'radial-gradient(circle, transparent 70%, black 71%)',
        }}
      />

      {/* 절취선 */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: notchY,
          height: '1px',
          borderTop: `2px dashed ${cutLineColor}`,
          zIndex: 10,
        }}
      />

      {/* 콘텐츠 */}
      <div className="relative w-full h-full">{children}</div>
    </div>
  );
}
