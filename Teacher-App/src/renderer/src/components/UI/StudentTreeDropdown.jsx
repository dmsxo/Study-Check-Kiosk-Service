import { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronRight, ChevronDown, Minus, Users } from 'lucide-react';

// 학번 파싱 함수 (GCCNN 형식)
function parseStudentId(id) {
  const idStr = String(id);
  const grade = parseInt(idStr[0]);
  const classNum = parseInt(idStr.substring(1, 3));
  const number = parseInt(idStr.substring(3, 5));
  return { grade, classNum, number };
}

// 체크박스 아이콘 컴포넌트
function CheckboxIcon({ checked, indeterminate }) {
  if (indeterminate) {
    return (
      <div className="w-4 h-4 border-2 border-blue-500 bg-blue-500 rounded flex items-center justify-center">
        <Minus size={12} className="text-white" />
      </div>
    );
  }
  return (
    <div
      className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
        checked ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
      }`}
    >
      {checked && (
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  );
}

// 메인 드롭다운 컴포넌트
function StudentTreeDropdown({ students, selected, onSelectedChange }) {
  const [expanded, setExpanded] = useState(new Set());
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState(new Set(selected));
  const dropdownRef = useRef(null);

  // 학생 데이터를 트리 구조로 변환
  const treeData = useMemo(() => {
    const tree = {};

    students.forEach((student) => {
      const { grade, classNum } = parseStudentId(student.studentId);

      if (!tree[grade]) {
        tree[grade] = {};
      }
      if (!tree[grade][classNum]) {
        tree[grade][classNum] = [];
      }
      tree[grade][classNum].push(student);
    });

    return tree;
  }, [students]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isOpen) {
          setIsOpen(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tempSelected, onSelectedChange]);

  useEffect(() => {
    onSelectedChange(tempSelected);
  }, [isOpen]);

  // 드롭다운 열릴 때 임시 선택 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setTempSelected(new Set(selected));
    }
  }, [isOpen, selected]);

  const toggleExpand = (key) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const getStudentsInGrade = (grade) => {
    const studentList = [];
    Object.values(treeData[grade] || {}).forEach((classList) => {
      studentList.push(...classList);
    });
    return studentList;
  };

  const getStudentsInClass = (grade, classNum) => {
    return treeData[grade]?.[classNum] || [];
  };

  const isAllSelected = (studentIds) => {
    return studentIds.length > 0 && studentIds.every((id) => tempSelected.has(id));
  };

  const isSomeSelected = (studentIds) => {
    return studentIds.some((id) => tempSelected.has(id)) && !isAllSelected(studentIds);
  };

  const toggleSelection = (studentIds) => {
    setTempSelected((prev) => {
      const next = new Set(prev);
      const allSelected = studentIds.every((id) => prev.has(id));

      studentIds.forEach((id) => {
        if (allSelected) {
          next.delete(id);
        } else {
          next.add(id);
        }
      });

      return next;
    });
  };

  const toggleStudent = (studentId) => {
    setTempSelected((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) {
        next.delete(studentId);
      } else {
        next.add(studentId);
      }
      return next;
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 드롭다운 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-300 rounded-xl hover:border-gray-400 transition-colors bg-white"
      >
        <div className="flex items-center gap-3">
          <Users size={18} className="text-gray-600" />
          <span className="font-medium text-gray-700">
            {selected.size > 0 ? `${selected.size}명 선택됨` : '학생 선택'}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-150 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {/* 플로팅 드롭다운 콘텐츠 */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl">
          <div className="p-4 max-h-96 overflow-y-auto">
            <div className="space-y-1">
              {students.length <= 0 && (
                <div className="bg-gray-100 rounded-xl w-full p-4 text-gray-700 whitespace-nowrap truncate">
                  참여 인원이 없습니다.
                </div>
              )}
              {Object.keys(treeData)
                .sort()
                .map((grade) => {
                  const gradeKey = `grade-${grade}`;
                  const isExpanded = expanded.has(gradeKey);
                  const gradeStudents = getStudentsInGrade(grade);
                  const gradeStudentIds = gradeStudents.map((s) => s.studentId);
                  const allGradeSelected = isAllSelected(gradeStudentIds);
                  const someGradeSelected = isSomeSelected(gradeStudentIds);

                  return (
                    <div key={gradeKey}>
                      {/* 학년 레벨 */}
                      <div className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-md">
                        <button
                          onClick={() => toggleExpand(gradeKey)}
                          className="p-0.5 hover:bg-gray-200 rounded"
                        >
                          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                        <button
                          onClick={() => toggleSelection(gradeStudentIds)}
                          className="flex items-center gap-2 flex-1"
                        >
                          <CheckboxIcon
                            checked={allGradeSelected}
                            indeterminate={someGradeSelected}
                          />
                          <span className="font-semibold text-gray-700">{grade}학년</span>
                          <span className="text-sm text-gray-500">({gradeStudents.length}명)</span>
                        </button>
                      </div>

                      {/* 반 레벨 */}
                      {isExpanded && (
                        <div className="ml-6 space-y-1">
                          {Object.keys(treeData[grade])
                            .sort((a, b) => parseInt(a) - parseInt(b))
                            .map((classNum) => {
                              const classKey = `class-${grade}-${classNum}`;
                              const isClassExpanded = expanded.has(classKey);
                              const classStudents = getStudentsInClass(grade, classNum);
                              const classStudentIds = classStudents.map((s) => s.studentId);
                              const allClassSelected = isAllSelected(classStudentIds);
                              const someClassSelected = isSomeSelected(classStudentIds);

                              return (
                                <div key={classKey}>
                                  {/* 반 헤더 */}
                                  <div className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-md">
                                    <button
                                      onClick={() => toggleExpand(classKey)}
                                      className="p-0.5 hover:bg-gray-200 rounded"
                                    >
                                      {isClassExpanded ? (
                                        <ChevronDown size={18} />
                                      ) : (
                                        <ChevronRight size={18} />
                                      )}
                                    </button>
                                    <button
                                      onClick={() => toggleSelection(classStudentIds)}
                                      className="flex items-center gap-2 flex-1"
                                    >
                                      <CheckboxIcon
                                        checked={allClassSelected}
                                        indeterminate={someClassSelected}
                                      />
                                      <span className="font-medium text-gray-700">
                                        {classNum}반
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        ({classStudents.length}명)
                                      </span>
                                    </button>
                                  </div>

                                  {/* 학생 리스트 */}
                                  {isClassExpanded && (
                                    <div className="ml-6 space-y-1">
                                      {classStudents
                                        .sort((a, b) => {
                                          const aNum = parseStudentId(a.studentId).number;
                                          const bNum = parseStudentId(b.studentId).number;
                                          return aNum - bNum;
                                        })
                                        .map((student) => {
                                          const { number } = parseStudentId(student.studentId);
                                          const isSelected = tempSelected.has(student.studentId);

                                          return (
                                            <button
                                              key={student.studentId}
                                              onClick={() => toggleStudent(student.studentId)}
                                              className="flex items-center gap-2 py-1.5 px-3 hover:bg-gray-50 rounded-md w-full"
                                            >
                                              <CheckboxIcon checked={isSelected} />
                                              <span className="text-gray-700">{number}번</span>
                                              <span className="text-gray-700">{student.name}</span>
                                            </button>
                                          );
                                        })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentTreeDropdown;
