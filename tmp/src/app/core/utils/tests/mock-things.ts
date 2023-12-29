let prepareMock = [];

export const createThing = (index: number) => {
  return {
    id: `${index}`,
    name: `John Doe ${index}`,
    description: `some description ${index}`,
    sourceInfos: [
      { sourceTypeCPF: 'CPF', value: `xxx.xxx.xxx-x${index}` },
      { sourceTypeMDM: 'MDM', value: '1122334455' },
      { sourceTypeIAM: 'IAM', value: '123456' },
      { sourceTypePassport: 'Passport', value: '11223355446666568648' },
    ],
    status: true,
    type: 1,
    createdAt: 'some day',
    updatedAt: 'other day',

    associatedDevices: [
      {
        disassociationDate: null,
        id: 327014,
        device: {
          applicationId: '1b15997c-216b-491a-86a3-abf74d42ccdd',
          createdAt: '2020-04-09T22:41:41.9733333',
          description: 'SpotDevice',
          id: '5694c894-cacf-44e4-d065-08d7da195ef1',
          name: '0-3525181',
          sourceInfos: [{ type: 'deviceId', value: '0-3525181' }],
        },
      },
    ],
  };
};

export const generateThingsList = (num: number) => {
  for (let i = 1; i <= num; i++) {
    const newThing = createThing(i);
    prepareMock = [...prepareMock, newThing];
  }
  return prepareMock;
};

export const mockThings = generateThingsList(10);

// ----------------------------//
const thingUnit = num => {
  return {
    id: num,
    name: `John Doe ${num}`,
    description: `thing description ${num}`,
    type: 1,
    sourceInfos: [
      { type: 'CPF', value: `xxx.xxx.xxx-x${num}` },
      { type: 'MDM', value: '1122334455' },
      { type: 'IAM', value: '123456' },
      { type: 'PASSPORT', value: '11223355446666568648' },
    ],
    associatedDevices: [
      {
        id: num,
        associationDate: 'one day',
        disassociationDate: 'other day',
        device: {
          id: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
          applicationId: 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz',
          name: `Device ${num}`,
          description: `device description ${num}`,
          sourceInfos: [
            {
              type: 'type',
              value: 'value',
            },
          ],
          createdAt: 'one day',
          updatedAt: 'other day',
          status: true,
        },
      },
    ],
    createdAt: 'one day',
    updatedAt: 'other day',
    status: true,
  };
};

const generateGetAllEndpointList = num => {
  let things = [];

  for (let i = 0; i < num; i++) {
    const thing = thingUnit(i);
    things = [...things, thing];
  }
  return things;
};

export const listThings = generateGetAllEndpointList(10);
