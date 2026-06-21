import json
path = "/Users/shrigo/.gemini/antigravity-ide/brain/3704f44b-4071-447e-a4ce-0b0f223d73a9/.system_generated/logs/transcript.jsonl"
with open(path) as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    data = json.loads(line)
    if "tool_calls" in data:
        for tc in data["tool_calls"]:
            if tc["name"] == "view_file":
                args = tc.get("args", {})
                if "MythosPromo.tsx" in str(args):
                    print(f"view_file at step {i}, time: {data.get('created_at')}, args: {args}")
