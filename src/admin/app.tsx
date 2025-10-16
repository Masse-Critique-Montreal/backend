import { type StrapiApp } from '@strapi/strapi/admin';
import BuildButton from './BuildButton';

export default {
  config: {
    locales: [
      'fr', 'en'
    ],
  },
  bootstrap(app: StrapiApp) {
    console.log(app);
  },
  register(app: StrapiApp) {
    app.getPlugin('content-manager').injectComponent('editView', 'right-links', {
      name: 'PreviewButton',
      Component: BuildButton,
    });
  },
};
