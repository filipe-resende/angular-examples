export interface NotificationSettings {
  iamId: string;
  email: string;
  sendSms?: boolean;
  sendEmail?: boolean;
  sites?: { siteId: string }[];
  panicAlert?: boolean;
  lowBattery?: boolean;
  phoneNumber?: string;
  isDisabled?: boolean;
}
