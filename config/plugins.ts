export default () => ({
    // enable a custom plugin
    'analytics': {
        // my-plugin is going to be the internal name used for this plugin
        enabled: true,
        resolve: './src/plugins/analytics',
        config: {
            // user plugin config goes here
        },
    },
    'upload': {
        config: {
            config: {
                providerOptions: {
                    localServer: {
                        maxage: 300000
                    },
                },
                sizeLimit: 250 * 1024 * 1024, // 256mb in bytes
                breakpoints: {
                    xlarge: 1920,
                    large: 1000,
                    medium: 750,
                    small: 500,
                    xsmall: 64
                },
                security: {
                    allowedTypes: ['image/*', 'application/*'],
                    deniedTypes: ['application/x-sh', 'application/x-dosexec']
                },
            },
        }
    }
});
