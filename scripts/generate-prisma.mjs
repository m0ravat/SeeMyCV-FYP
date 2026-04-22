import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.join(__dirname, '..', 'SeeMyCV');

try {
  console.log('Generating Prisma client...');
  execSync('pnpm exec prisma generate', {
    cwd: projectDir,
    stdio: 'inherit'
  });
  console.log('Prisma client generated successfully!');
} catch (error) {
  console.error('Error generating Prisma client:', error);
  process.exit(1);
}
