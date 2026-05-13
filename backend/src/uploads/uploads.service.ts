import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';

@Injectable()
export class UploadsService {
  constructor(private config: ConfigService) {}

  getSignedUploadParams(folder: string) {
    const timestamp = Math.round(Date.now() / 1000);
    const apiSecret = this.config.get<string>('CLOUDINARY_API_SECRET', '');

    // Cloudinary signature: SHA1 of sorted "key=value" pairs + api_secret
    const params: Record<string, string | number> = { folder, timestamp };
    const signatureBase =
      Object.keys(params)
        .sort()
        .map((k) => `${k}=${params[k]}`)
        .join('&') + apiSecret;

    const signature = createHash('sha1').update(signatureBase).digest('hex');

    return {
      signature,
      timestamp,
      apiKey: this.config.get('CLOUDINARY_API_KEY'),
      cloudName: this.config.get('CLOUDINARY_CLOUD_NAME'),
      folder,
    };
  }
}
