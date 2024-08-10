import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ip } from "../database";

// TODO timings
const mhUpdateCooldown = 100;
const positionFetchInterval = 100;
const movingsFetchInterval = 1000;

export interface Position {
  x: number;
  y: number;
  height?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MovingHeadService {
  private movingHeads: any; 
  private tempPositions: any = new Map<string, Position>();
  private submitedPositions: any = new Map<string, Position>();

  private cooldownMHs: string[] = [];

  private movingsStream = new Subject()

  constructor(private http: HttpClient) {
    this.fetchMovings();
  }

  // fetch mhs every 10s
  private async fetchMovings() {
    await this.http.get('http://' + ip + ':3000/movingHeads').subscribe((data) => this.movingHeads = this.sort(data));

    setInterval(() => {
      this.http.get('http://' + ip + ':3000/movingHeads').subscribe((data) => {
        data = this.sort(data);
        if(JSON.stringify(data) === JSON.stringify(this.movingHeads)) return;
        this.movingHeads = data;
        this.movingsStream.next(this.movingHeads);
      });
    }, movingsFetchInterval);
    
    this.fetchPositions();
  }

  sort(mhs : any) : any {
    return mhs.sort(function (a : any, b : any) {
      if (a.name < b.name)  return -1;
      if (a.name > b.name)  return  1;
                            return  0;
                              // TODO null all properties, which shouldn't cause rerender
    }).map((mh : any) => ({...mh, x: 0, y: 0, height: 0, values: [] }));
  }

  // fetch every 100ms
  // TODO cache serverside and don't assamble data every time!!
  private fetchPositions() {
    this.http.get('http://' + ip + ':3000/movingHeads/positions').subscribe(this.mergePositions.bind(this));

    // TODO fetch only when change occured (changed ID)
    setInterval(() => {
      this.http.get('http://' + ip + ':3000/movingHeads/positions').subscribe(this.mergePositions.bind(this));
    }, positionFetchInterval);
  }

  private mergePositions(data: any) {
    let changes: boolean = false;

    data.forEach(({ id, position }: { id: string, position: Position }) => {
      // if change has occured -> return
      // TODO check if further update neccessary (refetch)
      if (this.tempPositions.get(id) !== this.submitedPositions.get(id)) return;
      
      // if recieved data hasn't changed -> return
      if (JSON.stringify(position) === JSON.stringify(this.tempPositions.get(id))) return;
      
      // update temp data
      this.tempPositions.set(id, position);
      this.submitedPositions.set(id, position);

      changes = true;
    });

    // if changes occured, update display by Observable
    if (changes) this.movingsStream.next(this.movingHeads);
  }

  // submit position updates
  private submitPosition(id: string, position: Position, tempPositon: Position) {
    // cooldown for multiple changes on same mh
    if (this.cooldownMHs.includes(id)) return;
    this.cooldownMHs.push(id);

    // update DB
    this.http.put('http://' + ip + ':3000/movingHeads/position/' + id, { position: position }, { responseType: 'text' }).subscribe(() => { this.submitedPositions.set(id, tempPositon) });
    
    // // set height if undefined for later change comparison
    // if (position.height === undefined) position.height = this.tempPositions.get(id).height;

    // enable cooldown
    setTimeout(() => {
      // remove from cooldown
      this.cooldownMHs = this.cooldownMHs.filter((id) => id !== id);
      // if change has occured -> resubmit
      if (JSON.stringify(this.tempPositions.get(id)) !== JSON.stringify(position)) {
        // BAD: overides height, even if not updated
        this.submitPosition(id, this.tempPositions.get(id), this.tempPositions.get(id));
        console.log("resubmit");
      }
      // console.log("reseted " + id)
    }, mhUpdateCooldown);
  }

  // get positions as Observable
  public getMovings(): Observable<any> {
    return this.movingsStream.asObservable();
  }

  public getPositions() {
    return this.tempPositions;
  }

  public getPosition(id: string) : Position {
    return this.tempPositions.get(id);
  }

  public setPosition(id: string, x: number, y: number, height?: number) {
    let position: Position = { x: x, y: y, height: height };
    // console.log(position)

    // if not specified, set height to old one for local use
    let tempPosition: Position = position;
    if(tempPosition.height === undefined)
      tempPosition.height = this.tempPositions.get(id).height;

    // update position in temp data
    this.tempPositions.set(id, tempPosition);
  	
    this.submitPosition(id, position, tempPosition);
  }

  public getHeight(id: string) : number {
    if(!this.getPosition(id)) return 0;
    return this.getPosition(id).height || 0;
  }

  public setHeight(id: string, height: number) {
    this.setPosition(id, this.tempPositions.get(id).x, this.tempPositions.get(id).y, height);
  }

  public getXY(id: string) {
    return {x: this.getPosition(id).x, y: this.getPosition(id).y}
  }

  public getX(id: string): number {
    // TODO function gets called way to often
    // console.log(this.getPosition(id));
    return this.getPosition(id).x;
  }

  public getY(id: string): number {
    return this.getPosition(id).y;
  }

  public setHome(id: string) {
    this.http.put('http://' + ip + ':3000/movingHeads/home/' + id, { position: this.getPosition(id) }, { responseType: 'text' }).subscribe();
  }

  public home() {
    for(let mh of this.movingHeads) {
      this.http.get('http://' + ip + ':3000/movingHeads/home/' + mh.mhId, { responseType: 'text' }).subscribe();
    } 
  }
}