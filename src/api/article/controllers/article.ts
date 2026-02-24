/**
 * article controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::article.article', {
    async registerPageView(ctx) {
        const { sessionId, url, params, referrer, bottom } = ctx.request.body as {
            sessionId: string | undefined,
            url: string | undefined,
            params: string | undefined,
            referrer: string | undefined,
            bottom: boolean | undefined
        };
        if (!sessionId) return;

        const knex = strapi.db.connection;
        const now = new Date().toISOString();

        let session = await knex('analytics_sessions')
            .where({ session_id: sessionId })
            .select('id')
            .first();

        const isFirstVisit = !session;

        if (isFirstVisit) {
            const [id] = await knex('analytics_sessions').insert({
                session_id: sessionId,
                created_at: now,
            });
            session = { id };
        } else {
            const existingView = await knex('analytics_page_views')
                .where({ session_id: session.id, url, params })
                .select('id', 'bottom')
                .first();

            if (existingView) {
                await knex('analytics_page_views')
                    .where({ id: existingView.id })
                    .update({
                        updated_at: now,
                        // only flip bottom to true, never back to false
                        ...(bottom && !existingView.bottom ? { bottom: 1 } : {}),
                    });
                return ctx.send('OK');
            }
        }

        await knex('analytics_page_views').insert({
            session_id: session.id,
            url,
            params,
            referrer,
            first_visit: isFirstVisit ? 1 : 0,
            bottom: bottom ? 1 : 0,
            created_at: now,
            updated_at: now,
        });

        ctx.send('OK');
    }
});
