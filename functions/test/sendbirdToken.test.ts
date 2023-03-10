import Axios from 'axios';
import {personalSign} from 'eth-sig-util';
import {expect} from 'chai';
import {Auth} from 'firebase/auth';
import web3 from 'web3';
// eslint-disable-next-line no-undef
describe('SendBird Token APIs', () => {
  let address: string;
  let messageToSign: { result: { id: string; message: string; profileId: string; } };

  let user1Address: string = '0x1Efd3eFd7c78d98B155F724EB6A161C50d8CFbf0'
  let user1PrivateKey: string = 'ea04b975612cb9d108cc75bf13510d5a529006f6aed9056808681f8e74e03779'
  let user2Address: string = '0xf8f4da30b3c303eA6f479f1B8a3cD67d79bA3751'
  let user2PrivateKey: string = '87a419bc854c2497b2e7f99ab849ae02a29049efb4cd4bf50e21c47a9f14fe0a'

  // write function to sign in
  async function signIn(publicAddress: string, privateKey: string): Promise<string> {
    const networkType = 'evm';
    const chain = 0x1;
    const response = await Axios.post('https://asia-northeast3-oedi-a1953.cloudfunctions.net/ext-moralis-auth-requestMessage',
        {data: {address: publicAddress, networkType, chain}});
    const messageToSign = response.data;
    const signature = personalSign(
        // eslint-disable-next-line no-buffer-constructor
        new Buffer(privateKey, 'hex'),
        {data: messageToSign.result.message}
    );
    const token = await Axios.post('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/jwt/issue',
        {signature, networkType, message: messageToSign.result.message}
    );
    return token.data.result.idToken;
  }
  it('should create sendbird user by creating profile', async () => {
    try {
      const JWT = await signIn(user2Address, user2PrivateKey);

      // eslint-disable-next-line no-unreachable
      const response = await Axios.post('https://asia-northeast3-oedi-a1953.cloudfunctions.net/dev/profile/create',
          {
            nft_image_url: 'https://example.com/image.png',
            nft_contract_addr: '0x1234567890abcdef1234567890abcdef12345678',
            nft_tokenId: '123',
            bio: 'This is users bio',
            user_name: 'nickname',
            sendbird_token: 'sendbird_token'
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
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
    }
  });
    it('should refresh sendbird token', async () => {
      try {

        const JWT = await signIn(user2Address, user2PrivateKey);
        const response = await Axios.get('https://asia-northeast3-oedi-a1953.cloudfunctions.net/dev/sendbird/token/refresh',
            {
              headers: {
                Authorization: `Bearer ${JWT}`
              }
            }
        );
        // eslint-disable-next-line no-console
        console.log(response.data);
        // eslint-disable-next-line no-undef,no-unused-expressions
        expect(response.data).to.contains('token')
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    } );
    it('should revoke all sendbird tokens', async () => {
      try {

      const JWT = await signIn(user2Address, user2PrivateKey);
        const response = await Axios.get('https://asia-northeast3-oedi-a1953.cloudfunctions.net/dev/sendbird/token/revoke',
            {
              headers: {
                Authorization: `Bearer ${JWT}`
              }
            }
        );
        // eslint-disable-next-line no-console
        console.log(response.data);
        // eslint-disable-next-line no-undef,no-unused-expressions
        expect(response.data.message).to.contains('revoked')
        } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    } );

});
