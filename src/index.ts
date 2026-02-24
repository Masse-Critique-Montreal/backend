// import type { Core } from '@strapi/strapi';

import { Core } from "@strapi/strapi";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const knex = strapi.db.connection;
    
    const hasSessionsTable = await knex.schema.hasTable('analytics_sessions');
    if (!hasSessionsTable) {
      await knex.schema.createTable('analytics_sessions', (table) => {
        table.increments('id').primary();
        table.string('session_id').notNullable().unique().index();
        table.timestamp('created_at').notNullable();
      });
    }

    const hasPageViewsTable = await knex.schema.hasTable('analytics_page_views');
    if (!hasPageViewsTable) {
      await knex.schema.createTable('analytics_page_views', (table) => {
        table.increments('id').primary();
        table.integer('session_id').unsigned().notNullable()
          .references('id').inTable('analytics_sessions').onDelete('CASCADE');
        table.string('url');
        table.string('params');
        table.string('referrer');
        table.boolean('bottom').defaultTo(false);
        table.boolean('first_visit').defaultTo(false);
        table.timestamp('created_at').notNullable();
        table.timestamp('updated_at').notNullable();
      });
    }
  },
};
