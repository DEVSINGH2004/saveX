import app from './src/app.js';
import {checkConnection} from './src/config/supabase.database.js';
const port = process.env.PORT || 4000;



async function startServer() {
  await checkConnection();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer();
