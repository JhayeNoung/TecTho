// jest.config.js
module.exports = {
    // Array of setup files that Jest will run before each test suite
    setupFiles: [
        'dotenv/config', // Automatically loads .env file from the root of your project
        './jest.setup.js' // Your custom setup file for any additional setup if needed
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
        // '/tests/integrations/genres.test.js',
        '/tests/integrations/movies.test.js',
        '/tests/integrations/users.test.js',
        '/tests/integrations/customers.test.js',
        '/tests/integrations/rentals.test.js',
        '/tests/integrations/returns.test.js',
        '/tests/units/middlewares/auth.test.js',
        '/tests/units/models/user.test.js',
    ],
};