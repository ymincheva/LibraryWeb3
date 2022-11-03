import LIBRARY_ABI from "../contracts/BooksLibrary.json";
//import type { BooksLibrary } from "../contracts/types";
import useContract from "./useContract";

export default function useBooksLibraryContract(contractAddress?: string) {
  return useContract(contractAddress, LIBRARY_ABI.abi);
}
