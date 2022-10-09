### The purpose of this file is to test the efficiency of the API
### It is believed (by me) that security measurement is the cause of this API instability
### This is backed by the frequent error seen from hardware side
### So this python script will serve as an API stress test
### By spawning out so many threads that does one thing to the API, hopefully, our hypothesis is correct
### NOTE: This script could also be turned into a DOS script if parameters are not set properly

class APIStressTest:
  # 3 seems fine, ig. The thread count will add up quickly
  thread_rate = 3

  # thread spawn rate in ms
  spawn_rate = 50

  # measured in ms - the duration of the test
  duration = 1000

  # test mode - either read or write
  test_mode = "read"

  # default test endpoint
  test_endpoint = "https://lida-api.vercel.app"

  def __init__(self, mode = "production"):
    self.set_end_point(mode)

  def set_end_point(self, mode: str):
    if mode == "production":
      self.test_endpoint = "https://lida-api.vercel.app"
    elif mode == "test":
      self.test_endpoint = "https://"

  def set_test_mode(self, test_mode = "read"):
    if test_mode != "read" and test_mode != "write": pass
    self.test_mode = test_mode