export interface DefineSenor{
    id:number;
    sensorCode:string;
}
//for dropdown
export interface SensorModel {
    sid: string;
}

export interface SensorApiItem {
  value: string;
  text: string;
}


export enum FridgeStatus {
  Activated = 0,
  Deactivated = 1,
}

export interface FridgeTemp {
  id: number;
  fridgeName?: string;
  lowerLimit?: string;
  upperLimit?: string;
  defineDate?: string; // DateTime comes as ISO string
  sid?: string;
  assetsTypes?: string;
  assetsSubTypes?: string;
  comment?: string;
  status: FridgeStatus;
}

export interface RoleModel{
  id?:number
  name: string;
}

export interface CreatFridgeAsset {
  id?: number;
  fridgeName?: string;
  lowerLimit?: string;
  upperLimit?: string;
  defineDate?: string; // DateTime comes as ISO string
  sid?: string;
  assetsTypes?: string;
  assetsSubTypes?: string;
}

export interface JobDescModel {
  id: number;
  createdDate?: string; 
  roleName?: string;
}

export interface PolicyModel {
  id: number;
  policyType?: string;
  policyDate?: string; 
  roleName?: string;
}