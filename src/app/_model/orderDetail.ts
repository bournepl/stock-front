import { Menu } from "./menu";
import { User } from "./user";


export class OrderDetail {
  id: string;
  orderId: string;
  date: string;
  dateFormat: string;
  dateMonth: string;
  dateDay: string;
  dateYear: string;
  time: string;

  dateOrder: string;

  menu: Menu[];

  description: string;

  orderStatus: string;
  status: boolean;

  orderItemsLength: number;

  branchId: string;
  uniqueKey: string;
  totalAll: number;
  channelType: string;
  paymentType: string;
  user: User;

  statusApproved: boolean;
}
