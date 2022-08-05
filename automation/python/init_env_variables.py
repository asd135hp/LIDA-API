import subprocess
from io import TextIOWrapper
import os
import json
import re

dir_path = os.path.dirname(os.path.realpath(__file__)).replace("\\automation\\python", "")

def wrap_multiline_string(string: str):
  if len(re.findall(r"\r\n|\n", string)) > 0:
    return "'\"{0}\"'".format(re.sub(r"\r\n|\n", "\\\\n", string))
  return string

def add_env_var_local(key: str, value: str, dotenv_fp: TextIOWrapper):
  dotenv_fp.write(f"{key}={wrap_multiline_string(value)}\n")


def extract_env_vars(current_dict: dict, var_prefix: str = "", dotenv_fp: TextIOWrapper = None, env_vars: list = []):
  if dotenv_fp is None: raise Exception("Local environment variable file must be openable")

  for var_name in current_dict.keys():
    written_var_name = var_name if len(var_prefix) == 0 else f"{var_prefix}_{var_name}"
    written_var_name = written_var_name.upper()

    if type(current_dict[var_name]) == dict or isinstance(current_dict[var_name], dict):
      extract_env_vars(current_dict[var_name], written_var_name, dotenv_fp, env_vars)
    else:
      add_env_var_local(written_var_name, current_dict[var_name], dotenv_fp)
      env_vars.append(f"{written_var_name}={current_dict[var_name]}")

if __name__ == '__main__':
  dotenv_fp = open(f"{dir_path}\\.env", "w+")
  dotenv_fp.reconfigure(write_through=True)

  # must have env vars
  add_env_var_local("NODE_ENV", "production", dotenv_fp)
  
  vars = []
  for file_name in os.listdir(f"{dir_path}\\protected"):
    if file_name.endswith(".json"):
      with open(f"{dir_path}\\protected\\{file_name}", 'r') as f:
        secret_dict: dict = json.load(f)
        extract_env_vars(secret_dict, file_name.split('.')[0], dotenv_fp, vars)

  # must be careful if user hasn't logged into heroku yet!
  try:
    subprocess.check_output(["heroku", "config:set", *vars], shell=True)
  except subprocess.CalledProcessError as e:
    print(e)