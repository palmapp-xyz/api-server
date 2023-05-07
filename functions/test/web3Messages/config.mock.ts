 export const configMock = {
    ENV_NAME: 'test',
  
    MORALIS_API_KEY: 'mock-moralis-api-key',
  
    KAS_API_ACCESS_KEY_ID: 'mock-kas-api-access-key-id',
    KAS_API_SECRET_ACCESS_KEY: 'mock-kas-api-secret-access-key',
    KAS_ENDPOINT: 'mock-kas-endpoint',
  
    ELASTIC_SEARCH_PROFILE_INDEX: 'mock-elastic-search-profile-index',
    ELASTIC_SEARCH_CHANNEL_INDEX: 'mock-elastic-search-channel-index',
  
    ELASTIC_SEARCH_USERNAME: 'mock-elastic-search-username',
    ELASTIC_SEARCH_PASSWORD: 'mock-elastic-search-password',
    ELASTIC_SEARCH_CLOUD_ID: 'mock-elastic-search-cloud-id',
    ELASTIC_SEARCH_API_KEY: 'mock-elastic-search-api-key',
  
    SENDBIRD_APP_ID: 'mock-sendbird-app-id',
    SENDBIRD_API_TOKEN: 'mock-sendbird-api-token',
    SENDBIRD_API_URL: 'mock-sendbird-api-url',
  
    RPC_URL: 'https://rpc-mumbai.maticvigil.com/', // Mock Ethereum JSON-RPC provider URL
    GCLOUD_PROJECT: 'mock-gcloud-project',
  };
  process.env.GCLOUD_PROJECT = configMock.GCLOUD_PROJECT;
  // export configMock;
  
  export const isTestnet = (): boolean => (configMock.ENV_NAME === 'testnet');
  