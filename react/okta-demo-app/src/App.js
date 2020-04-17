import React from "react";
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom";
import { Security, SecureRoute, LoginCallback } from "@okta/okta-react";

import config from "./config/config";

import Navbar from "./components/layout/Navbar";
import Home from "./components/pages/Home";
import Motd from "./components/pages/Motd";
import Login from "./components/auth/SignInWidget";

import "./App.css";

const HasAccessToRouter = () => {
    const issuer = `${config.oktaOrg}/${config.issuerPath}`;
    const history = useHistory();

    const customAuthHandler = () => {
        // TODO: this causes a warning
        history.push("/login");
    };

    return (
        <Security
            issuer={issuer}
            clientId={config.clientId}
            redirectUri={config.redirectUri}
            scopes={config.scopes}
            pkce={true}
            onAuthRequired={customAuthHandler}
        >
            <div className="App">
                <Navbar />
                <div className="container">
                    <Route path="/" exact component={Home} />
                    <Route path="/login" component={Login} />
                    <SecureRoute path="/motd" component={Motd} />
                    <Route path="/redirect" component={LoginCallback} />
                </div>
            </div>
        </Security>
    );
};

const App = () => (
    <div>
        <Router>
            <HasAccessToRouter />
        </Router>
    </div>
);

export default App;
