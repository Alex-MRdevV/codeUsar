import { type FieldErrors, type UseFormRegister } from "react-hook-form";

export interface SearchableItem {
  id: string;
  [key: string]: any; // Permite que el objeto tenga cualquier otra propiedad
}
