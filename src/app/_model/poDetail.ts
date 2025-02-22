
import { Ingredients } from "./ingredients";
import { Supplier } from "./supplier";
import { User } from "./user";



export class PoDetail {
  id: string;
  poId: string;
  date: string;
  dateFormat: string;
  dateMonth: string;
  dateDay: string;
  dateYear: string;
  time: string;

  items: Ingredients[];

  itemsLength: number;


  orderStatus: string;
  status: boolean;

  statusPayment: boolean;
  statusApproved: boolean;
  statusCreateRi: boolean;
  description: string;

  supplier: Supplier;

  total: number;
  totalAll: number;

  vatType: string;
  vat: number;
  totalVat: number;

  discount: number;
  totalDiscount: number;

  totalShipping: number;
  shipping: number;
  reference: string;

  dateRequest: string;
  user: User;

  uniqueKey: string;
  branchId: string;
  userApproved: User;
}
