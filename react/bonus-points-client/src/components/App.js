/**
 * Top-level class component for the Bonus Points client application.
 *
 * Author: Henry Crocker
 *
 */
import React, { Component, Fragment } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Nav from "./Nav";
import Login from "./Login";
import PointsDataTable from "./PointsDataTable";

class App extends Component {
    constructor(props) {
        super(props);

        // manages state for wheter the user is logged in along with the user's profile.
        this.state = {
            isLoggedIn: false,
            userProfile: {}
        };
    }

    setLoggedIn(userProfile) {
        this.setState(prevState => {
            return { ...prevState, isLoggedIn: true, userProfile };
        });
    }

    setLoggedOut(userProfile) {
        this.setState(prevState => {
            return { ...prevState, isLoggedIn: false, userProfile: {} };
        });
    }

    renderComponent() {
        return this.state.isLoggedIn ? (
            <PointsDataTable />
        ) : (
            <Login onLogIn={this.setLoggedIn.bind(this)} />
        );
    }

    render() {
        return (
            <Fragment>
                <CssBaseline />
                <div>
                    <Nav
                        onLogOut={this.setLoggedOut.bind(this)}
                        isLoggedIn={this.state.isLoggedIn}
                        profileData={this.state.userProfile}
                    />
                    {this.renderComponent()}
                </div>
            </Fragment>
        );
    }
}

export default App;
