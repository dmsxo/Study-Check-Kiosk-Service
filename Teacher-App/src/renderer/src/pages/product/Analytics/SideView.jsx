import { X, Calendar, Clock, Percent } from 'lucide-react';
import Card from '../../../components/UI/CardUI';
import CalendarUI from '../../../components/Calendar';

function SideView({ selectedStudent, setSelectedStudent }) {
  // 한달치 dummy 출석 (api로 대체)
  const attendances = [{ level: 1, checkin: '07:30', checkout: '08:30' }];

  const dayContent = (date) => {
    return (
      <div className="bg-white border border-slate-200 min-h-16 rounded-xl p-2">
        <label className="block">{Number(date.split('-')[2])}</label>
      </div>
    );
  };

  return (
    <div className="bg-white flex flex-col border-l border-gray-200 overflow-auto rounded-r h-full w-full scrollbar-hide">
      <div className="p-8 border-b border-gray-100">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500 mt-1">{selectedStudent.student_id}</p>
            <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h2>
          </div>
          <button
            onClick={() => setSelectedStudent(null)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card Icon={Calendar} color={'blue'} title="총 출석일" value="20일" />
          <Card Icon={Clock} color={'green'} title="총 공부 시간" value="150 시간" />
          <Card Icon={Percent} color={'purple'} title="출석률" value="100%" />
        </div>
      </div>

      <div className="flex-1 p-8 space-y-5">
        <h3 className="text-lg font-bold text-gray-900">캘린더 보기</h3>
        <CalendarUI header={false} dayContent={dayContent} />
      </div>
    </div>
  );
}

export default SideView;
