import Axios from 'axios';
import {personalSign} from 'eth-sig-util';
import {expect} from 'chai';
import {initializeApp} from 'firebase/app';
import {signInWithCustomToken, getAuth, Auth} from 'firebase/auth';
import {describe} from 'mocha'

// eslint-disable-next-line no-undef
describe('API Testing', () => {
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
  it('POST /ext-moralis-auth-issueToken', async () => {
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
    const response = await Axios.post('https://asia-northeast3-oedi-a1953.cloudfunctions.net/ext-moralis-auth-issueToken',
        {data: {signature, networkType, message: messageToSign.result.message}}
    );

    // eslint-disable-next-line no-console
    customToken = response.data.result.token;
    console.log(response.data)
    // eslint-disable-next-line no-undef
    expect(response.data.result.token.length).to.be.gt(0);
  });
  // eslint-disable-next-line no-undef
  describe('App', () => {
    // eslint-disable-next-line no-undef
    it('should sign-in user on app', async () => {
      const firebaseConfig = {
        apiKey: 'AIzaSyARxuVV-AJdLNj2kz_4yArs-CWEvML4u2o',
        authDomain: 'oedi-a1953.firebaseapp.com',
        projectId: 'oedi-a1953',
        storageBucket: 'oedi-a1953.appspot.com',
        messagingSenderId: '219711213585',
        appId: '1:219711213585:web:6b625686c7f514699121b0',
      };
      const app = initializeApp(firebaseConfig);
      // sign in with custom token
      authInstance = getAuth(app);
      const userCredential = await signInWithCustomToken(authInstance, customToken);

      userCredential.user.getIdToken().then((idToken: string) => {
        JWT = idToken;
      });
      expect(userCredential.user.displayName).to.be.eq(address);
    });
  });
    // eslint-disable-next-line no-undef
    describe('Profile APIs', () => {
      // eslint-disable-next-line no-undef
      it('should create user profile', async () => {

        // eslint-disable-next-line no-unreachable
        const response = await Axios.post('https://asia-northeast1-oedi-a1953.cloudfunctions.net/v1/profile/create',
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
      it('should fetch user profile', async () => {

        const id = '0x1Efd3eFd7c78d98B155F724EB6A161C50d8CFbf0'
        // eslint-disable-next-line no-unreachable
        const response = await Axios.get('https://asia-northeast1-oedi-a1953.cloudfunctions.net/v1/profile/get/'+id);
        // eslint-disable-next-line no-console
        console.log(response.data);
        // eslint-disable-next-line no-undef,no-unused-expressions
        expect(response.data.result.nft_tokenId).to.eq('123')
      });
      it('should update user profile', async () => {

        // eslint-disable-next-line no-unreachable
        const response = await Axios.put('https://asia-northeast1-oedi-a1953.cloudfunctions.net/v1/profile/update',
            {
              nft_tokenId: '200'
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
        expect(response.data.message).to.contains('updated')
      });

      it('should fetch user\'s sendbird_token', async () => {

        const id = '0x1Efd3eFd7c78d98B155F724EB6A161C50d8CFbf0'
        // eslint-disable-next-line no-unreachable
        const response = await Axios.get('https://asia-northeast1-oedi-a1953.cloudfunctions.net/v1/profile/sendbird_token',
            {
              headers: {
                'Authorization': `Bearer ${JWT}`
              }
            }
        );
        // eslint-disable-next-line no-console
        console.log(response.data);
        // eslint-disable-next-line no-undef,no-unused-expressions
        expect(response.data.result.sendbird_token).to.eq('1234567890abcdef1234567890abcdef12345678')
      });
      it('should delete user profile', async () => {

        // eslint-disable-next-line no-unreachable
        const response = await Axios.delete('https://asia-northeast1-oedi-a1953.cloudfunctions.net/v1/profile/delete',
            {
              headers: {
                'Authorization': `Bearer ${JWT}`
              }
            }
        );
        // eslint-disable-next-line no-console
        console.log(response.data);
        // eslint-disable-next-line no-undef,no-unused-expressions
        expect(response.data.message).to.contains('deleted')
      });
  });
});
