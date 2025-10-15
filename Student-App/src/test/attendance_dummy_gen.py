import json
import random
from datetime import datetime, timedelta

start_date = datetime(2025, 3, 4)
end_date = datetime(2025, 12, 31)

delta = end_date - start_date
all_dates = [start_date + timedelta(days=i) for i in range(delta.days + 1)]

attendance_data = []

for date in all_dates:
    for t_type in ["morning", "night"]:
        # 출석 여부 결정
        attend_prob = 0.9 if t_type == "morning" else 0.8
        if random.random() > attend_prob:
            continue

        # 시간 생성
        if t_type == "morning":
            check_in_time = "07:30:00"
            check_out_time = "08:30:00"
        else:
            # night 체크인 18~22시, 체크아웃은 체크인 이후 ~ 22시
            check_in_hour = random.randint(18, 21)  # 21시까지 체크인 가능
            check_in_minute = random.randint(0, 59)
            check_in_dt = datetime(date.year, date.month, date.day, check_in_hour, check_in_minute)

            # 최소 1분 이상, 최대 22:00 이전 체크아웃
            max_checkout_dt = datetime(date.year, date.month, date.day, 22, 0)
            # 최소 체크아웃: 체크인 + 1분
            min_checkout_dt = check_in_dt + timedelta(minutes=1)

            # 체크아웃 랜덤
            if min_checkout_dt >= max_checkout_dt:
                check_out_dt = max_checkout_dt
            else:
                delta_seconds = int((max_checkout_dt - min_checkout_dt).total_seconds())
                random_seconds = random.randint(0, delta_seconds)
                check_out_dt = min_checkout_dt + timedelta(seconds=random_seconds)

            check_in_time = check_in_dt.strftime("%H:%M:%S")
            check_out_time = check_out_dt.strftime("%H:%M:%S")

        description = f"{date.month}월 {date.day}일도 알찼다"

        attendance_data.append({
            "type": t_type,
            "date": date.strftime("%Y-%m-%d"),
            "check_in_time": check_in_time,
            "check_out_time": check_out_time,
            "description": description
        })

# JSON으로 저장
json_data = json.dumps(attendance_data, ensure_ascii=False, indent=2)
with open("attendance_dummy.json", "w", encoding="utf-8") as f:
    f.write(json_data)

print("출석 데이터 생성 완료! 총", len(attendance_data), "개 기록")
