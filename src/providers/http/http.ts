import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the HttpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HTTPProvider {

  constructor(private http_: Http){
    console.log('Hello HttpProvider Provider');
  }

  get_posts(){

    let url = 'https://jsonplaceholder.typicode.com/posts'

    return this.http_.get(url, {})
    .map( (res: Response) => { return res.json();})
    .catch( (error: Response | any) => {console.log(error); return Observable.throw(error.json() || "Server error.")});
    
  }

}
