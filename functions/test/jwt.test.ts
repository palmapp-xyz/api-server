import Axios from 'axios';
import {personalSign} from 'eth-sig-util';
import {expect} from 'chai';
import {signInWithCustomToken, getAuth, Auth} from 'firebase/auth';

// eslint-disable-next-line no-undef
describe('JWT API', () => {
  let address: string;
  let messageToSign: { result: { id: string; message: string; profileId: string; } };

  let customToken: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let JWT: string;
  let authInstance: Auth;


  // eslint-disable-next-line no-undef
  it('POST /ext-moralis-auth-requestMessage', async () => {
    address = '0x1Efd3eFd7c78d98B155F724EB6A161C50d8CFbf0';
    const networkType = 'evm';
    const chain = 0x1;
    const response = await Axios.post('https://asia-northeast3-oedi-a1953.cloudfunctions.net/ext-moralis-auth-requestMessage',
        {data: {address, networkType, chain}});
    messageToSign = response.data;

    expect(response.data.result.message).to.contains(address);
  });
  // eslint-disable-next-line no-undef
  it('POST /jwt/issue', async () => {
    const signature = personalSign(
        // eslint-disable-next-line no-buffer-constructor
        new Buffer('ea04b975612cb9d108cc75bf13510d5a529006f6aed9056808681f8e74e03779', 'hex'),
        {data: messageToSign.result.message}
    );
    // eslint-disable-next-line no-console
    console.log(messageToSign.result.message);
    // eslint-disable-next-line no-console
    console.log(signature);
    // eslint-disable-next-line no-unreachable
    const networkType = 'evm';
    const response = await Axios.post('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/jwt/issue',
        {signature, networkType, message: messageToSign.result.message}
    );

    // eslint-disable-next-line no-console
    JWT = response.data.result.idToken;
    console.log(response.data)
    // eslint-disable-next-line no-undef
    expect(response.data.result.idToken.length).to.be.gt(0);
  });
  it('should create user profile using JWT', async () => {

    // eslint-disable-next-line no-unreachable
    const response = await Axios.post('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/profile/create',
        {
          nft_image_url: 'https://example.com/image.png',
          nft_contract_addr: '0x1234567890abcdef1234567890abcdef12345678',
          nft_tokenId: '123',
          bio: 'This is users bio',
          user_name: 'nickname',
          sendbird_token: '1234567890abcdef1234567890abcdef12345678'
        },
        {
          headers: {
            'Authorization': `Bearer ${JWT}`
          }
        }
    );
    // eslint-disable-next-line no-console
    console.log(response.data);
    // eslint-disable-next-line no-undef,no-unused-expressions
    expect(response.data.message).to.contains('created')
  });
});