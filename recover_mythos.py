import json

path = "/Users/shrigo/.gemini/antigravity-ide/brain/3704f44b-4071-447e-a4ce-0b0f223d73a9/.system_generated/logs/transcript.jsonl"
with open(path) as f:
    lines = f.readlines()

subprocess = __import__("subprocess")
subprocess.run(["git", "checkout", "HEAD", "src/components/MythosPromo.tsx"])

with open("src/components/MythosPromo.tsx", "r") as f:
    content = f.read()

applied_count = 0
for line in lines:
    data = json.loads(line)
    if "tool_calls" in data:
        for tc in data["tool_calls"]:
            if tc["name"] in ("replace_file_content", "multi_replace_file_content"):
                args = tc.get("args", {})
                
                target_file_str = args.get("TargetFile", '""')
                try:
                    target_file = json.loads(target_file_str)
                except:
                    target_file = target_file_str
                    
                if "MythosPromo.tsx" in target_file:
                    if tc["name"] == "replace_file_content":
                        target_str = args.get("TargetContent", '""')
                        try:
                            target = json.loads(target_str)
                        except:
                            target = target_str
                        replacement_str = args.get("ReplacementContent", '""')
                        try:
                            replacement = json.loads(replacement_str)
                        except:
                            replacement = replacement_str
                            
                        if target and target in content:
                            content = content.replace(target, replacement, 1)
                            applied_count += 1
                            with open(f"/tmp/mythos_history/step_{applied_count}.tsx", "w") as f_out:
                                f_out.write(content)
                    elif tc["name"] == "multi_replace_file_content":
                        chunks_obj = args.get("ReplacementChunks", [])
                        if isinstance(chunks_obj, str):
                            try:
                                chunks = json.loads(chunks_obj)
                            except:
                                chunks = []
                        else:
                            chunks = chunks_obj
                        for chunk in chunks:
                            target_str = chunk.get("TargetContent", '""')
                            try:
                                target = json.loads(target_str)
                            except:
                                target = target_str
                            replacement_str = chunk.get("ReplacementContent", '""')
                            try:
                                replacement = json.loads(replacement_str)
                            except:
                                replacement = replacement_str
                                
                            if target and target in content:
                                content = content.replace(target, replacement, 1)
                                applied_count += 1
                                with open(f"/tmp/mythos_history/step_{applied_count}.tsx", "w") as f_out:
                                    f_out.write(content)

print(f"Total applied edits: {applied_count}")
