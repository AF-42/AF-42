import { NextResponse } from 'next/server.js';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { usersTable } from '../db/schema.js';
import { db } from '../db/index.js';
import jwksClient from 'jwks-rsa';
import { Env } from '../env.js';

async function getAuthToken() {
	try {
		const response = await fetch(`${process.env.KINDE_ISSUER_URL}/oauth2/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: 'application/json',
			},
			body: new URLSearchParams({
				client_id: process.env.KINDE_M2M_CLIENT_ID as string,
				client_secret: process.env.KINDE_M2M_CLIENT_SECRET as string,
				grant_type: 'client_credentials',
				audience: `${process.env.KINDE_ISSUER_URL as string}/api`,
			}),
		});

		if (!response.ok) {
			throw new Error(`Failed to get auth token: ${response.statusText}`);
		}

		const data = await response.json();
		return data.access_token;
	} catch (error) {
		console.error('Error getting auth token:', error);
		throw error;
	}
}

async function addLogoutUrlToKinde(token: string) {
	try {
		const response = await fetch(
			`${process.env.KINDE_ISSUER_URL as string}/api/v1/applications/${process.env.KINDE_CLIENT_ID as string}/auth_logout_urls`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					urls: [`https://${process.env.VERCEL_URL as string}`],
				}),
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to add logout URL to Kinde: ${response.statusText}`);
		}

		const responseData = await response.json();
		console.log(`SUCCESS: Logout URL added to Kinde: ${process.env.VERCEL_URL as string}`, responseData);
	} catch (error) {
		console.error('Failed to add logout URL to Kinde', error);
		throw error;
	}
}

async function addCallbackUrlToKinde(token: string) {
	try {
		const response = await fetch(
			`${process.env.KINDE_ISSUER_URL as string}/api/v1/applications/${process.env.KINDE_CLIENT_ID as string}/auth_redirect_urls`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					urls: [`https://${process.env.VERCEL_URL as string}/api/auth/kinde_callback`],
				}),
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to add callback URL to Kinde: ${response.statusText}`);
		}

		const responseData = await response.json();
		console.log(
			`SUCCESS: Callback URL added to Kinde: ${process.env.VERCEL_URL as string}/api/auth/kinde_callback`,
			responseData,
		);
	} catch (error) {
		console.error('Failed to add callback URL to Kinde', error);
		throw error;
	}
}

(async () => {
	if (process.env.VERCEL as string == '1') {
		try {
			const authToken = await getAuthToken();
			await addCallbackUrlToKinde(authToken);
			await addLogoutUrlToKinde(authToken);
		} catch (error) {
			console.error('Script failed:', error);
		}
	}
})();

// The Kinde issuer URL should already be in your `.env` file
// from when you initially set up Kinde. This will fetch your
// public JSON web keys file
const client = jwksClient({
	jwksUri: `${Env.get('KINDE_ISSUER_URL')}/.well-known/jwks.json`,
});

export async function POST(req: Request) {
	try {
		// Get the token from the request
		const token = await req.text();

		// Decode the token
		const jwtDecoded = jwt.decode(token, { complete: true });

		// Verify the token
		if (!jwtDecoded) {
			return NextResponse.json({ message: 'Invalid token: error decoding token' }, { status: 400 });
		}

		const header = jwtDecoded.header;
		const kid = header.kid;
		const key = await client.getSigningKey(kid);
		const signingKey = key.getPublicKey();
		const event = jwt.verify(token, signingKey) as JwtPayload;

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
