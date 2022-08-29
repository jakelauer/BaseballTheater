module.exports = options => ({
    ...options,
    navigateFallbackBlacklist: [
        // Exclude URLs starting with /_, as they're likely an API call
        new RegExp('^/_'),
        // Exclude URLs starting with /_, as they're likely an API call
        new RegExp('^/auth', "i"),
        // Exclude URLs starting with /_, as they're likely an API call
        new RegExp('^/api', "i"),
        // Exclude URLs containing a dot, as they're likely a resource in
        // public/ and not a SPA route
        new RegExp('/[^/]+\\.[^/]+$'),
    ],
})