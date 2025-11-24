import ScreenFrame from "./../../components/UIComponents/ScreenFrame";
import LayoutContainer from "./../../components/UIComponents/LayoutContainer";
import React, { useState } from "react";
import { Calendar, Clock, Users } from "lucide-react";
import { transformPeriods } from "../../helpers/application.helper";

// 학기 배지 컴포넌트
const SemesterBadge = ({ name }) => {
  // 학기 정보 추출 (예: "2024-1학기" -> "1학기", "겨울방학" -> "방학")
  const getSemesterInfo = (name) => {
    if (name.includes("학기")) {
      const match = name.match(/(\d{4})-?(\d)?학기/);
      if (match) return { year: match[1], semester: `${match[2]}학기` };
    }
    if (name.includes("방학")) {
      const season = name.match(/(겨울|여름|봄|가을)?방학/)?.[1] || "";
      return {
        year: name.match(/\d{4}/)?.[0] || "",
        semester: `${season}방학`,
      };
    }
    return null;
  };

  const info = getSemesterInfo(name);
  if (!info) return null;

  return (
    <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium border border-gray-200">
      <span className="font-semibold">{info.year}</span>
      <span className="text-gray-400">·</span>
      <span>{info.semester}</span>
    </div>
  );
};

// 인원 현황 슬라이더 컴포넌트
const CapacitySlider = ({ enrolled, capacity }) => {
  const percentage = (enrolled / capacity) * 100;
  const isFull = enrolled >= capacity;
  const isAlmostFull = percentage >= 90;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">신청 인원</span>
        <span
          className={`font-semibold ${
            isFull
              ? "text-red-600"
              : isAlmostFull
              ? "text-orange-600"
              : "text-gray-900"
          }`}
        >
          {enrolled} / {capacity}명
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isFull
              ? "bg-red-500"
              : isAlmostFull
              ? "bg-orange-500"
              : "bg-blue-500"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {isFull && (
        <p className="text-xs text-red-600 font-medium">
          정원이 마감되었습니다
        </p>
      )}
      {isAlmostFull && !isFull && (
        <p className="text-xs text-orange-600 font-medium">마감 임박</p>
      )}
    </div>
  );
};

