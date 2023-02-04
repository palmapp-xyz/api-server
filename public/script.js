/* global document, window, axios*/
const STREAM_API_URL = 'http://localhost:3000/stream';
const HOOK_API_URL = 'http://localhost:3000/hooks';

const elError = document.getElementById('error');
const elResult = document.getElementById('result');
const elBtnAdd = document.getElementById('add-stream');
const elBtnUpdate = document.getElementById('update-stream');
const elBtnGet = document.getElementById('get-stream');
const elBtnDelete = document.getElementById('delete-stream');

const EVM_PROXY_URL = 'http://localhost:3000/api/evm-api-proxy';

const elBtnEvmWeights = document.getElementById('evm-endpoint-weights');
const elBtnEvmVersion = document.getElementById('evm-version');
const elBtnEvmNativeBalance = document.getElementById('evm-native-balance');
const elBtnEvmNFTsOfOwner = document.getElementById('evm-nfts-of-owner');

// Stream

const handleApiRequest = async (method, endpoint, data, params) => {
  const result = await axios({
    url: `${STREAM_API_URL}/${endpoint}`,
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    params,
  });

  return result.data;
};

const handleEventsRequest = async (method, endpoint, data, params) => {
  const result = await axios({
    url: `${HOOK_API_URL}/${endpoint}`,
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    params,
  });

  return result.data;
};

const addStream = async (webhookUrl) => {
  const result = await handleApiRequest('post', 'create', { webhookUrl });
  renderResult(result);
};
const updateStream = async (webhookUrl, id) => {
  const result = await handleApiRequest('patch', `update/${id}`, { webhookUrl });
  renderResult(result);
};
const getStreams = async () => {
  const result = await handleApiRequest('get', 'getAll');
  renderResult(result);
};
const deleteStreams = async (id) => {
  const result = await handleApiRequest('delete', `delete/${id}`);
  renderResult(result);
};

const getEvents = async () => {
  setInterval(async () => {
    const result = await handleEventsRequest('get', `get`);
    document.getElementById('events').innerHTML = JSON.stringify(result, undefined, 4);
  }, 5000);
};

// API

const handleEvmProxyCall = async (endpoint, params) => {
  const result = await axios.get(`${EVM_PROXY_URL}/${endpoint}`, params, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  renderResult(result.data);
};

// evm api proxy calls
const web3apiVersion = () => {
  handleEvmProxyCall('web3/version');
};

const endpointWeights = () => {
  handleEvmProxyCall('info/endpointWeights');
};

const getEvmNativeBalance = (address, chain) => {
  handleEvmProxyCall(`${address}/balance?chain=${chain}`);
};

const getEvmNFTsOfOwner = (address, chain, limit, cursor) => {
  handleEvmProxyCall(`${address}/nft?chain=${chain}&limit=${limit}&cursor=${cursor}`);
};

const renderResult = async (result) => {
  elResult.innerHTML = result ? JSON.stringify(result, null, 2) : '';
};

const renderError = async (error) => {
  elError.innerHTML = error ? JSON.stringify(error.message, null, 2) : '';
};

function init() {
  elBtnAdd.addEventListener('click', async () => {
    const url = document.getElementById('url').value;
    addStream(url).catch((error) => renderError(error));
  });
  elBtnUpdate.addEventListener('click', async () => {
    const url = document.getElementById('url').value;
    const id = document.getElementById('id').value;
    updateStream(url, id).catch((error) => renderError(error));
  });
  elBtnGet.addEventListener('click', async () => {
    getStreams().catch((error) => renderError(error));
  });
  elBtnDelete.addEventListener('click', async () => {
    const id = document.getElementById('id').value;
    deleteStreams(id).catch((error) => renderError(error));
  });

  elBtnEvmWeights.addEventListener('click', async () => {
    endpointWeights().catch((error) => renderError(error));
  });

  elBtnEvmVersion.addEventListener('click', async () => {
    web3apiVersion().catch((error) => renderError(error));
  });

  elBtnEvmNativeBalance.addEventListener('click', async () => {
    const address = document.getElementById('address').value;
    const chain = document.getElementById('chain').value || '0x1';
    getEvmNativeBalance(address, chain).catch((error) => renderError(error));
  });
  elBtnEvmNFTsOfOwner.addEventListener('click', async () => {
    const address = document.getElementById('address').value;
    const chain = document.getElementById('chain').value || '0x1';
    const limit = document.getElementById('limit').value || 10;
    const cursor = document.getElementById('cursor').value;
    getEvmNFTsOfOwner(address, chain, limit, cursor).catch((error) => renderError(error));
  });
}

window.addEventListener('load', () => {
  init();
  getEvents();
});

