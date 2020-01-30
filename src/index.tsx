import 'core-js';
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  Route,
  HashRouter as Router,
  Switch
} from 'react-router-dom';

import TurnTest from './components/turn-test/turn.test';

class App extends React.Component {
    render(): JSX.Element {
      return (
        <Router>
          <div>
            <Switch>
              <Route exact path="/" component={TurnTest} />
            </Switch>
          </div>
        </Router>
      );
    }
  }

ReactDOM.render(
    <App />,
    document.getElementById("app")
);
