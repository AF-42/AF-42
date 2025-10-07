import { NextResponse } from 'next/server';
import type { JwtPayload } from 'jsonwebtoken';
import { Env } from '@/env';
import * as service from '@/backend/services';
import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';

// The Kinde issuer URL should already be in your `.env` file
// from when you initially set up Kinde. This will fetch your
// public JSON web keys file
const client = jwksClient({
	jwksUri: `${Env.get('KINDE_ISSUER_URL')}/.well-known/jwks.json`,
});

export async function POST(req: Request) {
	try {
		const token = await req.text();

		const jwtDecoded = jwt.decode(token, { complete: true });
		if (!jwtDecoded) {
			return NextResponse.json({ message: 'Invalid token: error decoding token' }, { status: 400 });
		}

		const header = jwtDecoded.header;
		const kid = header.kid;
		const key = await client.getSigningKey(kid);
		const signingKey = key.getPublicKey();
		const event = jwt.verify(token, signingKey) as JwtPayload;
		if (event?.type === 'user.created') {
			try {
				const userData = event.data.user;
				const newUser = await service.users.createUser(userData);
				if (!newUser) {
					throw new Error('Failed to create user');
				}
				return NextResponse.json({ message: 'User created' }, { status: 200 });
			} catch (err) {
				console.error(err);
				return NextResponse.json({ message: 'Failed to create user' }, { status: 400 });
			}
		}
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
			return NextResponse.json({ message: err.message }, { status: 400 });
		}
	}
	return NextResponse.json({ status: 200, statusText: 'success' });
}
