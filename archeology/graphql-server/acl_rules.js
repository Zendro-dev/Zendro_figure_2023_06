module.exports = {
    aclRules: [
        // model and adapter permissions
        {
            roles: 'editor',
            allows: [{
                resources: [
                    'city',
                    'country',
                    'river',
                ],
                permissions: ['create', 'update', 'delete', 'search']
            }]
        },

        {
            roles: 'reader',
            allows: [{
                resources: [
                    'city',
                    'country',
                    'river',
                ],
                permissions: ['read']
            }]
        },
    ]
}