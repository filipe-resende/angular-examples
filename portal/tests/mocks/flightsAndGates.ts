import {
  FlightsAndGatesPaginatedResponse,
  FlightsAndGatesPeoplePaginatedResponse,
} from "src/app/stores/flights/flights.state";

export const DEFAULT_FLIGHTS_AND_GATES_MOCK: FlightsAndGatesPaginatedResponse = {
  totalCount: 100,
  data: [
    {
      type: "flight",
      direction: "entering",
      peopleCount: 20,
      lastReport: new Date(),
      flight: 411,
      originDestiny: "Site 1",
    },
    {
      type: "flight",
      direction: "leaving",
      peopleCount: 50,
      lastReport: new Date(),
      flight: 410,
      originDestiny: "Site 2",
    },
    {
      type: "gate",
      direction: "entering",
      peopleCount: 30,
      lastReport: new Date(),
      flight: null,
      originDestiny: "Voiseys Bay",
    },
  ],
};

export const DEFAULT_FLIGHTS_AND_GATES_PEOPLE_MOCK: FlightsAndGatesPeoplePaginatedResponse = {
  totalCount: 100,
  data: [
    {
      id: "guid",
      name: "John Doe",
      role: "Developer",
      roleType: "Contractor",
      department: "IT",
      phone: "9999-9999",
      email: "johndoe@email.com",
      hasPassedOnGate: true,
    },
  ],
};
