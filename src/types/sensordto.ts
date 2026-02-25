export interface SensorData {
  sid: string;
  receiveDate: string; // ISO date string
  tmp: number;
  hum: number;
  voltage: number;
}

export interface SensorAsset {
  sid: string;
  fridgeName: string;
}


export interface TempChecksModel{
  tempId:number;
  fridgeName:string;
  temperature:string;
  notes:string;
  doneBy:string;
  checkDate:string;
}

export interface ManulLimitModel{
  sid:string;
  lowerLimit:string;
  upperLimit:string;
}