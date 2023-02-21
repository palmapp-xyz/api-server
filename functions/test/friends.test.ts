import Axios from 'axios';
import {personalSign} from 'eth-sig-util';
import {expect} from 'chai';
import {Auth} from 'firebase/auth';
import web3 from 'web3';
// eslint-disable-next-line no-undef
describe('Friend APIs', () => {
  let address: string;
  let messageToSign: { result: { id: string; message: string; profileId: string; } };

  let user1Address: string = '0x1Efd3eFd7c78d98B155F724EB6A161C50d8CFbf0'
  let user1PrivateKey: string = 'ea04b975612cb9d108cc75bf13510d5a529006f6aed9056808681f8e74e03779'
  let user2Address: string = '0xf8f4da30b3c303eA6f479f1B8a3cD67d79bA3751'
  let user2PrivateKey: string = '87a419bc854c2497b2e7f99ab849ae02a29049efb4cd4bf50e21c47a9f14fe0a'

  // write function to sign in buyer
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

  it('User1 should send friend request', async () => {
    // sign in seller
    const JWT = await signIn(user1Address, user1PrivateKey);
    // eslint-disable-next-line no-unreachable
    const response = await Axios.post('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/friends/request',
        {
          friendId: user2Address,
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
    expect(response.data.message).to.contains('request sent')
  });
  it('User1 should fetch pending requests', async () => {
    // sign in seller
    const JWT = await signIn(user1Address, user1PrivateKey);
    // eslint-disable-next-line no-unreachable
    const response = await Axios.get('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/friends/pending',
        {
          headers: {
            'Authorization': `Bearer ${JWT}`
          }
        }
    );
    // eslint-disable-next-line no-console
    console.log(response.data);
    // eslint-disable-next-line no-undef,no-unused-expressions
    expect(response.data.pending.length).eq(1);
  })
  it('User2 should fetch requests', async () => {
    // sign in seller
    const JWT = await signIn(user2Address, user2PrivateKey);
    // eslint-disable-next-line no-unreachable
    const response = await Axios.get('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/friends/requests',
        {
          headers: {
            'Authorization': `Bearer ${JWT}`
          }
        }
    );
    // eslint-disable-next-line no-console
    console.log(response.data);
    // eslint-disable-next-line no-undef,no-unused-expressions
    expect(response.data.requests.length).eq(1)
  })
  it('User2 should accept friend request', async () => {
    try {
      // sign in seller
      const JWT = await signIn(user2Address, user2PrivateKey);
      // eslint-disable-next-line no-unreachable
      const response = await Axios.post('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/friends/accept',
          {
            friendId: user1Address,
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
      expect(response.data.message).to.contains('request accepted')
    } catch (e) {
        console.log(e);

    }

  });
  it('User1 pending requests should be zero', async () => {
    // sign in seller
    const JWT = await signIn(user1Address, user1PrivateKey);
    // eslint-disable-next-line no-unreachable
    const response = await Axios.get('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/friends/pending',
        {
          headers: {
            'Authorization': `Bearer ${JWT}`
          }
        }
    );
    // eslint-disable-next-line no-console
    console.log(response.data);
    // eslint-disable-next-line no-undef,no-unused-expressions
    expect(response.data.pending.length).eq(0)
  })
  it('User1 should get user2 as friend', async () => {
    // sign in seller
    const JWT = await signIn(user1Address, user1PrivateKey);
    // eslint-disable-next-line no-unreachable
    const response = await Axios.get('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/friends/list/'+user1Address);
    // eslint-disable-next-line no-console
    console.log(response.data);
    // eslint-disable-next-line no-undef,no-unused-expressions
    expect(response.data.friends).to.contains(user2Address)
  })
  it('User2 should get user1 as friend', async () => {
    // sign in seller
    const JWT = await signIn(user1Address, user1PrivateKey);
    // eslint-disable-next-line no-unreachable
    const response = await Axios.get('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/friends/list/'+user2Address);
    // eslint-disable-next-line no-console
    console.log(response.data);
    // eslint-disable-next-line no-undef,no-unused-expressions
    expect(response.data.friends).to.contains(user1Address)
  })
  // user2 should unfriend user1
    it('User2 should unfriend user1', async () => {
      // sign in seller
      const JWT = await signIn(user2Address, user2PrivateKey);
      // eslint-disable-next-line no-unreachable
      const response = await Axios.post('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/friends/unfriend',
          {
            friendId: user1Address,
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
      expect(response.data.message).to.contains('unfriended')
    });
    it('User1 should not get user2 as friend', async () => {
        // sign in seller
        const JWT = await signIn(user1Address, user1PrivateKey);
        // eslint-disable-next-line no-unreachable
        const response = await Axios.get('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/friends/list/'+user1Address);
        // eslint-disable-next-line no-console
        console.log(response.data);
        // eslint-disable-next-line no-undef,no-unused-expressions
        expect(response.data.friends).not.contains(user2Address)
    });
    it('User2 should not get user1 as friend', async () => {
        // sign in seller
        const JWT = await signIn(user2Address, user2PrivateKey);
        // eslint-disable-next-line no-unreachable
        const response = await Axios.get('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/friends/list/'+user2Address);
        // eslint-disable-next-line no-console
        console.log(response.data);
        // eslint-disable-next-line no-undef,no-unused-expressions
        expect(response.data.friends).not.contains(user1Address)
    });
    // user1 should send friend request to user2 again
    it('User1 should send friend request to user2 again', async () => {
        // sign in seller
        const JWT = await signIn(user1Address, user1PrivateKey);
        // eslint-disable-next-line no-unreachable
        const response = await Axios.post('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/friends/request',
            {
                friendId: user2Address,
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
        expect(response.data.message).to.contains('request sent')
    });
    // user2 should reject friend request
    it('User2 should reject friend request', async () => {
      // sign in seller
        const JWT = await signIn(user2Address, user2PrivateKey);
        // eslint-disable-next-line no-unreachable
        const response = await Axios.post('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/friends/reject',
            {
                friendId: user1Address,
            },
            {
                headers: {
                  Authorization: `Bearer ${JWT}`
                }
            }
        );
        // eslint-disable-next-line no-console
        console.log(response.data);
        // eslint-disable-next-line no-undef,no-unused-expressions
        expect(response.data.message).to.contains('request rejected')
    });

});
