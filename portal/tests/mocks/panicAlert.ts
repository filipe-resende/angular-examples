export const PANIC_ALERT_2020_MOCK = {
  id: '1',
  eventDateTime: new Date('2020-01-01'),
  eventLocation: { lat: 50, lng: 32 },
  description: 'C0619549',
  cacheId: 1,
  deviceSourceInfoId: '1',
  deviceSourceInfoType: 'type 1',
  sourceApplicationId: '1'
};

export const PANIC_ALERT_1990_MOCK = {
  id: '2',
  eventDateTime: new Date('1990-05-05'),
  eventLocation: { lat: -50, lng: -2 },
  cacheId: 1,
  deviceSourceInfoId: '2',
  deviceSourceInfoType: 'type 2',
  sourceApplicationId: '2'
};

export const PANIC_ALERT_1995_MOCK = {
  id: '3',
  eventDateTime: new Date('1995-09-09'),
  eventLocation: { lat: -50, lng: -2 },
  description: 'João pedro Loncz',
  cacheId: 1,
  deviceSourceInfoId: '3',
  deviceSourceInfoType: 'type 3',
  sourceApplicationId: '3'
};

export const PANIC_ALERT_1996_MOCK = {
  id: '4',
  eventDateTime: new Date('1996-09-09'),
  eventLocation: { lat: -50, lng: -2 },
  cacheId: 1,
  deviceSourceInfoId: '4',
  deviceSourceInfoType: 'type 4',
  sourceApplicationId: '4'
};

export const PANIC_ALERTS_MOCK = [
  PANIC_ALERT_2020_MOCK,
  PANIC_ALERT_1990_MOCK,
  PANIC_ALERT_1995_MOCK,
  PANIC_ALERT_1996_MOCK
];
