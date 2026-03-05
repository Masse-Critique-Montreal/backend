import type { Core } from "@strapi/strapi";
console.log('Loaded analytics controller');

type Knex = typeof strapi.db.connection;
type QueryBuilder = ReturnType<Knex['queryBuilder']>;

async function getChartData(
  knex: Knex,
  table: string,
  options?: {
    dateColumn?: string;
    countColumn?: string;
    where?: Record<string, unknown> | ((builder: QueryBuilder) => void);
    dateFormat?: string;
  }
) {
  const {
    dateColumn = 'created_at',
    countColumn = 'id',
    where,
    dateFormat = 'DATE',
  } = options ?? {};

  let query = knex(table)
    .select(knex.raw(`${dateFormat}(${dateColumn}) as day`))
    .count(`${countColumn} as count`)
    .groupBy('day')
    .orderBy('day', 'asc');

    if (where) {
      for (const [key, value] of Object.entries(where)) {
        if (typeof value === 'boolean') {
          query.where(key, value ? 1 : 0);
        } else {
          query.where(key, value as any);
        }
      }
    }

  return query;
}

export async function getRealTimeData(
  connection: Knex,
  table: string
): Promise<{ minute: number; views: number }[]> {
  const now = new Date();
  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

  const rows = await connection(table)
    .select(
      connection.raw(`
        CAST((strftime('%s', 'now') - strftime('%s', created_at)) / 60 AS INTEGER) as minute,
        COUNT(*) as views
      `)
    )
    .where('created_at', '>=', thirtyMinutesAgo.toISOString())
    .groupByRaw(`CAST((strftime('%s', 'now') - strftime('%s', created_at)) / 60 AS INTEGER)`)
    .orderBy('minute', 'asc');

  const filled: { minute: number; views: number }[] = [];
  for (let i = 0; i <= 29; i++) {
    const match = rows.find((r) => Number(r.minute) === i);
    filled.push({ minute: i, views: match ? Number(match.views) : 0 });
  }
  console.log(filled);
  return filled;
}

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin("analytics")
      // the name of the service file & the method.
      .service("service")
      .getWelcomeMessage();
  },
  async getSessionsChart(ctx) {
    const knex = strapi.db.connection;
    const table = 'analytics_sessions';
  
    // This SQL groups by the date part of 'created_at' and counts IDs
    // Note: 'date' function syntax varies slightly by DB (SQLite vs Postgres/MySQL)
    const data = await knex(table)
      .select(knex.raw("DATE(created_at) as day"))
      .count('id as count')
      .groupBy('day')
      .orderBy('day', 'asc');

    ctx.send({ data });
  },
  async getRealtimeChart(ctx) {
    const data = await getRealTimeData(strapi.db.connection, 'analytics_page_views');
    ctx.send({ data });
  },
  async getPageViewChart(ctx) {
    const filters = ctx.query.where as Record<string, string> | undefined;

    console.log('raw query:', ctx.query);
    console.log('filters:', ctx.query.filters);
    const where = filters
      ? Object.fromEntries(
          Object.entries(filters).map(([key, value]) => {
            if (value === 'true') return [key, true];
            if (value === 'false') return [key, false];
            if (!isNaN(Number(value))) return [key, Number(value)];
            return [key, value];
          })
        )
      : undefined;
  
    const data = await getChartData(strapi.db.connection, 'analytics_page_views', { where });
  
    ctx.send({ data });
  },
  async getReferrerChart(ctx) {
    const knex = strapi.db.connection;
    const table = 'analytics_page_views';
  
    try {
      const data = await knex(table)
        // Use coalesce to label empty/null referrers as "Direct"
        .select(knex.raw("COALESCE(referrer, 'Direct') as referrer"))
        .count('id as count')
        .groupBy('referrer')
        .orderBy('count', 'desc')
        .limit(10); // Show top 10 sources
  
      ctx.send({ data });
    } catch (err) {
      strapi.log.error('Failed to fetch referrer chart data', err);
      ctx.throw(500, err);
    }
  },
  async getPageViewsBarChart(ctx) {
    const knex = strapi.db.connection;
    const table = 'analytics_page_views';
  
    try {
      const data = await knex(table)
        .select('url')
        .count('id as views')
        .groupBy('url')
        .orderBy('views', 'desc')
        .limit(200); // Top 10 pages to keep the bar chart clean
  
      ctx.send({ data });
    } catch (err) {
      strapi.log.error('Failed to fetch page views chart data', err);
      ctx.throw(500, err);
    }
  },
  async getSessions(ctx) {

    const knex = strapi.db.connection;
    const table = 'analytics_sessions'; // Double check this name in your DB manager!
    const {
      session_id,
      date_from,
      date_to,
      page = 1,
      page_size = 200,
      sort = 'created_at',
      order = 'desc',
    } = ctx.query;


    // Build the base query inside a function or variable to prevent cross-contamination
    const buildBaseQuery = () => {
      const q = knex(table);
      if (session_id) q.where('session_id', 'like', `%${session_id}%`);
      if (date_from) q.where('created_at', '>=', new Date(date_from).toISOString());
      if (date_to) q.where('created_at', '<=', new Date(date_to).toISOString());
      return q;
    };

    // 1. Get Count
    const countResult = await buildBaseQuery().count('id as count').first();
    const total = parseInt((countResult?.count || '0') as string);

    // 2. Get Data
    const limit = Math.min(Math.max(parseInt(page_size) || 25, 1), 100);
    const offset = (Math.max(parseInt(page) || 1, 1) - 1) * limit;
    console.log(limit, offset)
    const data = await buildBaseQuery()
      .orderBy(sort, order)
      .limit(limit)
      .offset(offset);
      console.log(data);
    
    ctx.send({
      data,
      meta: {
        total,
        page: parseInt(page),
        page_size: limit,
        page_count: Math.ceil(total / limit),
      },
    });
  },
  async getPageViews(ctx) {
    const knex = strapi.db.connection;

    const {
      session_id,     // numeric FK or session_id string
      url,
      referrer,
      params,
      bottom,
      first_visit,
      date_from,
      date_to,
      page = 1,
      page_size = 50,
      sort = 'created_at',
      order = 'desc',
      with_session = false,  // join session data
    } = ctx.query;

    const ALLOWED_SORT = ['id', 'url', 'referrer', 'params', 'created_at', 'updated_at'];
    const ALLOWED_ORDER = ['asc', 'desc'];

    const sortCol = ALLOWED_SORT.includes(sort) ? sort : 'created_at';
    const orderDir = ALLOWED_ORDER.includes(order) ? order : 'desc';
    const limit = Math.min(Math.max(parseInt(page_size) || 25, 1), 100);
    const offset = (Math.max(parseInt(page) || 1, 1) - 1) * limit;

    const query = knex('analytics_page_views as pv');

    if (with_session === 'true' || with_session === true) {
      query
        .leftJoin('analytics_sessions as s', 'pv.session_id', 's.id')
        .select(
          'pv.*',
          's.session_id as session_uuid',
          's.created_at as session_created_at'
        );
    } else {
      query.select('pv.*');
    }

    // Numeric FK
    if (session_id && !isNaN(session_id)) {
      query.where('pv.session_id', parseInt(session_id));
    }

    if (url) {
      query.where('pv.url', 'like', `%${url}%`);
    }
    if (referrer) {
      query.where('pv.referrer', 'like', `%${referrer}%`);
    }

    if (referrer) {
      query.where('pv.params', 'like', `%${params}%`);
    }
    if (bottom !== undefined && bottom !== '') {
      query.where('pv.bottom', bottom === 'true' || bottom === true ? 1 : 0);
    }
    if (first_visit !== undefined && first_visit !== '') {
      query.where('pv.first_visit', first_visit === 'true' || first_visit === true ? 1 : 0);
    }
    if (date_from) {
      query.where('pv.created_at', '>=', new Date(date_from));
    }
    if (date_to) {
      query.where('pv.created_at', '<=', new Date(date_to));
    }

    let [{ count }] = await query.clone().clearSelect().count('pv.id as count') as { count: string }[];
    const data = await query
      .orderBy(`pv.${sortCol}`, orderDir)
      .limit(limit)
      .offset(offset);

    if (!count) count = '0';

    ctx.send({
      data,
      meta: {
        total: parseInt(count),
        page: parseInt(page),
        page_size: limit,
        page_count: Math.ceil(parseInt(count) / limit),
      },
    });
  },
});

export default controller;