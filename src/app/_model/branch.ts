import { District } from "./district";
import { Province } from "./province";

export class Branch {
  uniqueKey: string;
  branchId: string;
  branchName: string;
  id: string;
  phone: string;
  address: string;
  province: Province;
  district: District;
  zipcode: string;

}
