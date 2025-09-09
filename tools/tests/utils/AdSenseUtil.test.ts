import AdSenseUtil from '@client-common/utils/AdSenseUtil.server';
import EnvironmentalUtil from '@common/utils/EnvironmentalUtil';

// Mock the dependencies
jest.mock('@common/utils/EnvironmentalUtil');
jest.mock('@common/aws/SecretsManagerUtil', () => ({
  getSecretValue: jest.fn().mockResolvedValue('test-publisher-id')
}));

const mockEnvironmentalUtil = EnvironmentalUtil as jest.Mocked<typeof EnvironmentalUtil>;

describe('AdSenseUtil', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null when ProcessEnv is local', async () => {
    // Mock the environment to be 'local'
    mockEnvironmentalUtil.GetProcessEnv.mockReturnValue('local');

    const result = await AdSenseUtil.getAdSenseConfig();

    expect(result).toBeNull();
    expect(mockEnvironmentalUtil.GetProcessEnv).toHaveBeenCalledTimes(1);
  });

  it('should return AdSense config when ProcessEnv is development', async () => {
    // Mock the environment to be 'development'
    mockEnvironmentalUtil.GetProcessEnv.mockReturnValue('development');

    const result = await AdSenseUtil.getAdSenseConfig();

    expect(result).toEqual({
      publisherId: 'test-publisher-id',
      enableAutoAds: true
    });
    expect(mockEnvironmentalUtil.GetProcessEnv).toHaveBeenCalledTimes(1);
  });

  it('should return AdSense config when ProcessEnv is production', async () => {
    // Mock the environment to be 'production'
    mockEnvironmentalUtil.GetProcessEnv.mockReturnValue('production');

    const result = await AdSenseUtil.getAdSenseConfig();

    expect(result).toEqual({
      publisherId: 'test-publisher-id',
      enableAutoAds: true
    });
    expect(mockEnvironmentalUtil.GetProcessEnv).toHaveBeenCalledTimes(1);
  });

  it('should respect enableAutoAds parameter', async () => {
    // Mock the environment to be 'production'
    mockEnvironmentalUtil.GetProcessEnv.mockReturnValue('production');

    const result = await AdSenseUtil.getAdSenseConfig(false);

    expect(result).toEqual({
      publisherId: 'test-publisher-id',
      enableAutoAds: false
    });
  });
});