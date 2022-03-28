import './config/module-alias';
import 'reflect-metadata';
import express from 'express';

const app = express();

app.listen(8080, () => {
  console.log('Server running on port 8080');
});
