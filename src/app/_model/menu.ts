import { Ingredients } from "./ingredients";
import { MenuCategory } from "./menu-category";



export class Menu {

  id: string;
  menuCategory: MenuCategory;
  uniqueKey: string;
  branchId: string;
  menuName: string;
  menuId: string;
  menuCode: string;
  description: string;
  ingredients: Ingredients[];
  status: boolean;
  imageUrl: string;
  quantity: number;
  total: number;
  number: number;
  date: string;
  packageIngredients: Ingredients[];
  checked: boolean;
  dateFormat: string;
}
