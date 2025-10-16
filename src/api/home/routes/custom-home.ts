
export default {
    type: 'admin',
    routes: [
        {
            method: 'GET', // Or POST, depending on your preference
            path: '/home/build', // Define your custom path
            handler: 'home.buildSite', // Map to the controller method
            config: {
                policies: [], // Add policies if needed for authentication/authorization
                auth:false
            },
        },
    ]
}