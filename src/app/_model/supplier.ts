import { District } from "./district";
import { Province } from "./province";

export class Supplier {
  id: string;

  name: string;
  phone: string;
  email: string;
  idNumber: string;
  date: string;
  dateFormat: string;
  description: string;

  address: string;
  district: District;
  province: Province;
  zipcode: string;

  branchId: string;
  uniqueKey: string;

}
