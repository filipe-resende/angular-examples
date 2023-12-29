import { ApplicationItem } from 'src/app/model/applications-interfaces';

let prepareMock = [];

export const createApplication = (index: number): ApplicationItem => {
  return {
    id: `${index}`,
    name: `Application ${index}`,
    description: 'Some Description',
    createdAt: 'Some day',
    updatedAt: 'other day',
    status: false,
    allowDeviceAssociation: false,
    allowInclusionDeviceGroup: false,
    showInDeviceTypesList: false,
  };
};

export const generateApplicationsList = (num: number) => {
  for (let i = 1; i <= num; i++) {
    const newThing = createApplication(i);
    prepareMock = [...prepareMock, newThing];
  }
  return prepareMock;
};

export const mockApplicationsList = generateApplicationsList(10);
export const mockAllApplications = generateApplicationsList(20);
