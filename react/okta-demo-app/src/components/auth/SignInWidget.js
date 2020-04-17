import React, { useEffect } from "react";
import * as OktaSignIn from "@okta/okta-signin-widget";
import "@okta/okta-signin-widget/dist/css/okta-sign-in.min.css";

import config from "../../config/config";

const SignInWidget = () => {
    useEffect(() => {
        const signInConfig = {
            baseUrl: config.oktaOrg,
            clientId: config.clientId,
            redirectUri: config.redirectUri,
            logo: config.logo,
            i18n: config.i18n,
            authParams: {
                issuer: `${config.oktaOrg}/${config.issuerPath}`,
                display: config.display,
                responseType: config.responseType,
                responseMode: config.responseMode,
                scopes: config.scopes,
                pkce: config.pkce
            }
        };

        const widget = new OktaSignIn(signInConfig);

        widget.renderEl(
            { el: "#sign-in-widget" },
            () => {
                /**
                 * In this flow, the success handler will not be called beacuse we redirect
                 * to the Okta org for the authentication workflow.
                 */
            },
            err => {
                throw err;
            }
        );

        return () => {
            widget.remove();
        };
    }, []);

    return <div id="sign-in-widget" />;
};

export default SignInWidget;
