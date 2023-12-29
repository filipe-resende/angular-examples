export interface ThingsManagmentDevice {
  device: {
    id: string;
    applicationId: string;
    name: string;
    description: string;
    sourceInfos: [
      {
        type: string;
        value: string;
      }
    ];
    createdAt: string;
    updatedAt: string;
    status: number;
  };
  associatedThings: [
    {
      id: number;
      associationDate: string;
      disassociationDate: string;
      thing: {
        id: string;
        name: string;
        description: string;
        type: number;
        relationType: number;
        sourceInfos: [
          {
            type: string;
            value: string;
          }
        ];
        companyInfo: {
          companyCode: string;
          companyName: string;
          relationType: number;
          status: number;
        };
        createdAt: string;
        updatedAt: string;
        status: number;
      };
    }
  ];
}
