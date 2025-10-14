# 파일명: generate_school_days.py
"""
2025년 3월 4일부터 12월 31일까지,
주말(토,일)과 법정 공휴일을 제외한
학교 출석 가능 일자를 JSON 배열로 저장합니다.

출력 구조:
[
  { "date": "YYYY-MM-DD", "grade1": true, "grade2": true, "grade3": true },
  ...
]
"""

import datetime
import json

def daterange(start, end):
    """start~end까지의 날짜를 반환"""
    for n in range((end - start).days + 1):
        yield start + datetime.timedelta(days=n)

def get_public_holidays(year: int) -> set:
    """
    2025년 대한민국 법정 공휴일 (대체공휴일 포함)
    """
    holidays = {
        f"{year}-03-01",  # 삼일절
        f"{year}-05-05",  # 어린이날
        f"{year}-05-06",  # 어린이날 대체공휴일
        f"{year}-06-06",  # 현충일
        f"{year}-08-15",  # 광복절
        f"{year}-10-03",  # 개천절
        f"{year}-10-06",  # 추석 연휴 (2025)
        f"{year}-10-07",  # 추석 연휴
        f"{year}-10-08",  # 추석 연휴
        f"{year}-10-09",  # 한글날
        f"{year}-12-25",  # 성탄절
    }
    return holidays

def is_weekend(date: datetime.date) -> bool:
    return date.weekday() >= 5  # 5=토, 6=일

def generate_school_days(year=2025):
    start = datetime.date(year, 3, 4)
    end = datetime.date(year, 12, 31)
    holidays = get_public_holidays(year)
    result = []

    for day in daterange(start, end):
        if is_weekend(day):
            continue
        if day.isoformat() in holidays:
            continue
        result.append({
            "date": day.isoformat(),
            "grade1": True,
            "grade2": True,
            "grade3": True
        })
    return result

def save_json(data, filename="school_days_dummy.json"):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"{filename} 파일이 생성되었습니다. ({len(data)}개의 출석일)")

if __name__ == "__main__":
    days = generate_school_days(2025)
    save_json(days)
