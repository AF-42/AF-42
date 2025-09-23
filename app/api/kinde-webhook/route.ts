import { NextResponse } from 'next/server';
import type { JwtPayload } from 'jsonwebtoken';
import { usersTable } from '@/db/schema';
import { db } from '@/db';
import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';

// The Kinde issuer URL should already be in your `.env` file
// from when you initially set up Kinde. This will fetch your
// public JSON web keys file
const client = jwksClient({
	jwksUri: `${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`,
});

export async function POST(req: Request) {
	try {
		// Get the token from the request
		const token = await req.text();
		console.log('[token]', token);

		// Decode the token
		const jwtDecoded = jwt.decode(token, { complete: true });
		console.log('[jwtDecoded]', jwtDecoded);

		// Verify the token
		if (!jwtDecoded) {
			return NextResponse.json({ message: 'Invalid token: error decoding token' }, { status: 400 });
		}

		const header = jwtDecoded.header;
		console.log('[header]', header);

		const kid = header.kid;
		console.log('[kid]', kid);

		const key = await client.getSigningKey(kid);
		console.log('[key]', key);

		const signingKey = key.getPublicKey();
		console.log('[signingKey]', signingKey);

		const event = jwt.verify(token, signingKey) as JwtPayload;
		console.log('[event]', event);

		// ! todo: create crud functions in a different file and import them here
		switch (event?.type) {
			case 'user.updated':
				break;
			case 'user.created':
				try {
					const user = event.data.user;
					if (!user) {
						return NextResponse.json({ message: 'Invalid user data' }, { status: 400 });
					}
					const database = await db;
					console.log('[database] ', database);
					const newUser = await database.insert(usersTable).values({
						kinde_id: user.id,
						email: user.email,
						first_name: user.first_name,
						last_name: user.last_name,
						username: user.username,
						organizations: user.organizations,
						phone: user.phone,
						is_password_reset_requested: user.is_password_reset_requested,
						is_suspended: user.is_suspended,
						role: 'jedi', // ! Default role - users can update this later in the app
						created_at: new Date(),
						updated_at: new Date(),
					});
					if (!newUser) {
						return NextResponse.json({ message: 'Failed to create user' }, { status: 400 });
					}
					return NextResponse.json({ message: 'User created' }, { status: 200 });
				} catch (err) {
					console.error(err);
				}
				break;
			case 'user.deleted':
				break;
			default:
				break;
		}
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
			return NextResponse.json({ message: err.message }, { status: 400 });
		}
	}
	return NextResponse.json({ status: 200, statusText: 'success' });
}
