
import { Ingredients } from "./ingredients";
import { Supplier } from "./supplier";
import { UserProfile } from "./user-profile";


export class RiPayment {

  id: string;
  riId: string;
  date: string;
  dateFormat: string;
  dateMonth: string;
  dateDay: string;
  dateYear: string;
  time: string;
  bank: string;

  datePayment: string;
  total: number;
  paymentType: string;
  description: string;

  uniqueKey: string;
  branchId: string;
  dateTime: any;
}
