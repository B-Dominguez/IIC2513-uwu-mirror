const config = {
  default: {
    username: process.env.DB_USERNAME || 'adminuwu',
    password: process.env.DB_PASSWORD || 'uwupass',
    dialect: process.env.DB_DIALECT || 'postgres',
    database: process.env.DB_NAME || 'guwu',
    host: process.env.DB_HOST || '127.0.0.1',
  },
  development: {
    extend: 'default',
    database: process.env.DB_NAME || 'guwu_dev',
  },
  test: {
    extend: 'default',
    database: 'guwu_test',
  },
  production: {
    extend: 'default',
    use_env_variable: 'DATABASE_URL',
  },
};

Object.keys(config).forEach((configKey) => {
  const configValue = config[configKey];
  if (configValue.extend) {
    config[configKey] = { ...config[configValue.extend], ...configValue };
  }
});

module.exports = config;
