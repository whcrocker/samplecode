import { useOktaAuth } from "@okta/okta-react";
import React, { useState, useEffect } from "react";

const Home = () => {
    const { authState, authService } = useOktaAuth();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        if (!authState.isAuthenticated) {
            setUserInfo(null);
        } else {
            authService.getUser().then(info => {
                setUserInfo(info);
            });
        }
    }, [authState, authService]);

    const logout = async () => {
        authService.logout("/");
    };

    if (authState.isPending) {
        return (
            <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    return (
        <div>
            <div>
                {authState.isAuthenticated && !userInfo && (
                    <div>Loading user information...</div>
                )}

                {authState.isAuthenticated && userInfo && (
                    <div>
                        <p>Welcome back, {userInfo.name}!</p>
                        <p>
                            <a href="/" onClick={logout}>
                                Click here to logout
                            </a>
                        </p>
                    </div>
                )}

                {!authState.isAuthenticated && (
                    <div>
                        <p>Welcome to the Okta Demo App!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
