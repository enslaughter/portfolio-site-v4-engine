import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
    jwksUri: process.env.JWKS_URI!,
    cache: true,
    cacheMaxEntries: 5,
    cacheMaxAge: 600000,
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
    client.getSigningKey(header.kid!, (err, key) => {
        if (err) return callback(err);
        callback(null, key?.getPublicKey());
    });
}

export function verifyToken(token: string): Promise<jwt.JwtPayload> {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            getKey,
            {
                audience: process.env.JWT_AUDIENCE,
                issuer: process.env.JWT_ISSUER,
                algorithms: ['RS256', 'ES256'],
            },
            (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded as jwt.JwtPayload);
            }
        );
    });
}
