export interface DiscourseConfigObject {
  category: number;
  token: string;
  user: string;
  url: string;
}

class DiscourseConfig {
  category!: number;
  token!: string;
  user!: string;
  url!: string;
  constructor(config: DiscourseConfigObject) {
    Object.keys(config).forEach(key => (this[key] = config[key]));
  }
}

interface SlackConfigObject {
  token: string;
  signingSecret: string;
  promoMessage?: string;
}

class SlackConfig {
  token!: string;
  signingSecret!: string;
  promoMessage?: string;
  constructor(config: SlackConfigObject) {
    Object.keys(config).forEach(key => (this[key] = config[key]));
  }
}

export class Configuration {
  discourse: DiscourseConfig = {} as DiscourseConfig;
  slack: SlackConfig = {} as SlackConfig;
  isValid: boolean | undefined;
  missingRequiredKeys: any;
  constructor(config: any = {}) {
    const discourseConfig: DiscourseConfig = {} as DiscourseConfig;
    // Discourse
    const discourse = config?.discourse;
    discourseConfig.token =
      process.env.DISCOURSE_TOKEN ||
      discourse?.token ||
      ((null as unknown) as string);
    discourseConfig.user = process.env.DISCOURSE_USER || discourse?.user;
    discourseConfig.category =
      process.env.DISCOURSE_CATEGORY ||
      discourse?.category ||
      ((null as unknown) as string);
    discourseConfig.url =
      process.env.DISCOURSE_URL ||
      discourse?.url ||
      ((null as unknown) as string);
    this;
    this.discourse = new DiscourseConfig(discourseConfig);

    // Slack
    const slackConfig: SlackConfig = {} as SlackConfig;

    slackConfig.token =
      process.env.SLACK_BOT_TOKEN ||
      config?.slack?.bot_token ||
      ((null as unknown) as string); // null for required property
    slackConfig.signingSecret =
      process.env.SLACK_SIGNING_SECRET ||
      config?.slack?.signing_secret ||
      ((null as unknown) as string);
    slackConfig.promoMessage =
      process.env.SLACK_PROMO_MESSAGE ||
      config?.slack?.promo_message ||
      undefined; // undefined for optional
    this.slack = new SlackConfig(slackConfig);
  }

  validate(): Configuration {
    const missingRequiredKeys = Object.keys({
      discourse: this.getNullKeys(this.discourse),
      slack: this.getNullKeys(this.slack)
    });
    const missingRequiredKeyList = missingRequiredKeys
      .map(configKey =>
        missingRequiredKeys[configKey]
          ? { [configKey]: missingRequiredKeys[configKey] }
          : undefined
      )
      .filter(configKey => !!configKey);

    this.isValid = missingRequiredKeyList.length > 0;
    this.missingRequiredKeys = this.isValid ? undefined : missingRequiredKeys;
    return this;
  }

  private getNullKeys(config: object) {
    const nullKeys = Object.keys(config).filter(key => config[key] === null);
    return nullKeys.length > 0 ? nullKeys : undefined;
  }
}