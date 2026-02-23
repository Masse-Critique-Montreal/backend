export default ({ env }) => ({
  serveAdminPanel: env.bool('SERVE_ADMIN', true),
  preview: {
    enabled: true,
    config: {
      allowedOrigins: env("CLIENT_URL"),
      async handler(uid, { documentId, locale, status }) {
        const document = await strapi.documents(uid).findOne({ documentId, locale });

        switch(uid) {
          case 'api::article.article': return `${env('CLIENT_URL')}/fr/blog/${document.slug}`
          case 'api::page.page': 
          default:  
            return `${env('CLIENT_URL')}/${document.locale || locale || 'en'}/${document.slug}`
        }

      },
    }
  },
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
