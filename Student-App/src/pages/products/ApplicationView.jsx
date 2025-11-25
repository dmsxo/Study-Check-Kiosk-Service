import ScreenFrame from "./../../components/UIComponents/ScreenFrame";
import LayoutContainer from "./../../components/UIComponents/LayoutContainer";
import React, { useEffect, useState } from "react";
import { Calendar, Clock, Users } from "lucide-react";
import { transformPeriods } from "../../helpers/application.helper";
import PeriodCard from "../../components/ApplicationComponents/PeriodCard";

function ApplicationView() {
  const [studyPrograms, setStudyPrograms] = useState([]);

  useEffect(() => {
    async function loadPeriods() {
      const res = await transformPeriods();
      console.log(res);
      setStudyPrograms(res);
    }
    loadPeriods();
  }, []);

  return (
    <ScreenFrame>
      <h1 className="font-semibold text-gray-900 text-xl mb-4">나의 신청</h1>
      <LayoutContainer>
        <h3 className="font-semibold text-gray-900 mb-2">프로그램 리스트</h3>
        {studyPrograms.length > 0 &&
          studyPrograms?.map((program) => {
            return (
              <PeriodCard
                period={program}
                key={program.id}
                onChange={(e) =>
                  setStudyPrograms([
                    ...studyPrograms.filter((p) => p.id !== program.id),
                    {
                      ...program,
                      isApplication: e,
                    },
                  ])
                }
              />
            );
          })}
      </LayoutContainer>
    </ScreenFrame>
  );
}

export default ApplicationView;
