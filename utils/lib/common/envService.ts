import * as dotenv from 'dotenv';
import * as path from 'path';

const BASE_PATH = path.resolve(__dirname, '../../../'); // Adjust this to your project's root

function loadEnvFile(relativePath: string) {
    const envPath = path.join(BASE_PATH, relativePath);
    dotenv.config({ path: envPath });
}

loadEnvFile('utils/.env.local'); // Root directory .env.local
loadEnvFile('web/.env.local'); // Web directory .env.local

export function getEnvVariable(key: string): string | null {
    return process.env[key] || null;
}
