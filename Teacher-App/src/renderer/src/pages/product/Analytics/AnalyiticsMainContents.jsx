import { useState } from 'react';
import LayoutContainer from '../../../components/UI/LayoutContainer';
import Dropdown from '../../../components/UI/Dropdown';
function AnalyticsMainContents({ setSelectedStudent }) {
  // filter options
  const grades = ['1학년', '2학년', '3학년'];
  const classes = ['1반', '2반', '3반', '4반', '5반', '6반', '7반', '8반', '9반', '10반'];
  const states = ['미참여', '공부중', '퇴실'];
  const types = ['아침 독서', '야간 자율 학습'];
  const list = [
    { student_id: 20129, name: '황은태', info: '26/30', hour: 150, rate: '90%' },
    { student_id: 20101, name: '박지원', info: '26/30', hour: 150, rate: '90%' },
    { student_id: 20102, name: '김한율', info: '26/30', hour: 150, rate: '90%' },
    { student_id: 20103, name: '노우성', info: '26/30', hour: 150, rate: '90%' },
    { student_id: 20104, name: '임유겸', info: '26/30', hour: 150, rate: '90%' },
    { student_id: 20105, name: '박종석', info: '26/30', hour: 150, rate: '90%' },
    { student_id: 20106, name: '정성훈', info: '26/30', hour: 150, rate: '90%' },
    { student_id: 20107, name: '이민준', info: '26/30', hour: 150, rate: '90%' },
    { student_id: 20108, name: '문승준', info: '26/30', hour: 150, rate: '90%' },
    { student_id: 20109, name: '조유빈', info: '26/30', hour: 150, rate: '90%' },
    { student_id: 20110, name: '한정훈', info: '26/30', hour: 150, rate: '90%' },
    { student_id: 20111, name: '윤서준', info: '26/30', hour: 150, rate: '90%' },
    { student_id: 20112, name: '안창범', info: '26/30', hour: 150, rate: '90%' },
    { student_id: 20113, name: '김하람', info: '26/30', hour: 150, rate: '90%' },
    { student_id: 20114, name: '조호윤', info: '26/30', hour: 150, rate: '90%' },
    { student_id: 20115, name: '정다혜', info: '26/30', hour: 150, rate: '90%' },
    { student_id: 20116, name: '김동우', info: '26/30', hour: 150, rate: '90%' },
    { student_id: 20117, name: '안재원', info: '26/30', hour: 150, rate: '90%' },
    { student_id: 20118, name: '김동훈', info: '26/30', hour: 150, rate: '90%' },
    { student_id: 20119, name: '박현재', info: '26/30', hour: 150, rate: '90%' }
  ];
  return (
    <>
      <h1 className="font-semibold text-3xl text-gray-900 mb-5">출결 현황</h1>
      {/* 조건 선택 */}
      <LayoutContainer className="mb-5">
        <h2 className="text-2xl font-semibold mb-3 text-gray-900">조회 필터</h2>

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
            title="공부 유형"
            options={types}
            onChange={(e) => console.log(e)}
            placeholder="공부 유형 선택"
            multiSelect={false}
          />
        </div>
      </LayoutContainer>
      {/* 학생 목록 */}
      <LayoutContainer>
        <h2 className="text-2xl font-semibold mb-3 text-gray-900">출석 데이터</h2>

        <table className="w-full min-w-fit">
          <thead className="bg-gray-50">
            <tr className="border-b border-slate-200">
              <th className="whitespace-nowrap px-5 py-3 text-left text-sm text-gray-500">학번</th>
              <th className="whitespace-nowrap px-5 py-3 text-left text-sm text-gray-500">이름</th>
              <th className="whitespace-nowrap px-5 py-3 text-left text-sm text-gray-500">
                출석 정보
              </th>
              <th className="whitespace-nowrap px-5 py-3 text-left text-sm text-gray-500">
                총 공부 시간
              </th>
              <th className="whitespace-nowrap px-5 py-3 text-left text-sm text-gray-500">
                출석률
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {list.map((student) => {
              return (
                <tr key={student.student_id} onClick={() => setSelectedStudent(student)}>
                  <th className="whitespace-nowrap px-5 py-3 text-left text-sm">
                    {student.student_id}
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-left text-sm">{student.name}</th>
                  <th className="whitespace-nowrap px-5 py-3 text-left text-sm">{student.info}</th>
                  <th className="whitespace-nowrap px-5 py-3 text-left text-sm">{student.hour}</th>
                  <th className="whitespace-nowrap px-5 py-3 text-left text-sm">{student.rate}</th>
                </tr>
              );
            })}
          </tbody>
        </table>
      </LayoutContainer>
    </>
  );
}
export default AnalyticsMainContents;
