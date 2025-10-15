function Toggle({ checked, onChange }) {
  return (
    <label className="relative inline-flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-300 rounded-full transition-colors peer-checked:bg-blue-500 peer-focus:outline-none" />
      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 peer-checked:translate-x-5" />
    </label>
  );
}

export default Toggle;
