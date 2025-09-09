import SecretsManagerUtil from '@common/aws/SecretsManagerUtil';
import APIUtil from '@client-common/utils/APIUtil';

export async function GET() {
  try {
    const publisherId = await SecretsManagerUtil.getSecretValue('GoogleAdSense', 'PublisherID');
    
    return APIUtil.ReturnSuccess({
      publisherId: publisherId
    });
  } catch (error) {
    console.error('Failed to get AdSense Publisher ID:', error);
    return APIUtil.ReturnInternalServerError({ error: 'Failed to retrieve AdSense Publisher ID' });
  }
}