import SecretsManagerUtil from '@common/aws/SecretsManagerUtil';
import EnvironmentalUtil from '@common/utils/EnvironmentalUtil';

export interface AdsenseConfig {
    publisherId: string;
    enableAutoAds?: boolean;
}

export default class AdSenseUtil {
  /**
   * Fetches the AdSense configuration from AWS Secrets Manager
   * AdSense is disabled when ProcessEnv is 'local' (debug environment)
   * @param enableAutoAds Whether to enable auto ads (default: true)
   * @returns AdSense configuration or null if not available or disabled for local environment
   */
  public static async getAdSenseConfig(enableAutoAds: boolean = true): Promise<AdsenseConfig | null> {
    // Disable AdSense in local environment (debug time)
    const processEnv = EnvironmentalUtil.GetProcessEnv();
    if (processEnv === 'local') {
      console.log('AdSense disabled in local environment');
      return null;
    }

    try {
      const publisherId = await SecretsManagerUtil.getSecretValue('GoogleAdSense', 'PUBLISHER_ID', true);
      
      return {
        publisherId,
        enableAutoAds
      };
    } catch (error) {
      console.warn('AdSense Publisher ID not available:', error);
      return null;
    }
  }
}
