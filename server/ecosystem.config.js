module.exports = {
  apps: [
    {
      name: "myapp",
      script: "./server.js",
      instances: 1,
      exec_mode: "cluster",
      autorestart: false,
      watch: false,
    },
  ],
};
