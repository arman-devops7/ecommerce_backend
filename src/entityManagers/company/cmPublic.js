// import {
//   MODELS,
//   getNewConnection,
//   releaseConnection,
// } from '../../sequelize.js';
// import { filterAvail } from '../../helper/entityhelper.js';
// import { ModelLogManager } from '../ModelLogHelper.js';
import { CMHelper } from './cmHelper.js';
import tencentcloud from 'tencentcloud-sdk-nodejs';

export class CMPublic extends CMHelper {
  static async kmsKey() {
    console.log('in kms');
    const KmsClient = tencentcloud.kms.v20190118.Client;
    try {
      console.log('in try');
      const clientConfig = {
        credential: {
          secretId: 'IKIDz0whMxY9lIds6ITbbR8c5nRtCKFzX2LU', // Replace with the Tencent Cloud SecretId
          secretKey: '50iy9HLNEwdYQEwUq055wcLemjWAf0EH', // Replace with the Tencent Cloud SecretKey
        },
        region: 'ap-singapore', // Replace with the region
        profile: {
          httpProfile: {
            endpoint: 'kms.tencentcloudapi.com',
          },
        },
      };

      const client = new KmsClient(clientConfig);
      console.log('in kms2');
      const params = {
        KeyId: '79e71f1b-d800-11ef-9166-525400dbeeb1',
        Plaintext: Buffer.from('hello world!').toString('base64'), // Convert plaintext to Base64
      };
      console.log('params', params);
      const response = await client.Encrypt(params);
      console.log('in response', response);
      const encryptedKey = response.CiphertextBlob;
      console.log('encryptedText', encryptedKey);

      const params2 = {
        CiphertextBlob: encryptedKey, // Use the encrypted key from the previous step
      };
      const response2 = await client.Decrypt(params2);
      const decryptedKey = Buffer.from(response2.Plaintext, 'base64').toString(
        'utf-8'
      );

      console.log('\n\ndecryptedText', decryptedKey);
      return Promise.resolve({ ok: true });
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }
}
