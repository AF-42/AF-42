import { z } from 'zod';

const envSchema = z.object({
	TURSO_DATABASE_URL: z.string(),
	TURSO_AUTH_TOKEN: z.string(),
	KINDE_ISSUER_URL: z.string(),
	OPENAI_API_KEY: z.string(),
});

//* Need to explicitly extract the public env variables from the process.env
//* because the env variables are not available in the frontend

const publicEnv: Record<string, string> = {
	TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL as string,
	TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN as string,
	KINDE_ISSUER_URL: process.env.KINDE_ISSUER_URL as string,
};

export type EnvType = z.infer<typeof envSchema>;

export class Env {
	static initialize() {
		const checkEnv = envSchema.safeParse(process.env);
		if (!checkEnv.success) {
			console.error('❌ Invalid environment variables:');
			for (const error of checkEnv.error.issues) {
				console.error(`Missing environment variable: ${error.path[0]}`);
			}
			throw new Error('Invalid environment variables. Check the logs above for details.');
		}
	}

	static get(key: keyof EnvType): string {
		if (key.startsWith('NEXT_PUBLIC_')) {
			return publicEnv[key];
		}
		return process.env[key] as string;
	}
}
