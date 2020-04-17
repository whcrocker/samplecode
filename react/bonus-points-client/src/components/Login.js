/**
 * Function based component for the login form.  In this example, any username
 * and password will work.  The user's avatar will be some random funny animal.
 *
 * Author: Henry Crocker
 *
 */
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { getRandomNumber } from "../helpers/utils";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href="https://www.cmmps.com/">
                Crocker Multimedia Production Services, Inc.
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

// set up some custom styles for this component
const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}));

export default function LoginIn(props) {
    const classes = useStyles();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // used to generate random avatar images
    const [animals] = useState([
        "images/animal1.jpg",
        "images/animal2.jpg",
        "images/animal3.jpg",
        "images/animal4.jpg",
        "images/animal5.jpg"
    ]);

    // used to generate random last names for the user
    const [lastNames] = useState([
        "Johnson",
        "Smith",
        "Benson",
        "Jackson",
        "Garner"
    ]);

    // used to generate random first names for the user
    const [firstNames] = useState([
        "John",
        "Sally",
        "Tyler",
        "Patrick",
        "Shelley"
    ]);

    // used to generate job titles for the user
    const [jobTitles] = useState([
        "Software Engineer",
        "Product Owner",
        "Accountant",
        "Marketing Associate",
        "QA Engineer"
    ]);

    const handleUsernameChange = event => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = event => {
        setPassword(event.target.value);
    };

    const handleSubmit = event => {
        event.preventDefault();
        props.onLogIn({
            username,
            image: animals[getRandomNumber(0, 4)],
            name: `${firstNames[getRandomNumber(0, 4)]} ${
                lastNames[getRandomNumber(0, 4)]
            }`,
            jobTitle: jobTitles[getRandomNumber(0, 4)]
        });
    };

    const validateForm = () => {
        return username.length > 0 && password.length > 0;
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <form
                    className={classes.form}
                    noValidate
                    onSubmit={handleSubmit}
                >
                    <TextField
                        value={username}
                        onChange={handleUsernameChange}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                    />
                    <TextField
                        value={password}
                        onChange={handlePasswordChange}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={!validateForm()}
                    >
                        Sign In
                    </Button>
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}
