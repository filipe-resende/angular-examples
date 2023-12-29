import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Detector } from '../../shared/models/Detector';
import { PerimeterAccessControl } from '../../shared/models/primeter-access-control';
import { DetectorsRepository } from '../repositories/detectors.repository';
import { DetectorView } from '../../shared/models/DetectorView';
import { Geofence } from '../../shared/models/geofence';
import { GeometryInput, POLYGON_TYPE } from '../../shared/models/geometryInput';
import { HttpStatusCodeResponse } from '../../shared/interfaces/http-response.interface';
import { UserProfileService } from '../../stores/user-profile/user-profile.service';

@Injectable({
  providedIn: 'root'
})
export class DetectorsService {
  constructor(
    private detectorsRepository: DetectorsRepository,
    private userProfileService: UserProfileService
  ) {}

  public getAllDetectorsOnRadius(
    latitude: number,
    longitude: number,
    radius: number
  ): Observable<Detector[]> {
    return this.detectorsRepository.getAllDetectorsOnRadius(
      latitude,
      longitude,
      radius
    );
  }

  public getAllDetectorsOnVirtualFence(
    coordinates: number[][]
  ): Observable<Detector[]> {
    return this.detectorsRepository.getAllDetectorsOnVirtualFence(coordinates);
  }

  public getDetectorsOnFence(perimeterId: string): Observable<DetectorView[]> {
    return this.detectorsRepository.getDetectorsOnFence(perimeterId);
  }

  public getDetectorsOnFencePolygon(
    geofence: Geofence
  ): Observable<DetectorView[]> {
    const geometryInput = this.getInputPolygonFromGeofence(geofence);

    return this.detectorsRepository.getDetectorsOnFencePolygon(
      geofence.id,
      geometryInput
    );
  }

  public EditDetectorsOnFence(
    geofence: Geofence,
    detectors: Detector[]
  ): Observable<HttpStatusCodeResponse> {
    const user = this.userProfileService.getUserProfile()?.iamId;

    return this.detectorsRepository.EditDetectorsOnFence({
      detectors,
      user,
      geofence
    });
  }

  public getInputPolygonFromGeofence(geofence: Geofence): GeometryInput {
    const type = POLYGON_TYPE;
    const coordinates = geofence.coordinates.map(c => [c.lng, c.lat]);
    return {
      type,
      coordinates
    } as GeometryInput;
  }

  public createPerimeterAccessControlAssociation(
    perimeterAccessControl: PerimeterAccessControl
  ): Observable<any> {
    return this.detectorsRepository.createPerimeterAccessControlAssociation(
      perimeterAccessControl
    );
  }
}
