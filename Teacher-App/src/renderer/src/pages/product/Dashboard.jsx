import LayoutContainer from '../../components/UI/LayoutContainer';
import Card from '../../components/UI/CardUI';
import { Users, UserPen, UserX, LogOut } from 'lucide-react';
import dayjs from 'dayjs';
import Dropdown from '../../components/UI/Dropdown';

function Dashboard() {
  // filter options
  const grades = ['1학년', '2학년', '3학년'];
  const classes = ['1반', '2반', '3반', '4반', '5반', '6반', '7반', '8반', '9반', '10반'];
  const states = ['미참여', '공부중', '퇴실'];
  const types = ['아침 독서', '야간 자율 학습'];

  // week day names
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const today = dayjs().tz('Asia/Seoul').format('YYYY년 MM월 DD일');
  const weekDay = days[dayjs().tz('Asia/Seoul').day()];

  // student list (dummy)
  const list = [
    {
      student_id: 20129,
      name: '황은태',
      status: '공부중',
      check_in_time: 'hh:mm:ss',
      check_out_time: 'hh:mm:ss'
    },
    {
      student_id: 20129,
      name: '박지원',
      status: '공부중',
      check_in_time: 'hh:mm:ss',
      check_out_time: 'hh:mm:ss'
    },
    {
      student_id: 20129,
      name: '김한율',
      status: '퇴실',
      check_in_time: 'hh:mm:ss',
      check_out_time: 'hh:mm:ss'
    },
    {
      student_id: 20129,
      name: '정성훈',
      status: '미참여',
      check_in_time: 'hh:mm:ss',
      check_out_time: 'hh:mm:ss'
    },
    {
      student_id: 20129,
      name: '문승준',
      status: '퇴실',
      check_in_time: 'hh:mm:ss',
      check_out_time: 'hh:mm:ss'
    },
    {
      student_id: 20129,
      name: '박종석',
      status: '미참여',
      check_in_time: 'hh:mm:ss',
      check_out_time: 'hh:mm:ss'
    },
    {
      student_id: 20129,
      name: '황은태',
      status: '공부중',
      check_in_time: 'hh:mm:ss',
      check_out_time: 'hh:mm:ss'
    },
    {
      student_id: 20129,
      name: '박지원',
      status: '공부중',
      check_in_time: 'hh:mm:ss',
      check_out_time: 'hh:mm:ss'
    },
    {
      student_id: 20129,
      name: '김한율',
      status: '퇴실',
      check_in_time: 'hh:mm:ss',
      check_out_time: 'hh:mm:ss'
    },
    {
      student_id: 20129,
      name: '정성훈',
      status: '미참여',
      check_in_time: 'hh:mm:ss',
      check_out_time: 'hh:mm:ss'
    },
    {
      student_id: 20129,
      name: '문승준',
      status: '퇴실',
      check_in_time: 'hh:mm:ss',
      check_out_time: 'hh:mm:ss'
    },
    {
      student_id: 20129,
      name: '박종석',
      status: '미참여',
      check_in_time: 'hh:mm:ss',
      check_out_time: 'hh:mm:ss'
    },
    {
      student_id: 20129,
      name: '황은태',
      status: '공부중',
      check_in_time: 'hh:mm:ss',
      check_out_time: 'hh:mm:ss'
    },
    {
      student_id: 20129,
      name: '박지원',
      status: '공부중',
      check_in_time: 'hh:mm:ss',
      check_out_time: 'hh:mm:ss'
    },
    {
      student_id: 20129,
      name: '김한율',
      status: '퇴실',
      check_in_time: 'hh:mm:ss',
      check_out_time: 'hh:mm:ss'
    },
    {
      student_id: 20129,
      name: '정성훈',
      status: '미참여',
      check_in_time: 'hh:mm:ss',
      check_out_time: 'hh:mm:ss'
    },
    {
      student_id: 20129,
      name: '문승준',
      status: '퇴실',
      check_in_time: 'hh:mm:ss',
      check_out_time: 'hh:mm:ss'
    },
    {
      student_id: 20129,
      name: '박종석',
      status: '미참여',
      check_in_time: 'hh:mm:ss',
      check_out_time: 'hh:mm:ss'
    }
  ];

  return (
    <div className="space-y-5 min-w-fit">
      {/* title */}
      <h1 className="font-semibold text-3xl text-gray-900">오늘의 출석</h1>

      {/* 개요 */}
      <LayoutContainer>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-2xl">개요</h2>
          <h3 className="text-gray-600 text-sm mr-2">
            {today} ({weekDay})
          </h3>
        </div>
        <hr className="text-slate-200 my-3" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 px-2">
          <Card title="총 인원" Icon={Users} color={'blue'} value={'5명'} />
          <Card title="공부중" Icon={UserPen} color={'green'} value={'5명'} />
          <Card title="미참여/결석" Icon={UserX} color={'red'} value={'5명'} />
          <Card title="퇴실 인원" Icon={LogOut} color={'gray'} value={'5명'} />
        </div>
      </LayoutContainer>

      {/* 필터 */}
      <LayoutContainer>
        <h2 className="font-semibold text-2xl mb-3">학생 필터</h2>
        <hr className="text-slate-200 my-3" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-15">
          <Dropdown
            title="학년"
            options={grades}
            onChange={(e) => console.log(e)}
            placeholder="학년 선택"
            multiSelect={true}
          />
          <Dropdown
            title="반"
            options={classes}
            onChange={(e) => console.log(e)}
            placeholder="반 선택"
            multiSelect={true}
          />
          <Dropdown
            title="상태"
            options={states}
            onChange={(e) => console.log(e)}
            placeholder="상태 선택"
            multiSelect={true}
          />
          <Dropdown
            title="공부 유형"
            options={types}
            onChange={(e) => console.log(e)}
            placeholder="공부 유형 선택"
            multiSelect={false}
          />
        </div>
      </LayoutContainer>

      {/* 학생 목록 */}
      <LayoutContainer className="min-w-fit">
        <h2 className="font-semibold text-2xl mb-3">학생 목록</h2>
        <hr className="text-slate-200 my-3" />

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="border-b border-slate-200">
              <th className="whitespace-nowrap px-5 py-3 text-sm text-left text-gray-500">학번</th>
              <th className="whitespace-nowrap px-5 py-3 text-sm text-left text-gray-500">이름</th>
              <th className="whitespace-nowrap px-5 py-3 text-sm text-left text-gray-500">
                현재 상태
              </th>
              <th className="whitespace-nowrap px-5 py-3 text-sm text-left text-gray-500">
                체크인시간
              </th>
              <th className="whitespace-nowrap px-5 py-3 text-sm text-left text-gray-500">
                체크아웃 시간
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {list.map((student) => {
              return (
                <tr key={student.student_id}>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-900">
                    {student.student_id}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-900">
                    {student.name}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">{student.status}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                    {student.check_in_time}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                    {student.check_out_time}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-blue-400">수정</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </LayoutContainer>
    </div>
  );
}

export default Dashboard;
