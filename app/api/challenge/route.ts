import { NextRequest, NextResponse } from 'next/server';
import { addChallengeToDb } from "@/actions/challenge";

const apiUrl = process.env.KINDE_SITE_URL;

if (!apiUrl) {
	throw new Error('KINDE_SITE_URL is not set');
}

export async function POST(request: NextRequest) {
	try {
	const challenge = await request.json();
	const newChallenge = await addChallengeToDb(challenge);
	return NextResponse.json(newChallenge);
	} catch (error) {
		console.error('Error adding challenge to db:', error);
		return NextResponse.json({ error: 'Failed to add challenge to db' }, { status: 500 });
	}
}
