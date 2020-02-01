// lib/app.ts
import * as express from 'express';
import * as path from 'path';

// Create a new express application instance
const app: express.Application = express();

app.use('/', express.static('dist'));
app.listen(process.env.PORT || 3000, function () {
    console.log('Server running at', process.env.PORT || 3000);
});