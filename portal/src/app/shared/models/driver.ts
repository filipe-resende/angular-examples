import { PointOfInterest } from "./poi";

export class Driver {
    public id: string;
    public name: string;
    public matricula: string;
    public localityId: string;
    public pointOfInterestId: string;
    public pointOfInterest: PointOfInterest;
    public answered: boolean;
    public phoneNumber: string;
    public selected: boolean = false;
}
