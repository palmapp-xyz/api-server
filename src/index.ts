import express from 'express';
import { app } from '../functions/src'

app.use(express.static('hosting/public'));

app.listen(4000, async () => {
  // eslint-disable-next-line no-console
  console.log(`'Oedi Moralis server' is running on port 4000`);
});