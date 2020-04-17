const config = {
    oktaOrg: "https://dev-******.okta.com",
    issuerPath: "oauth2/**********",
    clientId: "************",
    redirectUri: window.location.origin + "/redirect",
    pkce: true,
    scopes: ["openid", "profile", "email", "motd:read"],
    display: "page",
    responseType: "code",
    responseMode: "query",
    logo: "/quoteLogo.png",
    i18n: {
        en: {
            "primaryauth.title": "Sign in to Okta Demo App"
        }
    }
};

export default config;
