import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/* eslint-disable @typescript-eslint/no-explicit-any */
export /**
 *This function is used to extract out the name of the pdf
 *
 * @param {string} url
 * @return {*} 
 */
const extractPdfFilename = (url: string) => {
	const parts = url.split('/');
	
	const fileName = parts.pop();
	
	if (fileName && fileName.endsWith('.pdf')) {
	  return fileName;
	}
	
}
  
export /**
 *This function is used to remove duplicated enteries in array of objects based on a given key
 *
 * @param {*} array
 * @param {string} key
 * @return {*}
 */
  const removeDuplicates = (array: any, key: string) =>
    array.filter(
      (item: any, index: number, self: any) =>
        // Use indexOf to check if the current item's key value
        // is the same as the key value of the first occurrence in the array.
        index === self.findIndex((t: any) => t[key] === item[key]),
    );

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
