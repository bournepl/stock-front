import { IngredientsCategory } from "./ingredients-category";
import { Supplier } from "./supplier";

export class Ingredients {

  id: string;

  ingredientName: string;
  ingredientId: string;
  brand: string;

  price: number;
  purchaseUnit: string;

  stockAmount: number;
  stockUnit: string;

  useUnit: string;
  useAmount: number;

  amount: number;
  quantity: number;

  safetyStockMax: number;
  safetyStockMin: number;

  maxStock: number;
  leadtime: number;

  description: string;

  status: boolean;

  date: string;
  dateFormat: string;
  barCodeNumber: string;

  branchId: string;
  checked: boolean;
  uniqueKey: string;
  imageUrl: string;
  category: IngredientsCategory
  number: number;

  quantityRequest: number;
  selectChecked: boolean;

  average: number;
  uniqueId: string;
}
