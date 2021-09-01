import React, { useState } from 'react';
import { Container, Card, TextField, Button } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import { BarLoader } from 'react-spinners';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import cookie from 'js-cookie';

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    },
    card: {
      backgroundColor: '#ffffffbb',
      boxShadow: '0 5px 10px 5px #00000099',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'end',
      flexDirection: 'column',
      padding: '4rem 0rem',
      borderRadius: '1rem',
      width: '80%',
    },
    logo: {
      height: '200px',
      width: '200px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transform: 'translateX(-3.6rem)',
      //   height: '20rem',
    },
    header: {
      width: '80%',
      display: 'flex',
      justifyContent: 'space-between',
    },
    headerText: {
      display: 'inline',
      textTransform: 'uppercase',
      fontSize: '2rem',
    },
    headerLinkText: {
      display: 'inline',
      fontSize: '2rem',
      textDecoration: 'underline',
      transform: 'translateY(-1rem)',
    },
    input: {
      width: '150%',
      paddingBottom: '2rem',
    },
    loginButton: {
      width: '150%',
      height: '3rem',
    },
  })
);

const LoginPage = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginUser, setLoginUser] = useState('customer');
  const history = useHistory();

  const handleLogin = async () => {
    try {
      if (loginUser === 'customer') {
        const res = await axios.post(
          'http://localhost:8000/api/customer/login',
          {
            email,
            password,
          }
        );
        cookie.set('token', res.data.token);
        history.push('/home', { user: 'customer' });
      } else {
        const res = await axios.post('http://localhost:8000/api/seller/login', {
          email,
          password,
        });
        cookie.set('token', res.data.token);
        history.push('/home', { user: 'seller' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm" className={classes.container}>
      <Card className={classes.card}>
        {loginUser === 'customer' ? (
          <h3>Customer Login</h3>
        ) : (
          <h3>Seller Login</h3>
        )}
        <div className={classes.header}>
          <span className={classes.headerText}>Login </span>
          <Button
            color="primary"
            className={classes.headerLinkText}
            onClick={e => {
              history.push('/register');
            }}
          >
            Register
          </Button>
        </div>
        <form
          onSubmit={async e => {
            e.preventDefault();
            document.title = 'Loading...';
            setLoading(true);
            await handleLogin();
            setLoading(false);
          }}
          className={classes.form}
        >
          <TextField
            variant="outlined"
            id="email"
            name="email"
            label="Email"
            type="email"
            onChange={e => setEmail(e.target.value)}
            value={email}
            className={classes.input}
            required
          />
          <TextField
            variant="outlined"
            id="password"
            name="password"
            label="Password"
            type="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
            className={classes.input}
            required
          />

          <Button
            variant="contained"
            color="primary"
            className={classes.loginButton}
            type="submit"
          >
            {loading ? <BarLoader color="white" /> : 'Login'}
          </Button>
        </form>
        <Button
          color="primary"
          className={classes.headerLinkText}
          onClick={_ =>
            setLoginUser(prevValue =>
              prevValue === 'seller' ? 'customer' : 'seller'
            )
          }
        >
          {loginUser === 'customer' ? 'Login as Seller?' : 'Login as Customer?'}
        </Button>
      </Card>
    </Container>
  );
};

export default LoginPage;
