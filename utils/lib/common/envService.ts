import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from root directory
function loadEnvFile(filePath: string) {
    dotenv.config({ path: path.resolve(__dirname, filePath) });
}

loadEnvFile('../../.env.local');
loadEnvFile('../../../web/.env.local');

export function getEnvVariable(key: string): string | null {
    return process.env[key] || null;
}
