
import { exec } from 'node:child_process';

export default (plugin: any) => {
  // Add a custom route to the admin API
  plugin.routes['admin'].routes.push({
    method: 'GET',
    path: '/sitebuild', // Use a dedicated admin path
    handler: async (ctx: any) => {
      console.log(ctx.state.user);
      console.log(ctx.state);
  
      const sitePath = '../site';
      const nodePath = process.env.API_HOST.includes(`https`) ? 
        '/root/.nvm/versions/node/v22.20.0/bin/node' : 
        '/home/vlev/.nvm/versions/node/v20.17.0/bin/node';
  
      const result = await new Promise<string>((resolve) => {
        exec(
          `cd ${sitePath} && rm -fr .next && ${nodePath} ./node_modules/.bin/next build`,
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
    config: {
      // This policy ensures only authenticated admin users can access the route
      policies: ['admin::isAuthenticatedAdmin'],
    },
  });

  return plugin;
};