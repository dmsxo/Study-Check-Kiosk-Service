import React, { useState } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import dayjs from 'dayjs';

// day js 객체
export default function TimePicker({ title, value, onChange }) {
  const [h, m, A] = dayjs
    .tz(dayjs().format('YYYY-MM-DD') + ' ' + value, 'YYYY-MM-DD HH:mm:ss', 'Asia/Seoul')
    .format('hh:mm:A')
    .split(':');
  const [isOpen, setIsOpen] = useState(false);
  const [hour, setHour] = useState(h);
  const [minute, setMinute] = useState(m);
  const [period, setPeriod] = useState(A);

  console.log(hour, minute, period);

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const displayTime = `${hour}:${minute} ${period}`;

  const close = () => {
    onChange(
      dayjs()
        .tz('Asia/Seoul')
        .hour(hour + (period === 'PM' ? 12 : 0))
        .minute(minute)
        .second(0)
        .millisecond(0)
        .format('HH:mm:ss')
    );
    setIsOpen(false);
  };

  return (
    <div className="w-full max-w-xs">
      <label className="block text-sm font-medium text-gray-700 mb-2">{title}</label>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl flex items-center justify-between"
        >
          <span className="flex items-center gap-2 text-gray-700">
            <Clock size={20} />
            {displayTime}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <div className="p-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">시</label>
                  <select
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    className="w-full px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {hours.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">분</label>
                  <select
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
                    className="w-full px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {minutes.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">AM/PM</label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              <button
                onClick={close}
                className="w-full mt-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                확인
              </button>
            </div>
          </div>
        )}
      </div>

      {isOpen && <div className="fixed inset-0 z-0" onClick={close} />}
    </div>
  );
}
