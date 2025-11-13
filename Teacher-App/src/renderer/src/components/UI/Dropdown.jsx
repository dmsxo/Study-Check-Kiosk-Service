import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

function selectedMessege(options, option_cnt) {
  // option.length > 0
  if (options.length === option_cnt) return '전체 선택';
  else if (options.length <= 2) return options.join(', ');
  else return options.slice(0, 2).join(', ') + `외 ${options.length - 2}개 선택됨`;
}

function Dropdown({
  title = '타이틀',
  options,
  placeholder = '옵션을 선택하세요',
  onChange,
  multiSelect
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = (option) => {
    let newSelectedItems;
    if (multiSelect) {
      if (selectedItems.includes(option)) {
        newSelectedItems = selectedItems.filter((item) => item !== option);
      } else {
        newSelectedItems = [...selectedItems, option];
      }
    } else {
      if (selectedItems.includes(option)) newSelectedItems = [];
      else newSelectedItems = [option];
    }
    setSelectedItems(newSelectedItems);
    if (onChange) {
      onChange(newSelectedItems);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{title}</label>
      {/* 드롭다운 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 flex items-center justify-between hover:border-gray-400 transition-colors duration-150"
      >
        <span className="text-gray-700">
          {selectedItems.length > 0 ? selectedMessege(selectedItems, options.length) : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-150 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-xl overflow-hidden z-10">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleToggle(option)}
              className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors duration-100 border-b border-gray-200 last:border-b-0 flex items-center justify-between ${
                selectedItems.includes(option) ? 'bg-gray-50' : ''
              }`}
            >
              <span
                className={`${selectedItems.includes(option) ? 'text-gray-900' : 'text-gray-700'}`}
              >
                {option}
              </span>
              {selectedItems.includes(option) && <span className="text-gray-900">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
