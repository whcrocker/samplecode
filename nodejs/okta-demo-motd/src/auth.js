const OktaJwtVerifier = require('@okta/jwt-verifier');
const config = require('./config');

const ISSUER = `${config.oktaOrg}/${config.issuerPath}`;
const AUDIENCE = config.audience;
const CLIENT_ID = config.clientAppId;
const EXPECTED_SCOPES = config.scopes;
const EXPECTED_GROUPS = config.groups;

const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: ISSUER,
    clientId: CLIENT_ID,
    assertClaims: {
        'groups.includes': EXPECTED_GROUPS, 
        'scp.includes': EXPECTED_SCOPES 
    }
});

module.exports = (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            throw new Error('Missing Authorization header.');
        }

        const [authType, token] = authorization.trim().split(' ');
        if (authType !== 'Bearer') {
            throw new Error('Missing Bearer token.');
        }

        oktaJwtVerifier.verifyAccessToken(token, AUDIENCE)
            .then(
                jwt => {
                    req.jwt = jwt;
                    next();
                }
            )
            .catch(
                err => {
                    next(err);
                }
            );
    }
    catch (error) {
        next(error.message)
    }
}
