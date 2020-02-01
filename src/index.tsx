import 'core-js';
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  Route,
  HashRouter as Router,
  Switch
} from 'react-router-dom';

import TestView from './components/test.view/test.table';

class App extends React.Component<any, any> {
    render(): JSX.Element {
      return (
        <Router>
          <div>
            <Switch>
              <Route exact path="/" component={TestView} />
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
