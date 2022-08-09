# Description:
# Since heroku container is limited,
# this script replaces the work must be done by the container on
# development environment instead (local powershell terminal)
#
# Justification:
# Heroku container on free tier is 512MB (realistically lower) in RAM.
# How can it run all of these commands without running out of memory?
#
# Note:
# Do not put these commands into package.json
# unless paid tier Heroku container/a new physical server is considered

import os
import argparse
import subprocess

class BuildScript:
  def __init__(self):
    parser = argparse.ArgumentParser(prog='PROD_SCRIPT', formatter_class=argparse.MetavarTypeHelpFormatter)
    parser.add_argument('-a', '--run_all', '--all', help="Run everything from start to finish", action="store_true")
    parser.add_argument('-c', '--compile', help="Only compile code", action="store_true")
    parser.add_argument('-g', '--generate_routes', help="Only generate routes with tsoa", action="store_true")
    parser.add_argument('-t', '--run_test', '--test', help="Only run tests", action="store_true")
    parser.add_argument('-s', '--run_server', '--server', help="Only run server", action="store_true")
    parser.add_argument('-m', '--push_main', help="Only push code to main repository", action="store_true")
    self.parser = parser
    self.working_dir = os.path.dirname(os.path.realpath(__file__)).replace("automation\\python", "")

  def run(self, start_message:str, condition:bool, command, failed_message:str, end_message:str):
    print(start_message)
    if condition:
      try:
        subprocess.run(command, cwd=self.working_dir, shell=True)
      except:
        print(failed_message)
        raise Exception()
    else:
      print("Skipping...")
    print(end_message)

  def push_to_heroku_container(self):
    app_name = "lida-344814-testing"
    try:
      subprocess.check_output(["git", "push", "heroku", "master"])
    except subprocess.CalledProcessError:
      print("Heroku github repository is not initialized. Reinitialize the process (if Heroku CLI is not installed, please do so and rerun this):")
      try:
        subprocess.run(["heroku", "login"], shell=True)
      finally:
        try:
          subprocess.check_output(["heroku", "git:remote", "-a", app_name], shell=True)
          subprocess.run(["git", "pull", "heroku", "master"])
          subprocess.run(["git", "push", "heroku", "master"])
          print("Finished pushing code to Heroku container")
        except subprocess.CalledProcessError as e:
          print(e)

  def execute(self):
    namespace = self.parser.parse_args()
    print("Starting build...")

    try:
      self.run(
        start_message="Generating swagger.json and routes for the server...",
        condition=namespace.run_all or namespace.generate_routes,
        command="npx tsoa spec-and-routes".split(" "),
        failed_message="App routes generation is failed",
        end_message="Finished generating swagger.json and routes for the server!"
      )
      
      self.run(
        start_message="Compiling Typescript code...",
        condition=namespace.run_all or namespace.compile,
        command=["npx", "tsc", "--experimentalDecorators", "--esModuleInterop"],
        failed_message="Failed to compile typescript code",
        end_message="Finished compiling Typescript"
      )

      self.run(
        start_message="Running tests...",
        condition=namespace.run_all or namespace.run_test,
        command=["npx", "jest", "--watchAll", "--detectOpenHandles", "--forceExit"],
        failed_message="Tests are failed to run",
        end_message="Finished testing with Jest"
      )

      if namespace.run_all or namespace.run_server:
        try:
          subprocess.run(["git", "add", "-A"])
          subprocess.run(["git", "commit", "-m", "Commit staged by a Python script"])
          self.push_to_heroku_container()
        finally:
          # return to the previous commit for secret removal out of future commits
          main_github_repo, repo_branch, repo_name = "https://github.com/asd135hp/LIDA-API", "master", "LIDA-API"
          
          # safe guard, does not cost much
          subprocess.run(["git", "remote", "add", repo_name, main_github_repo])
          subprocess.run(["git", "push", repo_name, repo_branch])

    except Exception as e:
      print("Could not proceed further due to following error occurred:")
      print(e)
    
    print("Closing...")
    

if __name__ == "__main__":
  local = BuildScript()
  namespace = local.execute()