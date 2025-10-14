import json
import random
from datetime import datetime, timedelta, time

# 1️⃣ 랜덤 날짜 생성 (중복 제거 + 주말 제외 + 주 3회 이상)
def generate_unique_dates(start, end, min_per_week=3):
    all_dates = []
    current = start
    week_dates = []

    while current <= end:
        if current.weekday() < 5:  # 월~금
            week_dates.append(current)
        # 주말이 끝났거나 마지막 날짜일 때
        if current.weekday() == 4 or current == end:
            # 주별 min_per_week개 이상 랜덤 선택
            if len(week_dates) <= min_per_week:
                selected = week_dates
            else:
                selected = random.sample(week_dates, min_per_week)
            all_dates.extend(selected)
            week_dates = []
        current += timedelta(days=1)
    return all_dates

# 2️⃣ 랜덤 시간 생성
def random_time(start_hour, start_minute, end_hour, end_minute):
    start_minutes = start_hour * 60 + start_minute
    end_minutes = end_hour * 60 + end_minute
    if start_minutes > end_minutes:
        start_minutes = end_minutes  # 안전하게 처리
    rand_minute = random.randint(start_minutes, end_minutes)
    h = rand_minute // 60
    m = rand_minute % 60
    return time(h, m)

# 3️⃣ 출석 레코드 생성
def generate_attendance_record(date):
    type_ = random.choice(['morning', 'night'])

    if type_ == 'morning':
        check_in = random_time(7, 0, 8, 20)
        start_hour = check_in.hour
        start_minute = check_in.minute + 1
        check_out = random_time(start_hour, start_minute, 8, 20)
    else:
        check_in = random_time(18, 0, 21, 40)
        start_hour = check_in.hour
        start_minute = check_in.minute + 1
        check_out = random_time(start_hour, start_minute, 22, 0)

    description = f"{date.month}월, {date.day}일도 알찼다"

    return {
        "type": type_,
        "date": date.isoformat(),
        "check_in_time": check_in.strftime("%H:%M:%S"),
        "check_out_time": check_out.strftime("%H:%M:%S"),
        "description": description
    }

# 4️⃣ 실행
start_date = datetime(2025, 3, 4)
end_date = datetime(2025, 10, 9)

unique_dates = generate_unique_dates(start_date, end_date, min_per_week=3)
attendance_list = [generate_attendance_record(d) for d in unique_dates]

# 5️⃣ JSON 파일로 저장
with open('attendance.json', 'w', encoding='utf-8') as f:
    json.dump(attendance_list, f, ensure_ascii=False, indent=2)

print(f"attendance.json 생성 완료! 총 {len(attendance_list)}개 레코드")
