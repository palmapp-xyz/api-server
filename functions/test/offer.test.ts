import Axios from 'axios';
import {personalSign} from 'eth-sig-util';
import {expect} from 'chai';
import {Auth} from 'firebase/auth';
import web3 from 'web3';
// eslint-disable-next-line no-undef
describe('Offer APIs', () => {
  let address: string;
  let messageToSign: { result: { id: string; message: string; profileId: string; } };

  let sellerAddress: string = '0x1Efd3eFd7c78d98B155F724EB6A161C50d8CFbf0'
  let sellerPrivateKey: string = 'ea04b975612cb9d108cc75bf13510d5a529006f6aed9056808681f8e74e03779'
  let buyerAddress: string = '0xf8f4da30b3c303eA6f479f1B8a3cD67d79bA3751'
  let buyerPrivateKey: string = '87a419bc854c2497b2e7f99ab849ae02a29049efb4cd4bf50e21c47a9f14fe0a'

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

  it('should create sell offer', async () => {
    return;
    // sign in seller
    const JWT = await signIn(sellerAddress, sellerPrivateKey);
    // eslint-disable-next-line no-unreachable
    const response = await Axios.post('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/offer/create',
        {
          txHash: '0xc57e40fd28fcfe98b38abe1b124dc09bcd49056026c10982813477f814a8cce0',
          nftId: 4,
          nftContractAddr: '0x5f927395213ee6b95de97bddcb1b2b1c0f16844f',
          price: {
            amount: 100,
            symbol: 'USD',
          },
          expiryTime: 1739453839,
          seller: '0x1Efd3eFd7c78d98B155F724EB6A161C50d8CFbf0',
          buyer: '0x9482560FcF014bfd73102A212BE9115f7CF37916',
          type: 'sell',
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

    it('should create buy offer', async () => {
      return;
    // sign in buyer
    const JWT = await signIn(buyerAddress, buyerPrivateKey);
      // eslint-disable-next-line no-unreachable
      const response = await Axios.post('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/offer/create',
          {
            txHash: '0xc57e40fd28fcfe98b38abe1b124dc09bcd49056026c10982813477f814a8cce0',
            nftId: 3,
            nftContractAddr: '0x5f927395213ee6b95de97bddcb1b2b1c0f16844f',
            price: {
              amount: 100,
              symbol: 'USD',
            },
            expiryTime: 1739453839,
            seller: '0x1Efd3eFd7c78d98B155F724EB6A161C50d8CFbf0',
            buyer: buyerAddress,
            type: 'buy',
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
    })
  // write test to get /sell/all offers by passing query params seller & status
  it('should get all sell offers', async () => {
    return;
    const response = await Axios.get(`https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/offer/sell/all`,
        {
            params: {
                seller: sellerAddress,
                status: 'pending'
            }
        });
    // eslint-disable-next-line no-console
    console.log(response.data);
    // eslint-disable-next-line no-undef,no-unused-expressions
    expect(response.data.result.length).gt(0)
  })
    // write test to get /buy/all offers by passing query params buyer & status
    it('should get all buy offers', async () => {
        const response = await Axios.get('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/offer/buy/all',
            {
                params: {
                buyer: buyerAddress,
                status: 'pending'
                }
            }
        );
        // eslint-disable-next-line no-console
        console.log(response.data);
        // eslint-disable-next-line no-undef,no-unused-expressions
        expect(response.data.result.length).gt(0)
    })
  return;
  // write test to get /sell/all/:nftId offer by passing query params seller & status & nftId & nftContractAddr
    it('should get all sell offers by nftId', async () => {
      const nftId = 2;
        const response = await Axios.get(`https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/offer/sell/all/${nftId}`,
            {
                params: {
                    seller: sellerAddress,
                    status: 'pending',
                    nftContractAddr: '0x5f927395213ee6b95de97bddcb1b2b1c0f16844f'
                }
            }
        );
        // eslint-disable-next-line no-console
        console.log(response.data);
        // eslint-disable-next-line no-undef,no-unused-expressions
        expect(response.data.message.length).gt(0)
    })
  return;
    // write test to get /buy/all/:nftId offer by passing query params buyer & status & nftId & nftContractAddr
    it('should get all buy offers by nftId', async () => {
        const nftId = 1;
            const response = await Axios.get(`https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/offer/buy/all/${nftId}`,
                {
                    params: {
                        buyer: buyerAddress,
                        status: 'pending',
                        nftContractAddr: '0x5f927395213ee6b95de97bddcb1b2b1c0f16844f'
                    }
                }
            );
            // eslint-disable-next-line no-console
            console.log(response.data);
            // eslint-disable-next-line no-undef,no-unused-expressions
            expect(response.data.message.length).gt(0)
    } )
  return;
  // write test to cancel buy offer by passing offerId in body & buyer's JWT in header
    it('should cancel buy offer', async () => {

        const JWT = await signIn(buyerAddress, buyerPrivateKey);
        const response = await Axios.post('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/offer/cancel',
            {
                offerId: 'o11b7ia2ggle36j8s6'
            },
            {
                headers: {
                  Authorization: `Bearer ${JWT}`
                }
            });
        // eslint-disable-next-line no-console
        console.log(response.data);
        // eslint-disable-next-line no-undef,no-unused-expressions
        expect(response.data.message).to.contains('cancelled')
    })
  return;
    // write test to cancel sell offer by passing offerId in body & seller's JWT in header
    it('should cancel sell offer', async () => {
      // sign in seller
        const JWT = await signIn(sellerAddress, sellerPrivateKey);
        const response = await Axios.post('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/offer/cancel',
            {
              nftId: 2,
            },
            {
                headers: {
                  Authorization: `Bearer ${JWT}`
                }
            } );
        // eslint-disable-next-line no-console
        console.log(response.data);
        // eslint-disable-next-line no-undef,no-unused-expressions
        expect(response.data.message).to.contains('cancelled')
    } )
  return;
  // write test to reject buy offer by passing offerId, nftId & nftContractAddr in body & seller's JWT in header
    it('should reject buy offer', async () => {
      // sign in seller
        const JWT = await signIn(sellerAddress, sellerPrivateKey);
        const response = await Axios.post('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/offer/reject',
            {
              nfContractAddr: '0x5f927395213ee6b95de97bddcb1b2b1c0f16844f',
              nftId: 2,
              offerId: 'o11b7ia2ggle36j8s6' // TODO: get offerId from /buy/all/:nftId
            },
            {
                headers: {
                  Authorization: `Bearer ${JWT}`
                }
            })
        // eslint-disable-next-line no-console
        console.log(response.data);
        // eslint-disable-next-line no-undef,no-unused-expressions
        expect(response.data.message).to.contains('rejected')
    })
  return;
  // write test to accept buy offer by passing offerAccepted, nftId & nftContractAddr &  in body & seller's JWT in header
    it('should accept buy offer', async () => {
      // sign in seller
        const JWT = await signIn(sellerAddress, sellerPrivateKey);
        const response = await Axios.post('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/offer/accept',
            {
                nfContractAddr: '0x5f927395213ee6b95de97bddcb1b2b1c0f16844f',
                nftId: 2,
              offerAccepted: {
                  offerId: 'o11b7ia2ggle36j8s6', // TODO: get offerId from /buy/all/:nftId
                  txHash: '0xc57e40fd28fcfe98b38abe1b124dc09bcd49056026c10982813477f814a8cce0'
              }
            },
            {
                headers: {
                  Authorization: `Bearer ${JWT}`
                }
            })
        // eslint-disable-next-line no-console
        console.log(response.data);
        // eslint-disable-next-line no-undef,no-unused-expressions
        expect(response.data.message).to.contains('accepted')
    })


});
