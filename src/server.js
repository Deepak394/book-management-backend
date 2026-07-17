const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');

async function start() {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`[server] Running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });
}

process.on('unhandledRejection', (err) => {
  console.error('[server] Unhandled rejection:', err);
  process.exit(1);
});

start();
