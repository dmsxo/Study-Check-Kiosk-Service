import LayoutContainer from '../../components/UI/LayoutContainer';
import Card from '../../components/UI/CardUI';
import { Users, UserPen, UserX, LogOut } from 'lucide-react';
import dayjs from 'dayjs';
import Dropdown from '../../components/UI/Dropdown';
import StudentTreeDropdown from '../../components/UI/StudentTreeDropdown';
import { useEffect, useMemo, useState } from 'react';
import { getUserByFilter } from '../../api/StudentManagementAPI';

function Dashboard() {
  // filter options
  const states = ['미참여', '공부중', '퇴실'];
  const types = ['아침 독서', '야간 자율 학습'];

  // week day names
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const today = dayjs().tz('Asia/Seoul');
  const weekDay = days[dayjs().tz('Asia/Seoul').day()];

  const getStatusBadge = (status) => {
    const styles = {
      공부중: 'bg-green-100 text-green-800 border-green-200',
      퇴실: 'bg-gray-100 text-gray-800 border-gray-200',
      미참여: 'bg-red-100 text-red-800 border-red-200'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  // student list (dummy)
  const [studentList, setStudentList] = useState([
    {
      studentId: 20129,
      name: '황은태',
      status: '공부중',
      check_in_time: 'hh:mm:ss',
      check_out_time: 'hh:mm:ss'
    },
    {
      studentId: 20618,
      name: '박지원',
      status: '공부중',
      check_in_time: 'hh:mm:ss',
      check_out_time: 'hh:mm:ss'
    },
    {
      studentId: 20701,
      name: '김한율',
      status: '퇴실',
      check_in_time: 'hh:mm:ss',
      check_out_time: 'hh:mm:ss'
    },
    {
      studentId: 20319,
      name: '정성훈',
      status: '미참여',
      check_in_time: 'hh:mm:ss',
      check_out_time: 'hh:mm:ss'
    },
    {
      studentId: 20105,
      name: '문승준',
      status: '퇴실',
      check_in_time: 'hh:mm:ss',
      check_out_time: 'hh:mm:ss'
    },
    {
      studentId: 20619,
      name: '박종석',
      status: '미참여',
      check_in_time: 'hh:mm:ss',
      check_out_time: 'hh:mm:ss'
    }
  ]);

  const [studyType, setStudyType] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [status, setStatus] = useState(states);

  useEffect(() => {
    async function getStudents(type) {
      console.log(type);
      const date = today.format('YYYY-MM-DD');
      return await getUserByFilter(type, date, date);
    }
    if (studyType[0] === '아침 독서' || studyType[0] === '야간 자율 학습') {
      getStudents(studyType[0] === '아침 독서' ? 'morning' : 'night').then((res) => {
        setStudentList(res);
        console.log(res);
        setSelected(new Set(res.map((s) => s.studentId)));
        console.log(selected);
      });
    }
  }, [studyType]);

  const studentMap = useMemo(() => {
    return new Map(studentList.map((s) => [s.studentId, s]));
  }, [studentList]);

  return (
    <div className="space-y-5 min-w-fit">
      {/* title */}
      <h1 className="font-semibold text-3xl text-gray-900">오늘의 출석</h1>

      {/* 필터 */}
      <LayoutContainer>
        <h2 className="font-semibold text-2xl mb-3">학생 필터</h2>

        <div className="grid grid-cols-3 gap-x-5 gap-y-15">
          <Dropdown
            title="공부 유형"
            options={types}
            onChange={setStudyType}
            placeholder="공부 유형 선택"
            multiSelect={false}
          />
          <div className="relative w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">학생 선택</label>
            <StudentTreeDropdown
              students={studentList}
              selected={selected}
              onSelectedChange={setSelected}
            />
          </div>
          <Dropdown
            title="상태"
            options={states}
            value={status}
            onChange={setStatus}
            placeholder="상태 선택"
            multiSelect={true}
          />
        </div>
      </LayoutContainer>

      {/* 개요 */}
      <LayoutContainer>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-2xl">개요</h2>
          <h3 className="text-gray-600 text-sm mr-2">
            {today.format('YYYY년 MM월 DD일')} ({weekDay})
          </h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 px-2">
          <Card title="총 인원" Icon={Users} color={'blue'} value={'5명'} />
          <Card title="공부중" Icon={UserPen} color={'green'} value={'5명'} />
          <Card title="미참여/결석" Icon={UserX} color={'red'} value={'5명'} />
          <Card title="퇴실 인원" Icon={LogOut} color={'gray'} value={'5명'} />
        </div>
      </LayoutContainer>

      {/* 학생 목록 */}
      <LayoutContainer className="min-w-fit">
        <h2 className="font-semibold text-2xl mb-3">학생 목록</h2>

        <div className="overflow-x-auto rounded-xl border border-gray-100 mt-6">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-slate-200 rounded-2xl">
                <th className="whitespace-nowrap px-5 py-3 text-sm text-left text-gray-500">
                  학번
                </th>
                <th className="whitespace-nowrap px-5 py-3 text-sm text-left text-gray-500">
                  이름
                </th>
                <th className="whitespace-nowrap px-5 py-3 text-sm text-left text-gray-500">
                  현재 상태
                </th>
                <th className="whitespace-nowrap px-5 py-3 text-sm text-left text-gray-500">
                  체크인시간
                </th>
                <th className="whitespace-nowrap px-5 py-3 text-sm text-left text-gray-500">
                  체크아웃 시간
                </th>
                <th className="whitespace-nowrap px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {[...selected].map((id) => {
                const student = studentMap.get(id);
                if (!status.includes(student.status)) return null;
                return (
                  <tr key={student.studentId}>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-900">
                      {student.studentId}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-900">
                      {student.name}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {getStatusBadge(student.status)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600 font-mono">
                      {student.check_in_time}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600 font-mono">
                      {student.check_out_time}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-blue-600">수정</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </LayoutContainer>
    </div>
  );
}

export default Dashboard;
