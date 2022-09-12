import { SensorDataDTO } from "../../../../../model/v1/read/sensorDto";

type PriorityDict = {
  [name: string]: SensorDataDTO
}

export function getEachSensorLatestData(rawData: SensorDataDTO[]): SensorDataDTO[] {
  const dict: PriorityDict = {}
  const result = []
  rawData.map(dto => {
    const val = dict[dto.sensorName]
    if(!val || dto.timeStamp > val.timeStamp) dict[dto.sensorName] = dto
  })

  for(const name in dict) result.push(dict[name])
  return result
}