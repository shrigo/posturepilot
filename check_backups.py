import os
import subprocess
import shutil

history_dir = "/tmp/mythos_history"
dest_file = "src/components/MythosPromo.tsx"

# List steps in reverse order
steps = sorted([f for f in os.listdir(history_dir) if f.startswith("step_") and f.endswith(".tsx")], key=lambda x: int(x.split("_")[1].split(".")[0]), reverse=True)

print(f"Checking {len(steps)} backups...")

for step in steps:
    step_path = os.path.join(history_dir, step)
    print(f"Testing {step}...")
    shutil.copy(step_path, dest_file)
    
    # Run next build to see if it compiles
    res = subprocess.run(["npm", "run", "build"], capture_output=True, text=True)
    if res.returncode == 0:
        print(f"SUCCESS: {step} builds cleanly!")
        break
    else:
        print(f"FAILED: {step} had compilation errors.")
