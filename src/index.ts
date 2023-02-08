import express from 'express';
import { app } from '../functions/src'
import config from '../functions/src/config';
// eslint-disable-next-line etc/no-commented-out-code
// import ngrok from 'ngrok';

app.use(express.static('hosting/public'));

app.listen(config.PORT, async () => {
  // eslint-disable-next-line etc/no-commented-out-code
  // const url = await ngrok.connect({ authtoken: config.NGROK_AUTH_TOKEN, addr: config.PORT });
  // eslint-disable-next-line no-console
  console.log(`'Oedi Moralis server' is running on port ${config.PORT}`);
});