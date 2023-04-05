import CalendarPage from './CalendarPage';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { getToday } from './dateFunctions';
import { useEffect, useState } from 'react';
import { getUserEndPoint, IUser } from './backend';
import LoginPage from './LoginPage';
import { authContext } from './authContext';

function App() {
  const month = getToday().substring(0, 7);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    getUserEndPoint().then(setUser, onSingOut);
  }, []);

  function onSingOut() {
    setUser(null);
  }

  if (user) {
    return (
      <authContext.Provider value={{ user, onSingOut }}>
        <Router>
          <Switch>
            <Route path="/calendar/:month">
              <CalendarPage />
            </Route>

            <Redirect to={{ pathname: '/calendar/' + month }} />
          </Switch>
        </Router>
      </authContext.Provider>
    );
  } else {
    return <LoginPage onSingIn={setUser} />;
  }
}

export default App;
