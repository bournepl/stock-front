import { Ingredients } from "./ingredients";
import { IngredientsCategory } from "./ingredients-category";
import { Supplier } from "./supplier";

export class IngredientsHistory {

  id: string;

  date: string;
  dateFormat: string;
  dateMonth: string;
  dateDay: string;
  dateYear: string;
  time: string;

  status: boolean;

  ingredient: Ingredients;
  menuId: string;
  orderId: string;
  useAmount: number;

  branchId: string;
  uniqueKey: string;
}
