
// write test cases for feed endpoints using mocha and chai
import {expect} from 'chai';
import {describe, it} from 'mocha';
import Axios from 'axios';
import {personalSign} from 'eth-sig-util';

describe('Feed API Testing', () => {
    let address: string= '0xaa22df74d79f49e26fac5c880a3d9eca54d08648' // maker

    it('GET /feed/', async () => {
      const response = await Axios.get('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/feed/',
          {params: {limit: 10, offset: 0, address}},
      );
      // log response
        console.log(response.data)
      expect(response.data).to.be.an('object');
    });
    it('GET /feed/friends/:friendId', async () => {
      const response = await Axios.get('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/feed/friends/0x87cf728b8074fd109ba33098e64570c6c1a61390',
          {params: {limit: 10, offset: 0, address}},
      );
      // log response
        console.log(response.data)
      expect(response.data).to.be.an('object');
    });
    it('GET /feed/friends', async () => {
      const response = await Axios.get('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/feed/friends',
          {params: {limit: 10, offset: 0, address}},
      );
      // log response
        console.log(response.data)
      expect(response.data).to.be.an('object');
    });
    it('GET /feed/collection/:collectionAddr', async () => {
      const response = await Axios.get('https://asia-northeast3-oedi-a1953.cloudfunctions.net/v1/feed/collection/0x9c25ee0f938122a504be82189536df74687858e4',
          {params: {limit: 10, offset: 0, address}},
      );
      // log response
        console.log(response.data)
      expect(response.data).to.be.an('object');
    });
});

// Path: functions/test/feed.test.ts

// Compare this snippet from functions/src/feed/utils.ts:'
