import json
path = "/Users/shrigo/.gemini/antigravity-ide/brain/3704f44b-4071-447e-a4ce-0b0f223d73a9/.system_generated/logs/transcript.jsonl"
with open(path) as f:
    lines = f.readlines()
for line in lines:
    data = json.loads(line)
    time = data.get('created_at', '')
    if time > "2026-06-19T20:30:00Z":
        if "tool_calls" in data:
            for tc in data["tool_calls"]:
                if tc["name"] in ("replace_file_content", "multi_replace_file_content"):
                    args = tc.get("args", {})
                    target_file_str = args.get("TargetFile", '""')
                    try:
                        target_file = json.loads(target_file_str)
                    except:
                        target_file = target_file_str
                    if "MythosPromo.tsx" not in target_file:
                        print(time, tc["name"], target_file)
