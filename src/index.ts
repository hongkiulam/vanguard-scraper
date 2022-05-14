/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  fetch: async (
    request: Request,
    env: Record<string, string>
  ): Promise<Response> => {
    return new Response(`I'm alive`);
  },
  scheduled: async (
    event: any,
    env: Record<string, string>,
    ctx: { waitUntil: Function }
  ) => {
    ctx.waitUntil(fetch(env.API_URL));
  },
};
