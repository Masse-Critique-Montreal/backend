export default {
    routes: [
        {
            method: 'POST',
            path: '/t',
            handler: 'article.registerPageView', // or 'plugin::plugin-name.controllerName.functionName' for a plugin-specific controller
            config: {
                auth: false,
            },
        },
    ]
}