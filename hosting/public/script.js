/* global document, window, axios*/
const ENDPOINT = process.env.NODE_ENV === 'development'
  ? 'http://localhost:4000'
  : 'https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1'

const STREAM_API_URL = `${ENDPOINT}/stream`;
const HOOK_API_URL = `${ENDPOINT}/hooks`;

const elError = document.getElementById('error');
const elResult = document.getElementById('result');

const elBtnAdd = document.getElementById('add-stream');
const elBtnUpdate = document.getElementById('update-stream');
const elBtnGet = document.getElementById('get-stream');
const elBtnDelete = document.getElementById('delete-stream');

const elBtnAddAddress = document.getElementById('add-address-to-stream');
const elBtnRemoveAddress = document.getElementById('remove-address-from-stream');
const elBtnListAddresses = document.getElementById('list-addresses-of-stream');

const EVM_PROXY_URL = `${ENDPOINT}/api/evm-api-proxy`;

const elBtnEvmWeights = document.getElementById('evm-endpoint-weights');
const elBtnEvmVersion = document.getElementById('evm-version');
const elBtnEvmNativeBalance = document.getElementById('evm-native-balance');
const elBtnEvmNFTsOfOwner = document.getElementById('evm-nfts-of-owner');
const elBtnEvmNFTCollectionsOfOwner = document.getElementById('evm-nft-collections-of-owner');
const elBtnEvmERC20sOfOwner = document.getElementById('evm-erc20s-of-owner');
const elBtnEvmNftTransfersOfWallet = document.getElementById('evm-nft-transfers-of-wallet');
const elBtnEvmNftOwner = document.getElementById('evm-nft-owner');
const elBtnEvmNftMetadata = document.getElementById('evm-nft-metadata');

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

const addAddressToStream = async (id, address) => {
  const result = await handleApiRequest('post', `${id}/add`, { address });
  renderResult(result);
};
const removeAddressFromStream = async (id, address) => {
  const result = await handleApiRequest('post', `${id}/remove`, { address });
  renderResult(result);
};
const listAddressesOfStream = async (id) => {
  const result = await handleApiRequest('get', `${id}/list`);
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
const web3apiVersion = async () => {
  await handleEvmProxyCall('web3/version');
};

const endpointWeights = async () => {
  await handleEvmProxyCall('info/endpointWeights');
};

const getEvmNativeBalance = async (address, chain) => {
  await handleEvmProxyCall(`${address}/balance?chain=${chain}`);
};

const getEvmNFTsOfOwner = async (address, chain, limit, cursor) => {
  await handleEvmProxyCall(`${address}/nft?chain=${chain}&limit=${limit}&cursor=${cursor}`);
};

const getEvmNFTCollectionsOfOwner = async (address, chain, limit, cursor) => {
  await handleEvmProxyCall(`${address}/nft/collections?chain=${chain}&limit=${limit}&cursor=${cursor}`);
};

const getEvmERC20sOfOwner = async (address, chain, limit, cursor) => {
  await handleEvmProxyCall(`${address}/erc20?chain=${chain}&limit=${limit}&cursor=${cursor}`);
};

const getEvmNftTransfersOfWallet = async (address, chain, limit, cursor) => {
  await handleEvmProxyCall(`${address}/nft/transfers?chain=${chain}&limit=${limit}&cursor=${cursor}`);
};

const getEvmNftOwner = async (tokenAddress, tokenId, chain) => {
  await handleEvmProxyCall(`nft/${tokenAddress}/${tokenId}/owners?chain=${chain}`);
};

const getEvmNftMetadata = async (tokenAddress, tokenId, chain) => {
  await handleEvmProxyCall(`nft/${tokenAddress}/${tokenId}/?chain=${chain}`);
};

const renderResult = async (result) => {
  elResult.innerHTML = result ? JSON.stringify(result, null, 2) : '';
};

const renderError = async (error) => {
  elError.innerHTML = error.config?.url ? (`${error.config.url}: `) : '';
  elError.innerHTML += error ? JSON.stringify(error.response.data.data.message, null, 2) : '';
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

  elBtnAddAddress.addEventListener('click', async () => {
    const id = document.getElementById('id').value;
    const address = document.getElementById('account-address').value;
    addAddressToStream(id, address).catch((error) => renderError(error));
  });
  elBtnRemoveAddress.addEventListener('click', async () => {
    const id = document.getElementById('id').value;
    const address = document.getElementById('account-address').value;
    removeAddressFromStream(id, address).catch((error) => renderError(error));
  });
  elBtnListAddresses.addEventListener('click', async () => {
    const id = document.getElementById('id').value;
    listAddressesOfStream(id).catch((error) => renderError(error));
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
  elBtnEvmERC20sOfOwner.addEventListener('click', async () => {
    const address = document.getElementById('address').value;
    const chain = document.getElementById('chain').value || '0x1';
    const limit = document.getElementById('limit').value || 10;
    const cursor = document.getElementById('cursor').value;
    getEvmERC20sOfOwner(address, chain, limit, cursor).catch((error) => renderError(error));
  });
  elBtnEvmNFTsOfOwner.addEventListener('click', async () => {
    const address = document.getElementById('address').value;
    const chain = document.getElementById('chain').value || '0x1';
    const limit = document.getElementById('limit').value || 10;
    const cursor = document.getElementById('cursor').value;
    getEvmNFTsOfOwner(address, chain, limit, cursor).catch((error) => renderError(error));
  });
  elBtnEvmNFTCollectionsOfOwner.addEventListener('click', async () => {
    const address = document.getElementById('address').value;
    const chain = document.getElementById('chain').value || '0x1';
    const limit = document.getElementById('limit').value || 10;
    const cursor = document.getElementById('cursor').value;
    getEvmNFTCollectionsOfOwner(address, chain, limit, cursor).catch((error) => renderError(error));
  });
  elBtnEvmNftTransfersOfWallet.addEventListener('click', async () => {
    const address = document.getElementById('address').value;
    const chain = document.getElementById('chain').value || '0x1';
    const limit = document.getElementById('limit').value || 10;
    const cursor = document.getElementById('cursor').value;
    getEvmNftTransfersOfWallet(address, chain, limit, cursor).catch((error) => renderError(error));
  });
  elBtnEvmNftOwner.addEventListener('click', async () => {
    const tokenAddress = document.getElementById('token-address').value;
    const chain = document.getElementById('chain').value || '0x1';
    const tokenId = document.getElementById('token-id').value;
    getEvmNftOwner(tokenAddress, tokenId, chain).catch((error) => renderError(error));
  });
  elBtnEvmNftMetadata.addEventListener('click', async () => {
    const tokenAddress = document.getElementById('token-address').value;
    const chain = document.getElementById('chain').value || '0x1';
    const tokenId = document.getElementById('token-id').value;
    getEvmNftMetadata(tokenAddress, tokenId, chain).catch((error) => renderError(error));
  });
}

window.addEventListener('load', () => {
  init();
  getEvents();
});

