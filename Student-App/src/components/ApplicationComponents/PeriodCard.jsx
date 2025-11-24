import React from 'react';
import dayjs from 'dayjs';
import LayoutContainer from '../UIComponents/LayoutContainer';
import { applicationPeriod } from '../../api/applicationAPI';

const PeriodCard = ({ period }) => {
  console.log(period);
  const {
    id,
    termId,
    studyType,
    registration,
    operation,
    dailyOperation,
    isApplication,
  } = period;

  // 현재 상태 계산
  const today = dayjs();
  const regStart = dayjs(registration.start);
  const regEnd = dayjs(registration.end);

  const isRegistrationOpen =
    today.isAfter(regStart.subtract(1, 'day')) &&
    today.isBefore(regEnd.add(1, 'day'));

  // 제목 생성
  const studyTypeMap = {
    day: '아침 독서',
    night: '야간 자율 학습',
  };
  const title = `${termId}학기 ${studyTypeMap[studyType]}`;

  return (
    <LayoutContainer>
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div className="mb-4 space-y-2">
        <div>
          <span className="font-semibold">신청 기간: </span>
          {dayjs(registration.start).format('YYYY.MM.DD')} ~{' '}
          {dayjs(registration.end).format('YYYY.MM.DD')}
        </div>
        <div>
          <span className="font-semibold">운영 기간: </span>
          {dayjs(operation.start).format('YYYY.MM.DD')} ~{' '}
          {dayjs(operation.end).format('YYYY.MM.DD')}
        </div>
        <div>
          <span className="font-semibold">운영 시간: </span>
          {dailyOperation.start} ~ {dailyOperation.end}
        </div>
      </div>

      <div>
        {isApplication ? (
          <button className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg cursor-not-allowed">
            참여 중
          </button>
        ) : isRegistrationOpen ? (
          <button
            onClick={() => applicationPeriod(id)}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            신청하기
          </button>
        ) : (
          <button className="w-full bg-gray-200 text-gray-400 py-2 px-4 rounded-lg cursor-not-allowed">
            신청 불가
          </button>
        )}
      </div>
    </LayoutContainer>
  );
};

export default PeriodCard;
