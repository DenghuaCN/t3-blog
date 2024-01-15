/**
 * @desc 封装clsx与tailwind-merge，更好的编写tailwind-css
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
