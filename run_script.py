import argparse
import subprocess
import os

def get_file_dir(*folder:str, file_name:str):
  return "{0}/{1}/{2}".format(os.path.dirname(os.path.realpath(__file__)), "/".join(folder), file_name)

def install_and_run_yarn():
  print("Checking and rebuilding dependencies with yarn...")
  command = ["yarn", "install", "--network-timeout %d" % 100_000]
  try:
    subprocess.run(command, shell=True)
  except:
    # retry command but enable yarn first
    buf = subprocess.run(['node', '--version'], stdout=subprocess.PIPE).stdout
    ver = [int(x) for x in buf.decode("ASCII").strip()[1:].split('.')]
    major, minor, _ = ver
    node_ver_command = [
      "corepack", "enable"
    ] if major >= 16 and minor >= 10 else [
      "npm", "i", "-g", "corepack"
    ]

    # could be packed into 1 subprocess
    subprocess.run(node_ver_command, shell=True)
    subprocess.run(command, shell=True)
  finally:
    print("Finished checking and rebuilding dependencies with yarn")

if __name__ == "__main__":
  parser = argparse.ArgumentParser(prog="MAIN_PROGRAM", formatter_class=argparse.MetavarTypeHelpFormatter)
  parser.add_argument('-e', '--set_env_variables', help="Set environment variables both locally and on production from protected values in the protected folder (Recommended to do this on the first time)", action="store_true")
  parser.add_argument('-g', '--generate_test_case', help="Generate new test case for testing", action="store_true")

  local_group = parser.add_argument_group("Local deployment")
  local_group.add_argument('-la', '--run_all_local', '--all_local', help="Run everything from start to finish locally", action="store_true")
  local_group.add_argument('-lc', '--compile_local', help="Only compile code locally", action="store_true")
  local_group.add_argument('-lg', '--generate_routes_local', help="Only generate routes with tsoa locally", action="store_true")
  local_group.add_argument('-lt', '--run_test_local', '--test_local', help="Only run tests locally", action="store_true")
  local_group.add_argument('-ls', '--run_server_local', '--server_local', help="Only run server locally", action="store_true")

  prod_group = parser.add_argument_group("Main deployment")
  prod_group.add_argument('-pa', '--run_all_prod', '--all_prod', help="Run everything from start to finish on production", action="store_true")
  prod_group.add_argument('-pc', '--compile_prod', help="Only compile code on production", action="store_true")
  prod_group.add_argument('-pg', '--generate_routes_prod', help="Only generate routes with tsoa on production", action="store_true")
  prod_group.add_argument('-pt', '--run_test_prod', '--test_prod', help="Only run tests on production", action="store_true")
  prod_group.add_argument('-ps', '--run_server_prod', '--server_prod', help="Only run server on production", action="store_true")

  args = parser.parse_args()
  script_folder, generator_folder = "automation", "generator"

  install_and_run_yarn()

  # Generate new test cases with python script
  if args.generate_test_case:
    print("Generating new test cases for testing...")
    subprocess.run(["python", get_file_dir("automation", "generator", file_name = "generateTestCases.py")])
    print("Finished generating new test cases")

  # Setting up environment variables
  if args.set_env_variables:
    print("Setting environment variables...")
    subprocess.run(["python", get_file_dir("automation", "python", file_name = "init_env_variables.py")])
    print("Finished setting environment variables")

  # segregate local to prod pushes
  if args.run_all_local or args.compile_local or args.generate_routes_local or args.run_test_local or args.run_server_local:
    flags = [
      "-a" if args.run_all_local else "",
      "-c" if args.compile_local else "",
      "-g" if args.generate_routes_local else "",
      "-t" if args.run_test_local else "",
      "-s" if args.run_server_local else ""
    ]

    # remove empty strings
    try:
      while True:
        flags.remove("")
    except:
      pass

    subprocess.run(["python", get_file_dir("automation", "python", file_name = "local_script.py"), *flags])
    pass

  # prod
  if args.run_all_prod or args.compile_prod or args.generate_routes_prod or args.run_test_prod or args.run_server_prod:
    flags = [
      "-a" if args.run_all_prod else "",
      "-c" if args.compile_prod else "",
      "-g" if args.generate_routes_prod else "",
      "-t" if args.run_test_prod else "",
      "-s" if args.run_server_prod else ""
    ]

    # remove empty strings
    try:
      while True:
        flags.remove("")
    except:
      pass

    subprocess.run(["python", get_file_dir("automation", "python", file_name = "prod_script.py"), *flags])
    pass