import { NextResponse } from 'next/server';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { Env } from '@/env';
import * as service from '@/backend/services';
import * as print from '@/lib/print-helpers';

// The Kinde issuer URL should already be in your `.env` file
// from when you initially set up Kinde. This will fetch your
// public JSON web keys file
const client = jwksClient({
    jwksUri : `${Env.get('KINDE_ISSUER_URL')}/.well-known/jwks.json`
});

export async function POST(request: Request) {
    try {
        const token = await request.text();

        const jwtDecoded = jwt.decode(token, { complete : true });
        if (!jwtDecoded) {
            return NextResponse.json({ message : 'Invalid token: error decoding token' }, { status : 400 });
        }

        const { header } = jwtDecoded;
        print.log('header', header);
        const { kid } = header;
        print.log('kid', kid);
        const key = await client.getSigningKey(kid);
        print.log('key', key);
        const signingKey = key.getPublicKey();
        print.log('signingKey', signingKey);
        const event = jwt.verify(token, signingKey) as JwtPayload;
        print.log('event', event);
        if (event?.type === 'user.created') {
            try {
                const userData = event.data.user;
                print.log('userData', userData);
                const newUser = await service.users.createUser(userData);
                if (!newUser) {
                    throw new Error('Failed to create user');
                }
                return NextResponse.json({ message : 'User created' }, { status : 200 });
            }
            catch (error) {
                console.error(error);
                return NextResponse.json({ message : 'Failed to create user' }, { status : 400 });
            }
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            return NextResponse.json({ message : error.message }, { status : 400 });
        }
    }
    return NextResponse.json({
        status     : 200,
        statusText : 'success'
    });
}
