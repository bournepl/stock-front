import { Ingredients } from "./ingredients";
import { IngredientsCategory } from "./ingredients-category";
import { Supplier } from "./supplier";
import { User } from "./user";

export class CheckStock {

  id: string;

  ingredient: Ingredients;

  date: string;
  dateFormat: string;
  dateMonth: string;
  dateDay: string;
  dateYear: string;
  time: string;

  amount: number;
  quantity: number;
  useAmount: number;

  branchId: string;
  uniqueKey: string;
  user: User;
}
