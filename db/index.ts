import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { Env } from '@/env';

config({ path : '.env' });

// Initialize environment variables
Env.initialize();

export const db = drizzle({
    connection : {
        url       : Env.get('TURSO_DATABASE_URL'),
        authToken : Env.get('TURSO_AUTH_TOKEN')
    }
});
