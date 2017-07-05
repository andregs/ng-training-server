import * as express from 'express';
import { json } from 'body-parser';
import { userEndpoints } from './api/user.endpoints';
import { authEndpoints } from './api/auth.endpoints';

const app = express();

app.use(json());

userEndpoints(app);
authEndpoints(app);

const port = 3000;
const server = app.listen(port, () => {
  const host = server.address().address;
  console.log(`Server listening at ${host}:${port}`);
});
