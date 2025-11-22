function DateSelecter({ title, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{title}</label>
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 text-gray-700"
      />
    </div>
  );
}

export default DateSelecter;
