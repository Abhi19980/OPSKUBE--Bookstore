import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import LoginPage from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterPage from './components/Register';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
        <ProtectedRoute path="/home" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
