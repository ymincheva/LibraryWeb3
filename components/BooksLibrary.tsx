import { useEffect, useState } from 'react';
import useBooksLibraryContract from '../hooks/useBooksLibraryContract';
import { useForm } from 'react-hook-form';
import Select from 'react-select';

type BooksLibraryContract = {
  contractAddress: string;
};

const BooksLibrary = ({ contractAddress }: BooksLibraryContract) => {
  const libraryContract = useBooksLibraryContract(contractAddress);

  const [bookName, setBookName] = useState<string>('');
  const [bookCopies, setBookCopies] = useState<number>(0);
  const [bookId, setBookId] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState({});
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onSubmit = data => console.log(data);

  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = event => {
    setBookId(event.target.value);
    console.log(event.target.value);
  };

  async function getBooksData() {
    setLoading(true);
    const currentBookId = await libraryContract.currentBookId();
    const bookCount = Number(currentBookId.toString());
    const books = [];

    for (let i = 0; i < bookCount; i++) {
      const currentBook = await libraryContract.BookLedger(i);

      books.push({
        id: i,
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

  const resetForm = async () => {
    setBookName('');
    setBookCopies(0);
  };

  const handleBookNameInput = e => {
    setBookName(e.target.value);
  };

  const handleCopiesInput = e => {
    setBookCopies(e.target.value);
  };

  function validate(bookName, copies) {
    const errors = [];

    if (bookName.length === 0) {
      errors.push("Name can't be empty");
    }

    if (copies < 0) {
      errors.push('Copies of books should be at least 1');
    }

    return errors;
  }

  const submitStateResults = async () => {
    setLoading(true);
    try {
      const hasErrors = validate(bookName, bookCopies);

      if (hasErrors.length > 0) {
        //  setError(hasErrors);
        //  return;
      }

      const tx = await libraryContract.addBook(bookName, bookCopies);
      await tx.wait();

      resetForm();
      getBooksData();
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const submitBorrowResults = async () => {
    setLoading(true);
    try {
      const tx = await libraryContract.borrowBook(bookId);
      await tx.wait();
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const renderBookTable = () => {
    const tableRows = books.map((book, index) => (
      <tr key={index}>
        <td>{book.name}</td>
        <td className="text-end">{book.copies}</td>
      </tr>
    ));
    return (
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th className="text-end" scope="col">
              Copies
            </th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    );
  };

  return (
    <div className="mt-5">
      <h3>Book list</h3>
      {loading ? (
        <div className="my-4" style={{ color: `green` }}>
          Loading books...
        </div>
      ) : books.length > 0 ? (
        renderBookTable()
      ) : (
        <div style={{ color: `blue` }}>No books</div>
      )}

      <div className="mt-5" onSubmit={handleSubmit(onSubmit)}>
        <h3>Add new book</h3>
        <p className="mb-2 mt-4">Book name:</p>
        {/*   <input
          className="form-control"
          onChange={handleBookNameInput}
          value={bookName}
          type="text"
        /> */}
        <input {...register('bookName', { required: true })} />
        {errors.bookName?.type === 'required' && <p role="alert">Bookname is required</p>}

        <p className="mb-2 mt-3">Copies:</p>
        <input
          className="form-control"
          onChange={handleCopiesInput}
          value={bookCopies}
          type="number"
          /*      {...register('bookCopies', { min: 1, max: 99 })} */
        />

        <div className="button-wrapper mt-3">
          <button className="btn btn-primary" onClick={submitStateResults}>
            Add book
          </button>
        </div>

        <div className="button-wrapper mt-3">
          <select onChange={handleChange} name="books" id="books-select">
            {books.map((book, index) => (
              <option key={index} value={book.id}>
                {book.name}
              </option>
            ))}
          </select>
        </div>
        <div className="button-wrapper mt-3">
          <button className="btn btn-primary" onClick={submitBorrowResults}>
            Borrow book
          </button>
        </div>
      </div>
    </div>
  );
};

export default BooksLibrary;
