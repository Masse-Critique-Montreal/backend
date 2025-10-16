/**
 * src/api/home/controllers/home.ts
 */
import { factories } from '@strapi/strapi';
import { exec } from 'node:child_process';
import path from 'path';

export default factories.createCoreController('api::home.home', ({ }) => ({
  async buildSite(ctx) {
    const sitePath = '../site';
    const nodePath = '/home/vlev/.nvm/versions/node/v20.17.0/bin/node';

    const result = await new Promise<string>((resolve) => {
      exec(
        `cd ${sitePath} && ${nodePath} ./node_modules/.bin/next build`,
        { cwd: sitePath, env: { ...process.env, NODE_ENV: 'production', HOST:process.env.API_HOST } },
        (error, stdout, stderr) => {
          if (error) {
            resolve(`[error] ${stderr || error.message}`);
          } else {
            resolve(stdout || stderr || '[done] Build finished');
          }
        }
      );
    });

    return { data: result };
  },
}));
