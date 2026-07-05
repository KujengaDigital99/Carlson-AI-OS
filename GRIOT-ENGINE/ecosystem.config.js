module.exports = {
  apps: [
    {
      name: 'griot',
      script: 'index.js',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production',
      },
      error_file: 'logs/griot-error.log',
      out_file: 'logs/griot-out.log',
      time: true,
    },
  ],
};