function ApplicationView() {
  transformPeriods();
  const [studyPrograms] = useState([
    {
      id: 1,
      name: "2024-1학기 야간 자율학습",
      type: "야간 자율학습",
      applicationPeriod: { start: "2024.11.01", end: "2024.11.30" },
      operationPeriod: { start: "2024.12.01", end: "2025.02.28" },
      targetGrades: [1, 2, 3],
      currentGrade: 2,
      capacity: 100,
      enrolled: 85,
      status: "신청기간",
      myStatus: null,
    },
    {
      id: 2,
      name: "겨울방학 아침 독서",
      type: "아침 독서",
      applicationPeriod: { start: "2024.11.15", end: "2024.12.05" },
      operationPeriod: { start: "2024.12.23", end: "2025.02.10" },
      targetGrades: [1, 2, 3],
      currentGrade: 2,
      capacity: 50,
      enrolled: 49,
      status: "신청기간",
      myStatus: null,
    },
    {
      id: 3,
      name: "2024-2학기 야간 자율학습",
      type: "야간 자율학습",
      applicationPeriod: { start: "2024.08.01", end: "2024.08.31" },
      operationPeriod: { start: "2024.09.01", end: "2024.11.30" },
      targetGrades: [1, 2, 3],
      currentGrade: 2,
      capacity: 100,
      enrolled: 100,
      status: "운영중",
      myStatus: "참여",
    },
    {
      id: 4,
      name: "2024 여름방학 특별 자율학습",
      type: "야간 자율학습",
      applicationPeriod: { start: "2024.06.01", end: "2024.06.20" },
      operationPeriod: { start: "2024.07.01", end: "2024.08.20" },
      targetGrades: [2, 3],
      currentGrade: 2,
      capacity: 60,
      enrolled: 58,
      status: "운영 종료",
      myStatus: "추방",
    },
  ]);

  const getStatusColor = (status) => {
    const colors = {
      신청기간: "bg-blue-50 text-blue-700 border-blue-200",
      "추가 신청기간": "bg-purple-50 text-purple-700 border-purple-200",
      운영전: "bg-gray-50 text-gray-600 border-gray-200",
      운영중: "bg-green-50 text-green-700 border-green-200",
      "운영 종료": "bg-gray-50 text-gray-500 border-gray-300",
    };
    return colors[status] || "bg-gray-50 text-gray-600 border-gray-200";
  };

  const getTypeColor = (type) => {
    const colors = {
      "야간 자율학습": "bg-indigo-50 text-indigo-700 border-indigo-200",
      "아침 독서": "bg-orange-50 text-orange-700 border-orange-200",
    };
    return colors[type] || "bg-gray-50 text-gray-600 border-gray-200";
  };

  const getMyStatusColor = (status) => {
    const colors = {
      참여: "bg-emerald-50 text-emerald-700 border-emerald-200",
      추방: "bg-red-50 text-red-700 border-red-200",
    };
    return colors[status] || "";
  };

  const handleApply = (programId) => {
    alert(`자율학습 ID ${programId}에 신청하였습니다.`);
  };

  const canApply = (program) => {
    return (
      (program.status === "신청기간" || program.status === "추가 신청기간") &&
      program.targetGrades.includes(program.currentGrade) &&
      !program.myStatus &&
      program.enrolled < program.capacity
    );
  };

  const participating = studyPrograms.filter((p) => p.myStatus === "참여");
  const available = studyPrograms.filter(
    (p) => canApply(p) || (p.status !== "운영 종료" && p.myStatus)
  );

  return (
    <ScreenFrame>
      <h1 className="font-semibold text-gray-900 text-xl mb-4">나의 신청</h1>
      <LayoutContainer>
        <h3 className="font-semibold text-gray-900 mb-2">운영 리스트</h3>
        {/* 참여 중인 자율학습 */}
        {participating.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              참여 중인 자율학습
            </h2>
            <div className="space-y-4">
              {participating.map((program) => (
                <div
                  key={program.id}
                  className="border-2 border-emerald-300 rounded-xl p-6 bg-emerald-50/30"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <SemesterBadge name={program.name} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {program.name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                            program.type
                          )}`}
                        >
                          {program.type}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            program.status
                          )}`}
                        >
                          {program.status}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getMyStatusColor(
                            program.myStatus
                          )}`}
                        >
                          {program.myStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-700">
                            신청 기간
                          </div>
                          <div>
                            {program.applicationPeriod.start} ~{" "}
                            {program.applicationPeriod.end}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-gray-600">
                        <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-700">
                            운영 기간
                          </div>
                          <div>
                            {program.operationPeriod.start} ~{" "}
                            {program.operationPeriod.end}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <CapacitySlider
                        enrolled={program.enrolled}
                        capacity={program.capacity}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 신청 가능한 자율학습 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            신청 가능한 자율학습
          </h2>
          <div className="space-y-4">
            {available.map((program) => (
              <div
                key={program.id}
                className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <SemesterBadge name={program.name} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {program.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                          program.type
                        )}`}
                      >
                        {program.type}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          program.status
                        )}`}
                      >
                        {program.status}
                      </span>
                      {program.myStatus && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getMyStatusColor(
                            program.myStatus
                          )}`}
                        >
                          {program.myStatus}
                        </span>
                      )}
                    </div>
                  </div>

                  {canApply(program) && (
                    <button
                      onClick={() => handleApply(program.id)}
                      className="ml-4 px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
                    >
                      신청하기
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-700">
                          신청 기간
                        </div>
                        <div>
                          {program.applicationPeriod.start} ~{" "}
                          {program.applicationPeriod.end}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-gray-600">
                      <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-700">
                          운영 기간
                        </div>
                        <div>
                          {program.operationPeriod.start} ~{" "}
                          {program.operationPeriod.end}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <CapacitySlider
                      enrolled={program.enrolled}
                      capacity={program.capacity}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </LayoutContainer>
    </ScreenFrame>
  );
}

export default ApplicationView;
