"""掃描專案內的 HTML/CSS/JS/MD，找出「簡體專用」的字。

用法：python3 tools/check_trad.py
有命中時 exit code 為 1，可直接接在 git hook 或檢查流程後面。
"""
import pathlib
import sys

# 只收「簡體專用、繁體文本不該出現」的字
# （刻意排除 名/件/文/息/信/理/架/案 等繁簡共用字，避免誤報）
SIMP = set(
    "这说时间门问题学习应该设计课电脑软网络数据训练视频关键线标记检术"
    "语对话务选择额缴费报单价钱师资经验获奖荣誉业专营销广势优级组织维"
    "护艺产范范围构试验证处论档图实现发会议讨坛阅读写么与为个众联"
    "备体变边让认识请谢吗"
)

root = pathlib.Path(__file__).resolve().parents[1]
total = 0
for p in sorted(root.rglob("*")):
    if p.suffix not in {".html", ".css", ".js", ".md"} or ".venv" in p.parts:
        continue
    text = p.read_text(encoding="utf-8")
    hits = {}
    for ch in text:
        if ch in SIMP:
            hits[ch] = hits.get(ch, 0) + 1
    total += sum(hits.values())
    print(f"{p.relative_to(root)}: {hits if hits else 'OK'}")

print("simplified-only char total:", total)
sys.exit(1 if total else 0)
