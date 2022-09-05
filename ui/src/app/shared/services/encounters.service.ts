import { OpenmrsHttpClientService } from 'src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service';
import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../constants/constants.constants';
import { delay } from 'rxjs/operators';
import { Api } from '../resources/openmrs';

@Injectable({
  providedIn: "root",
})
export class EncountersService {
  constructor(
    private httpClient: HttpClient,
    private OpenmrsHttpClientService: OpenmrsHttpClientService,
    private API: Api
  ) {}

  async getData(id) {
    return await this.httpClient
      .get(BASE_URL + "encounter/" + id)
      .pipe(delay(1000))
      .toPromise();
  }

  async getEncountersData(id) {
    return await this.httpClient
      .get(BASE_URL + "encounter/" + id + "?v=full")
      .pipe(delay(1000))
      .toPromise();
  }

  getEncountersDetails(encounterDetails): Observable<any> {
    const data = new Observable((observer) => {
      let idsLoaded = {};
      let ordersData = [];
      _.each(encounterDetails, (encounterDetail) => {
        idsLoaded[encounterDetail.encounter.uuid]
          ? ""
          : this.getData(encounterDetail.encounter.uuid).then((data) => {
              ordersData = [...ordersData, data];
              observer.next(ordersData);
            });
        idsLoaded[encounterDetail.encounter.uuid] =
          encounterDetail.encounter.uuid;
      });
    });
    return data;
  }

  async createEncounter(encounter): Promise<any> {
    return await this.API.encounter.createEncounter(encounter);
  }
}