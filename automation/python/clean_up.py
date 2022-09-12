from functools import reduce
import os

def exclude_pattern(path, *patterns):
  return reduce(lambda a, b: a + b, [int(p in path) for p in patterns]) != 0

path = os.path.dirname(os.path.realpath(__file__)).replace("\\automation\\python", "")
blacklist = ["node_modules", ".git", ".vercel", "config", "postman", "protected"]
f = []
for (dirpath, dirnames, filenames) in os.walk(path):
  if exclude_pattern(dirpath, *blacklist): continue
  f.extend([f"{dirpath}\{n}" if n.endswith(".js") or n.endswith(".js.map") else "" for n in filenames])

for name in f:
  if len(name) == 0 or name == '': continue
  os.remove(name)
  