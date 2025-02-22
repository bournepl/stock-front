import { District } from "./district";
import { Province } from "./province";

export class UserInfo {
  id: string;
  address: string;
  province: Province;
  district: District;
  zipcode: string;
  phone: string;
  userId: string;
  birthday: string;
  birthdayDate: any;
}
