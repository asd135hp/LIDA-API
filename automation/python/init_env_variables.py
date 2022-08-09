import subprocess
from io import TextIOWrapper
import os
import json
import re
from constants import app_name

raw_path = os.path.dirname(os.path.realpath(__file__))
dir_path = raw_path.replace("\\automation\\python", "")

def wrap_multiline_string(string: str):
  if len(re.findall(r"\r\n|\n", string)) > 0:
    return "'\"{0}\"'".format(re.sub(r"\r\n|\n", "\\\\n", string))
  return string

def add_env_var_local(key: str, value: str, dotenv_fp: TextIOWrapper):
  dotenv_fp.write(f"{key}={wrap_multiline_string(value)}\n")


def extract_env_vars(
  current_dict: dict,
  var_prefix: str = "",
  dotenv_fp: TextIOWrapper = None,
  env_vars: dict = {}
):
  if dotenv_fp is None: raise Exception("Local environment variable file must be openable")

  for var_name in current_dict.keys():
    written_var_name = var_name if len(var_prefix) == 0 else f"{var_prefix}_{var_name}"
    written_var_name = written_var_name.upper()

    if type(current_dict[var_name]) == dict or isinstance(current_dict[var_name], dict):
      extract_env_vars(current_dict[var_name], written_var_name, dotenv_fp, env_vars)
    else:
      add_env_var_local(written_var_name, current_dict[var_name], dotenv_fp)
      env_vars[written_var_name] = current_dict[var_name]

if __name__ == '__main__':
  dotenv_fp = open(f"{dir_path}\\.env", "w+")
  dotenv_fp.reconfigure(write_through=True)

  # must have env vars
  add_env_var_local("NODE_ENV", "testing", dotenv_fp)
  
  vars = {}
  for file_name in os.listdir(f"{dir_path}\\protected"):
    if file_name.endswith(".json"):
      with open(f"{dir_path}\\protected\\{file_name}", 'r') as f:
        secret_dict: dict = json.load(f)
        extract_env_vars(secret_dict, file_name.split('.')[0], dotenv_fp, vars)

  oauth_id = ""
  try:
    with open(f"{raw_path}\\auth_id.txt", "r") as f:
      oauth_id = f.readline().strip()
  except:
    pass

  # must be careful if user hasn't logged into heroku yet!
  try:
    param1 = ["authorizations:create"] if len(oauth_id) == 0 else ["authorizations:info", oauth_id]
    info = subprocess.check_output(["heroku", *param1], shell=True)
    auth_token = ""

    # iterate through the result
    for arr in [x.split(':') for x in str(info, encoding="utf-8").split("\n")]:
      if len(arr) != 2: continue

      key, value = arr[0].strip(), arr[1].strip()
      if key == 'ID':
        with open(f"{raw_path}\\auth_id.txt", "w+") as f:
          f.reconfigure(write_through=True)
          f.write(value)
      if key == 'Token':
        auth_token = value

    # make API request to fix application config vars
    proc = subprocess.check_output([
      "curl", "-n", "-X", "PATCH", f"https://api.heroku.com/apps/{app_name}/config-vars",
      "-d", json.dumps(vars, skipkeys=True),
      "-H", "Content-Type: application/json",
      "-H", "Accept: application/vnd.heroku+json; version=3",
      "-H", f"Authorization: Bearer {auth_token}"])
    print(json.loads(proc))
  except subprocess.CalledProcessError as e:
    print(e)