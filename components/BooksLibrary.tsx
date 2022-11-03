import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import useBooksLibraryContract from "../hooks/useBooksLibraryContract";
import DataTable from "react-data-table-component";

type BooksLibraryContract = {
  contractAddress: string;
};

const BooksLibrary = ({ contractAddress }: BooksLibraryContract) => {
  const { account, library } = useWeb3React<Web3Provider>();
  const usBooksLibraryContract = useBooksLibraryContract(contractAddress);
  const [nameBook, setBook] = useState<string | undefined>();
  const [copies, setCopies] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);

  async function getBooksData() {
    const currentBookId = await usBooksLibraryContract.currentBookId();
    const bookCount = Number(currentBookId.toString());
    const books = [];
    setLoading(true);

    for (let i = 0; i < bookCount; i++) {
      const currentBook = await usBooksLibraryContract.BookLedger(i);

      books.push({
        name: currentBook.name,
        copies: Number(currentBook.copies),
      });
    }
    setBooks(books);
    setLoading(false);
  }

  useEffect(() => {
    getBooksData();
  }, []);

  const [books, setBooks] = useState([]);

  const stateInput = (input) => {
    setBook(input.target.value);
  };

  const resetForm = async () => {};

  const columns = [
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Copies",
      selector: "copies",
      sortable: true,
    },
  ];

  const bookNameInput = (input) => {
    setBook(input.target.value);
  };

  const copiesInput = (input) => {
    setCopies(input.target.value);
  };

  const submitStateResults = async () => {
    const result: any = [nameBook, copies];

    const tx = await usBooksLibraryContract.addBook(nameBook, copies);
    await tx.wait();
    // resetForm();
    // getBooksData();
  };

  return (
    <div className="results-form">
      <form>
        <DataTable title="Books" columns={columns} data={books} />
      </form>
      {loading && <div style={{ color: `green` }}>Loading books....</div>}
      <form>
        <label>
          Book:
          <input
            onChange={bookNameInput}
            value={nameBook}
            type="text"
            name="nameBook"
          />
        </label>

        <label>
          Copies:
          <input
            onChange={copiesInput}
            value={copies}
            type="number"
            name="copies"
          />
        </label>
        <div className="button-wrapper">
          <button onClick={submitStateResults}>Add book</button>
        </div>
      </form>
    </div>
  );
};

export default BooksLibrary;
