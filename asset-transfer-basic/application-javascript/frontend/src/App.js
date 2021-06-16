import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useLedger } from "./context/LedgerContext";
import Header from "./components/Header";
import InitLedger from "./components/InitLedger";
import Home from "./components/Home";
import { Container } from "@material-ui/core";

const App = () => {
  const { ledgerInit } = useLedger();

  return (
    <>
      <Header />
      <Router>
        <Container>
          <Switch>
            <Route path="/" exact>
              {ledgerInit ? <Home /> : <InitLedger />}
            </Route>
          </Switch>
        </Container>
      </Router>
    </>
  );
};

export default App;
