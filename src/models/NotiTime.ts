export enum Meridiem {
  AM = "AM",
  PM = "PM",
}

export type NotiTime = {
  hour: number;
  minute: number;
  meridiem: Meridiem; // 'AM' | 'PM'
};
