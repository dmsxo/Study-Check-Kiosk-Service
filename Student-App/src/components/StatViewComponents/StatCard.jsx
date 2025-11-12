function StatCard({
  Icon,
  color,
  title,
  value,
  bgColor = 'bg-gray-50',
  borderColor = 'border-gray-200',
}) {
  return (
    <div className={`border ${borderColor} rounded-lg p-3 ${bgColor}`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className={`w-3.5 h-3.5 ${color}`} />
        <div className="text-xs text-gray-600 font-medium">{title}</div>
      </div>
      <div className="text-xl font-semibold text-gray-900">{value}</div>
    </div>
  );
}

export default StatCard;
