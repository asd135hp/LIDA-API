from io import TextIOWrapper
import os
import json
import re

# Generate environment variables only, no porting them to remote server

raw_path = os.path.dirname(os.path.realpath(__file__))
dir_path = raw_path.replace("\\automation\\python", "")
const_env_vars = {
  "NODE_ENV": "testing"
}

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

  for var_name, current_dict_value in current_dict.items():
    written_var_name = var_name if len(var_prefix) == 0 else f"{var_prefix}_{var_name}"
    written_var_name = written_var_name.upper()

    if type(current_dict_value) == dict or isinstance(current_dict_value, dict):
      extract_env_vars(current_dict_value, written_var_name, dotenv_fp, env_vars)
    else:
      add_env_var_local(written_var_name, current_dict_value, dotenv_fp)
      env_vars[written_var_name] = current_dict_value

if __name__ == '__main__':
  dotenv_fp = open(f"{dir_path}\\.env", "w+")
  dotenv_fp.reconfigure(write_through=True)

  # protected configuration variables (firebase configs)
  for file_name in os.listdir(f"{dir_path}\\protected"):
    if file_name.endswith(".json"):
      with open(f"{dir_path}\\protected\\{file_name}", 'r') as f:
        secret_dict: dict = json.load(f)
        extract_env_vars(secret_dict, file_name.split('.')[0], dotenv_fp)

  # must have env vars
  for name, value in const_env_vars.items():
    add_env_var_local(name, value, dotenv_fp)