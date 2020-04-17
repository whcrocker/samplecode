/**
 * Function based component for the navigation bar.  If not logged in, a login link will
 * be displayed.  If logged in, a profile link will be shown.  The majority of this was
 * copied from the material-ui examples.
 *
 */
import React, { useState, forwardRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import Slide from "@material-ui/core/Slide";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// custom style for the component
const useStyles = makeStyles(theme => ({
    image: {
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        width: "75%"
    },
    paper: {
        marginTop: theme.spacing(2),
        display: "flex",
        flexDirection: "column",
        alignItems: "left"
    },
    item: {
        display: "flex",
        alignItems: "left"
    },
    itemLabel: {
        marginRight: "15px",
        alignItems: "right"
    },
    grow: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        display: "none",
        [theme.breakpoints.up("xs")]: {
            display: "block"
        }
    },
    inputRoot: {
        color: "inherit"
    },
    sectionDesktop: {
        display: "none",
        [theme.breakpoints.up("xs")]: {
            display: "flex"
        }
    }
}));

export default function PrimarySearchAppBar(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleProfileMenuOpen = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfileClose = () => {
        setIsProfileOpen(false);
        handleMenuClose();
    };

    const handleProfileOpen = () => {
        setIsProfileOpen(true);
    };

    const handleLogout = () => {
        handleMenuClose();
        props.onLogOut();
    };

    const menuId = "primary-search-account-menu";
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleProfileOpen}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Log Out</MenuItem>
        </Menu>
    );

    const renderProfile = (
        <Dialog
            open={isProfileOpen}
            onClose={handleProfileClose}
            TransitionComponent={Transition}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <Typography
                variant="h4"
                color="textPrimary"
                align="center"
                nowrap={true}
                gutterBottom={true}
            >
                {"User Profile"}
            </Typography>
            <DialogContent>
                <img
                    className={classes.image}
                    src={props.profileData.image}
                    alt={props.profileData.name}
                />
                <div className={classes.paper}>
                    <div className={classes.item}>
                        <div className={classes.itemLabel}>
                            <Typography
                                variant="h6"
                                color="textPrimary"
                                align="left"
                                nowrap={true}
                                gutterBottom={false}
                            >
                                Username:
                            </Typography>
                        </div>
                        <Typography
                            variant="h6"
                            color="textSecondary"
                            align="left"
                            nowrap={true}
                            gutterBottom={false}
                        >
                            {props.profileData.username}
                        </Typography>
                    </div>

                    <div className={classes.item}>
                        <div className={classes.itemLabel}>
                            <Typography
                                variant="h6"
                                color="textPrimary"
                                align="left"
                                nowrap={true}
                                gutterBottom={false}
                            >
                                Name:
                            </Typography>
                        </div>
                        <Typography
                            variant="h6"
                            color="textSecondary"
                            align="left"
                            nowrap={true}
                            gutterBottom={false}
                        >
                            {props.profileData.name}
                        </Typography>
                    </div>

                    <div className={classes.item}>
                        <div className={classes.itemLabel}>
                            <Typography
                                variant="h6"
                                color="textPrimary"
                                align="left"
                                nowrap={true}
                                gutterBottom={false}
                            >
                                Job Title:
                            </Typography>
                        </div>
                        <Typography
                            variant="h6"
                            color="textSecondary"
                            align="left"
                            nowrap={true}
                            gutterBottom={false}
                        >
                            {props.profileData.jobTitle}
                        </Typography>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleProfileClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );

    return (
        <div className={classes.grow}>
            <AppBar position="static">
                <Toolbar>
                    <Typography className={classes.title} variant="h6" noWrap>
                        Bonus Points Administration
                    </Typography>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                            disabled={!props.isLoggedIn}
                        >
                            <AccountCircle />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {renderMenu}
            {renderProfile}
        </div>
    );
}
