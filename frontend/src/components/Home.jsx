import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Card, Button } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import axios from 'axios';
import cookie from 'js-cookie';

const useStyles = makeStyles(theme =>
  createStyles({
    Container: {
      margin: '2rem auto',
      height: '100vh',
    },
    Card: {
      height: '100%',
      padding: '1rem',
    },
  })
);

function Home() {
  const history = useHistory();
  const classes = useStyles();
  const [userDetails, setUserDetails] = useState({});
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const { user } = history.location.state;
  const token = cookie.get('token');

  const getBooks = async () => {
    if (user === 'seller') {
      const res = await axios.get(
        'http://localhost:8000/api/book/booksBySeller',
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setFilteredBooks(res.data.books);
      setBooks(res.data);
    } else {
      const res = await axios.get('http://localhost:8000/api/book/', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      setBooks(res.data.books);
      setFilteredBooks(res.data.books);
    }
  };

  const getUserDetails = async () => {
    if (user === 'seller') {
      const res = await axios.get(
        'http://localhost:8000/api/seller/getSeller',
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setUserDetails(res.data);
      await getBooks();
    } else {
      const res = await axios.get(
        'http://localhost:8000/api/customer/getCustomer',
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      setUserDetails(res.data);
      await getBooks();
    }
  };

  const addBooks = async (name, price) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/book/addBook',
        { name, price },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 409) {
        alert('Book already exists');
      } else if (res.status === 201) {
        alert('book added!');
      }
    } catch (err) {
      console.error(err);
    }
    await getBooks();
  };

  const deleteBook = async id => {
    try {
      await axios.delete(`http://localhost:8000/api/book/deleteBook/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      alert('Book deleted');
      await getBooks();
    } catch (err) {
      console.error(err);
    }
  };

  const editBook = async (id, name, price) => {
    if (name === '') name = false;
    if (price === '') price = false;
    try {
      const res = await axios.post(
        `http://localhost:8000/api/book/editBook/${id}`,
        {
          name,
          price,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) alert('Book updated');
    } catch (err) {
      console.error(err);
    }
  };

  const purchaseBook = async id => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/book/buyBook/${id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      getUserDetails();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => getUserDetails(), []);

  if (user === 'seller') {
    document.title = 'Seller Home';
    return (
      <Container className={classes.Container}>
        <Card elevation={8} className={classes.Card}>
          <div>
            <h2>Seller Name: {userDetails.name}</h2>
          </div>
          <Button
            variant="contained"
            color="secondary"
            onClick={e => {
              cookie.remove('token');
              history.push('/');
            }}
          >
            Logout
          </Button>
          <div>
            <h3>Book Details: </h3>
            <select
              name="detail"
              id="detail"
              onChange={e => {
                if (e.target.value === 'sold') {
                  setFilteredBooks(books.booksSold);
                } else {
                  setFilteredBooks(books.books);
                }
              }}
            >
              <option value="all">All Books</option>
              <option value="sold">Sold Books</option>
            </select>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            <Button
              color="primary"
              variant="contained"
              onClick={e => {
                const name = prompt('Enter name of book');
                const price = prompt('Enter price of book');
                addBooks(name, price);
                getBooks();
              }}
            >
              Add Books
            </Button>
          </div>
          <div>
            <table>
              <tr>
                <th>Sr. No.</th>
                <th>Name</th>
                <th>Price</th>
                <th colSpan="2">Actions</th>
              </tr>
              {filteredBooks.map((book, index) => (
                <tr key={book._id}>
                  <td>{index + 1}</td>
                  <td>{book.name}</td>
                  <td>{book.price}</td>
                  <td>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={async e => {
                        const name = prompt('Enter new name?');
                        const price = prompt('Enter new price?');
                        editBook(book._id, name, price);
                        await getBooks();
                      }}
                    >
                      Edit
                    </Button>
                  </td>
                  <td>
                    <Button
                      color="secondary"
                      variant="contained"
                      onClick={e => deleteBook(book._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </Card>
      </Container>
    );
  } else
    return (
      <Container className={classes.Container}>
        <Card elevation={8} className={classes.Card}>
          <div>
            <h2>Customer Name: {userDetails.name}</h2>
          </div>
          <Button
            variant="contained"
            color="secondary"
            onClick={e => {
              cookie.remove('token');
              history.push('/');
            }}
          >
            Logout
          </Button>
          <select
            name="detail"
            id="detail"
            onChange={e => {
              if (e.target.value === 'purchased') {
                setFilteredBooks(userDetails.books_purchased);
              } else {
                setFilteredBooks(books);
              }
            }}
          >
            <option value="all">All Books</option>
            <option value="purchased">Purchased Books</option>
          </select>
          <div>
            <h3>Book Details: </h3>
          </div>
          <div>
            <table>
              <tr>
                <th>Sr. No.</th>
                <th>Name</th>
                <th>Price</th>
              </tr>
              {filteredBooks.map((book, index) => (
                <tr key={book._id}>
                  <td>{index + 1}</td>
                  <td>{book.name}</td>
                  <td>{book.price}</td>
                  <td>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={async e => {
                        purchaseBook(book._id);
                        await getBooks();
                      }}
                    >
                      Purchase Book
                    </Button>
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </Card>
      </Container>
    );
}

export default Home;
