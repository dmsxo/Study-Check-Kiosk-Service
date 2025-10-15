function ToggleTabs({
  categories,
  buttonNames,
  value,
  onChange,
  addStyle = '',
}) {
  return (
    <div className={`relative bg-gray-100 rounded-xl p-1 flex ${addStyle}`}>
      <div
        className="absolute top-1 bottom-1 bg-white rounded-lg shadow-md transition-all duration-300 ease-out"
        style={{
          left: `calc(${
            (categories.indexOf(value) / categories.length) * 100
          }% + 0.25rem)`,
          width: `calc(${100 / categories.length}% - 0.5rem)`,
        }}
      />
      {categories.map((cat, index) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`relative z-10 flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
            value === cat
              ? 'text-gray-900'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          {buttonNames[index]}
        </button>
      ))}
    </div>
  );
}

export default ToggleTabs;
