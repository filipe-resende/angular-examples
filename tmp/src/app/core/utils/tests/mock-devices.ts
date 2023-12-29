import { DeviceItem } from 'src/app/model/devices-interfaces';

const dummies = index => {
  return {
    associatedThings: [
      {
        id: 279512,
        thing: {
          id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' + index,
          name: `John Doe ${index}`,
          description: 'PR' + index,
          type: 1,
          sourceInfos: [
            {
              type: `a type ${index}`,
              value: `1234567890${index}`,
            },
          ],
        },
      },
    ],
    device: {
      applicationId: `yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy${index}`,
      description: `description${index}`,
      id: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx${index}`,
      name: `John Doe device ${index}`,
      status: true,
      sourceInfos: [
        {
          type: `deviceId ${index}`,
          value: `1234567890${index}`,
        },
      ],
    },
  };
};

export const deviceDummyList = (num: number, condition?: boolean) => {
  let regularDummy = [];
  let filteredDummy = [];

  if (condition) {
    for (let i = 1; i <= num; i++) {
      let newDevice = dummies(i);
      newDevice.associatedThings = [];
      filteredDummy = [...filteredDummy, newDevice];
    }
    return filteredDummy;
  } else {
    for (let i = 1; i <= num; i++) {
      let newDevice = dummies(i);
      regularDummy = [...regularDummy, newDevice];
    }
    return regularDummy;
  }
};

//// ===================== Rever e deletar para baixo ================= ///
let prepareMock = [];

export const createDevice = (index: number): DeviceItem => {
  return {
    id: `${index}`,
    applicationId: '1',
    name: `Device ${index}`,
    description: 'Some Description',
    sourceInfos: [
      {
        type: 'some document',
        value: 'some number',
      },
    ],
    createdAt: 'Some day',
    updatedAt: 'other day',
    status: false,
    deviceStatusId: 1,
    groupId: null,
    group: null,
    invoice: '1234567890',
    invoiceProvider: '1234567890',
    moveDate: new Date(),
    calledCode: 'test code',
    management: null,
  };
};

export const generateDevicesList = (num: number) => {
  for (let i = 1; i <= num; i++) {
    const newThing = createDevice(i);
    prepareMock = [...prepareMock, newThing];
  }
  return prepareMock;
};

export const mockDevicesList = generateDevicesList(10);
export const mockAllDevices = generateDevicesList(20);

// --- Usado nos testes de Update Device ----//
export const deviceDummy = {
  associatedThings: [
    {
      id: 279512,
      thing: {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        name: 'John Doe',
        description: 'PR',
        type: 1,
        sourceInfos: [
          {
            type: 'a type',
            value: '33445566',
          },
        ],
      },
    },
  ],
  device: {
    applicationId: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
    description: 'description',
    id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    name: 'John Doe',
    status: true,
    sourceInfos: [
      {
        type: 'deviceId',
        value: '77889900',
      },
    ],
  },
};

// --- Usado nos testes de Location Update Device  ----//
export const deviceDummyDeviceLocation = {
  lastInfo: {
    coordinates: [
      {
        latitude: '-1,1111',
        longitude: '-2,2222',
      },
    ],
  },
};
