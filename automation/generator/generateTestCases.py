from random import randint, random
from sys import argv
from os.path import dirname, realpath
from re import sub
import json

################################################################################################
# Generate test cases for testing purposes. The data here does not have too much meaning to it #
# and could be easily reproducable                                                             #
################################################################################################

def chooseRandomlyInList(l: list):
  return l[randint(0, len(l) - 1)]

def getUniqueNameFromList(targetList: list, outList: list, startRange: int, endRange: int, append = True):
  name = chooseRandomlyInList(targetList)
  uniqueName = name + str(randint(startRange, endRange))
  while uniqueName in outList:
    uniqueName = name + str(randint(startRange, endRange))
  
  if append: outList.append(uniqueName)
  return uniqueName

class Test1:
  def __init__(self):
    self.sensorNames = []
    self.actuatorNames = []

  def sensor(self, template, generateFromKnownList = False):
    sampleSize = template["sampleSize"]
    return [{
      "name": getUniqueNameFromList(template["name"], self.sensorNames, 1, sampleSize)
        if not generateFromKnownList
        else self.sensorNames[i],
      "type": chooseRandomlyInList(template["type"])
        if not generateFromKnownList
        else sub("\d+", "", self.sensorNames[i]),
      "isRunning": chooseRandomlyInList(template["isRunning"])
    } for i in range(0, sampleSize)]

  def sensorData(self, template):
    sampleSize = template["sampleSize"]
    startDate, endDate = list(map(lambda x: int(x), template["timeStamp"].split('-')))
    return [{
      "sensorName": chooseRandomlyInList(self.sensorNames),
      "value": round(random() * 100, 1),
      "timeStamp": randint(startDate, endDate)
    } for _ in range(0, sampleSize)]

  def actuator(self, template, generateFromKnownList = False):
    sampleSize = template["sampleSize"]
    return [{
      "name": getUniqueNameFromList(template["name"], self.actuatorNames, 1, sampleSize)
        if not generateFromKnownList
        else self.actuatorNames[i],
      "type": chooseRandomlyInList(template["type"])
        if not generateFromKnownList
        else sub("\d+", "", self.sensorNames[i]),
      "isRunning": chooseRandomlyInList(template["isRunning"])
    } for i in range(0, sampleSize)]
    
  def actuatorCommands(self, template):
    result = []
    sampleSize = template["sampleSize"]
    startDate, endDate = list(map(lambda x: int(x), template["timeStamp"].split('-')))
    for _ in range(0, sampleSize):
      commandDict = {
        "actuatorName": chooseRandomlyInList(self.actuatorNames),
        "timesPerDay": chooseRandomlyInList(template["timesPerDay"]),
        "timeStamp": randint(startDate, endDate)
      }

      if randint(0, 1) == 0:
        commandDict["toggleCommand"] = {
          "state": chooseRandomlyInList(template["toggleCommand"]["state"])
        }
      else:
        commandDict["motorCommand"] = [{
          "duration": randint(1, 10),
          "isClockwise": chooseRandomlyInList(template["motorCommand"]["isClockwise"])
        } for _ in range(0, randint(1, 3))]

      result.append(commandDict)

    return result

  def logs(self, template, replacement):
    return [replacement(chooseRandomlyInList(template["content"])) for _ in range(0, template["sampleSize"])]

  # Format: each element in the array represents a day and that day's respective data snapshot
  def dataSaving_sensor(self, template):
    result, seconds = [], 3600 * 24 - 1
    sampleSize = template["sampleSize"]
    startDate, endDate = list(map(lambda x: int(x), template["timeStamp"].split('-')))
    for _ in range(0, sampleSize):
      currentEndDate = startDate + seconds
      if currentEndDate > endDate: break
      template["sensorData"]["timeStamp"] = "{0}-{1}".format(startDate, currentEndDate)
      result.append({
        "sensor": self.sensor(template["sensor"], True),
        "sensorData": self.sensorData(template["sensorData"])
      })
      startDate = currentEndDate + 1

    return result

  # Format: each element in the array represents a day and that day's respective data snapshot
  def dataSaving_logs(self, template):
    result, seconds = [], 3600 * 24 - 1
    sampleSize = template["sampleSize"]
    startDate, endDate = list(map(lambda x: int(x), template["timeStamp"].split('-')))
    for _ in range(0, sampleSize):
      currentEndDate = startDate + seconds
      if currentEndDate > endDate: break
      result.append({
        "sensor": [
          {
            "logContent": self.getSensorLogs(chooseRandomlyInList(template["sensor"]["content"])),
            "timeStamp": randint(startDate, currentEndDate)
          } for _ in range(0, template["sensor"]["sampleSize"])
        ],
        "actuator": [
          {
            "logContent": self.getSensorLogs(chooseRandomlyInList(template["actuator"]["content"])),
            "timeStamp": randint(startDate, currentEndDate)
          } for _ in range(0, template["actuator"]["sampleSize"])
        ]
      })
      startDate = currentEndDate + 1

    return result

  def getSensorLogs(self, content: str):
    return content.replace("sensor.name", chooseRandomlyInList(self.sensorNames))

  def getActuatorLogs(self, content: str):
    return content.replace("actuator.name", chooseRandomlyInList(self.actuatorNames))

  # Main method - Public
  def compile(self):
    fileName = dirname(realpath(__file__)).replace(
      "automation\\generator",
      "src/controller/__tests__/testcases.json")

    with open(dirname(realpath(__file__)) + "/template.json") as sampleFile:
      template = json.loads("\n".join(sampleFile.readlines()))["test1"]

      # Generate test cases
      testCases = {
        "sensors": self.sensor(template["sensor"]),
        "sensorData": self.sensorData(template["sensorData"]),
        "actuators": self.actuator(template["actuator"]),
        "actuatorCommands": self.actuatorCommands(template["actuatorCommands"]),
        "sensorLogs": self.logs(template["sensorLogs"], self.getSensorLogs),
        "actuatorLogs": self.logs(template["actuatorLogs"], self.getActuatorLogs),
        "dataSaving": {
          "sensor": self.dataSaving_sensor(template["dataSaving"]["sensor"]),
          "logs": self.dataSaving_logs(template["dataSaving"]["logs"])
        }
      }

      # Write everything to destined output json file
      with open(fileName, 'w+') as outFile:
        json.dump(obj = testCases, fp = outFile, indent = 2)

def main(testId):
  if testId == 0:
    return Test1().compile()

if __name__ == '__main__':
  main(0 if len(argv) == 1 else argv[1])