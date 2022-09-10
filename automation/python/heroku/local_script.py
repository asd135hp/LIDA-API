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

class LocalTest:
  def __init__(self):
    parser = argparse.ArgumentParser(prog='LOCAL_TEST', formatter_class=argparse.MetavarTypeHelpFormatter)
    parser.add_argument('-a', '--run_all', '--all', help="Run everything from start to finish", action="store_true")
    parser.add_argument('-c', '--compile', help="Only compile code", action="store_true")
    parser.add_argument('-g', '--generate_routes', help="Only generate routes with tsoa", action="store_true")
    parser.add_argument('-t', '--run_test', '--test', help="Only run tests", action="store_true")
    parser.add_argument('-s', '--run_server', '--server', help="Only run server", action="store_true")
    self.parser = parser
    self.working_dir = os.path.dirname(os.path.realpath(__file__)).replace("automation\\python", "")

  def run(self, start_message:str, condition:bool, command, failed_message:str, end_message:str):
    print(start_message)
    if condition:
      try:
        subprocess.run(command, cwd=self.working_dir, shell=True)
      except Exception as e:
        print(failed_message)
        raise Exception()
    else:
      print("Skipping...")
    print(end_message)

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

      self.run(
        start_message="Running on localhost server",
        condition=namespace.run_all or namespace.run_server,
        command="node ./index.js".split(' '),
        failed_message="Failed to run localhost server",
        end_message="Finished running the local server"
      )
    except Exception as e:
      print("Could not proceed further due to following error occurred:")
      print(e)

    print("Closing...")
    

if __name__ == "__main__":
  local = LocalTest()
  namespace = local.execute()