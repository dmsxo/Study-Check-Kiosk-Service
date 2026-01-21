const COLORS = {
  blue: {
    border: 'border-blue-100',
    bg: 'bg-blue-50',
    icon: 'text-blue-500',
    text: 'text-blue-700'
  },
  green: {
    border: 'border-green-100',
    bg: 'bg-green-50',
    icon: 'text-green-500',
    text: 'text-green-700'
  },
  red: {
    border: 'border-red-100',
    bg: 'bg-red-50',
    icon: 'text-red-500',
    text: 'text-red-700'
  },
  gray: {
    border: 'border-gray-100',
    bg: 'bg-gray-50',
    icon: 'text-gray-500',
    text: 'text-gray-700'
  },
  purple: {
    border: 'border-purple-100',
    bg: 'bg-purple-50',
    icon: 'text-purple-500',
    text: 'text-purple-700'
  }
};

function Card({ Icon, title, value, color }) {
  const { border, bg, icon, text } = COLORS[color] || COLORS.gray;
  return (
    <div className={`border ${border} rounded-lg p-3 ${bg}`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className={`w-3.5 h-3.5 ${icon}`} />
        <div className={`text-sm ${text} font-medium`}>{title}</div>
      </div>
      <div className={`text-2xl font-semibold ${text}`}>{value}</div>
    </div>
  );
}

export default Card;
