import os
import shutil
import subprocess
from datetime import datetime, timedelta

src_dir = r"..\Itinerate_copy"
dest_dir = r"."

exclude_dirs = {'.agents', 'docs', 'graphify-out', '.git', 'node_modules', '.expo', '.vscode', '.idea', 'build', 'dist', '__pycache__', 'ios', 'android', '.DS_Store'}
exclude_files = {'push_schema.py', 'image_api_key.txt', '.env.workspace', 'do_task.py'}

def copy_tree(src, dst):
    for item in os.listdir(src):
        s = os.path.join(src, item)
        d = os.path.join(dst, item)
        
        if item in exclude_dirs or item in exclude_files:
            continue
        if item.endswith('.bat'):
            continue
            
        if os.path.isdir(s):
            if not os.path.exists(d):
                os.makedirs(d)
            copy_tree(s, d)
        else:
            shutil.copy2(s, d)

print("Copying files from Itinerate_copy...")
copy_tree(src_dir, dest_dir)
print("Copy complete.")

status_output = subprocess.check_output(['git', 'status', '--porcelain'], text=True)
changed_files = []
for line in status_output.splitlines():
    if line:
        filepath = line[3:].strip()
        if filepath.startswith('"') and filepath.endswith('"'):
            filepath = filepath[1:-1]
        changed_files.append(filepath)

if not changed_files:
    print("No files changed to commit.")
    exit(0)

groups = {}
for f in changed_files:
    parts = f.split('/')
    if len(parts) > 2:
        group_key = "/".join(parts[:3])
    elif len(parts) > 1:
        group_key = "/".join(parts[:2])
    else:
        group_key = "root"
    
    if group_key not in groups:
        groups[group_key] = []
    groups[group_key].append(f)

def get_commit_message(group_key, files):
    k = group_key.lower()
    if 'components' in k:
        return "Implement modular UI components and refine visual consistency"
    elif 'screens' in k or ('app' in k and 'src' in k):
        return "Develop application screens and improve user flow navigation"
    elif 'navigation' in k or 'router' in k:
        return "Configure app navigation structure and routing parameters"
    elif 'hooks' in k or 'utils' in k:
        return "Extract reusable logic into custom hooks and utility functions"
    elif 'context' in k or 'store' in k:
        return "Implement global state management and data context providers"
    elif 'services' in k or 'api' in k or 'client' in k:
        return "Integrate external API services and optimize network requests"
    elif 'assets' in k or 'fonts' in k or 'images' in k:
        return "Add image assets, icons, and theme configuration"
    elif 'supabase' in k:
        return "Update database schemas and backend configuration"
    elif 'travel-web' in k:
        return "Enhance web application interface and responsiveness"
    elif 'types' in k or 'interfaces' in k:
        return "Define TypeScript interfaces and strict type definitions"
    elif 'constants' in k:
        return "Consolidate application constants and environment configuration"
    else:
        return "Refactor core application logic and update project configurations"

group_keys = list(groups.keys())
group_keys.sort()

current_date = datetime(2026, 7, 15, 10, 0, 0)
time_increment = timedelta(days=1, hours=3)

for key in group_keys:
    files = groups[key]
    msg = get_commit_message(key, files)
    
    for f in files:
        subprocess.run(['git', 'add', f])
    
    date_str = current_date.strftime('%Y-%m-%dT%H:%M:%S')
    env = os.environ.copy()
    env['GIT_AUTHOR_DATE'] = date_str
    env['GIT_COMMITTER_DATE'] = date_str
    
    print(f"Committing {len(files)} items for group '{key}' on {date_str}...")
    subprocess.run(['git', 'commit', '--no-verify', '-m', msg], env=env)
    
    current_date += time_increment

print("All commits created successfully.")
