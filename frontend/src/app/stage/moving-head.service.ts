import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, Subject } from "rxjs";
import { handleError, ip } from "../database";

// TODO timings
const mhUpdateCooldown = 100;
const positionFetchInterval = 100;
const movingsFetchInterval = 1000;

export interface Position {
  x: number;
  y: number;
  height?: number;
  zoom?: number;
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

  // for preset preview mode (not live)
  private blockUpdates : boolean = false;
  // for preset mh disabeling
  private disabledMovingHeads: Array<string> = new Array<string>();

  constructor(private http: HttpClient) {
    this.fetchMovings();
  }

  // fetch mhs every 10s
  private async fetchMovings() {
    await this.http.get('http://' + ip + ':3000/movingHeads').pipe(catchError(handleError)).subscribe((data) => this.movingHeads = this.sort(data)) // don't update yet, wait for positions

    setInterval(() => {
      this.http.get('http://' + ip + ':3000/movingHeads').pipe(catchError(handleError)).subscribe((data) => {
        data = this.sort(data);
        if(JSON.stringify(data) === JSON.stringify(this.movingHeads)) return;
        this.movingHeads = data;
        this.movingsStream.next(this.movingHeads);
      });
    }, movingsFetchInterval);
    
    this.fetchPositions();
  }

  private sort(mhs : any) : any {
    return mhs.sort(function (a : any, b : any) {
      if (a.name < b.name)  return -1;
      if (a.name > b.name)  return  1;
                            return  0;
                              // TODO null all properties, which shouldn't cause rerender (Depends on what to show in settings)
    }).map((mh : any) => ({...mh, position : {}, values: [], home: {}}));
  }

  // fetch every 100ms
  // TODO cache serverside and don't assamble data every time!!
  private fetchPositions() {
    // update Movings Heads once first positions received
    this.http.get('http://' + ip + ':3000/movingHeads/positions').pipe(catchError(handleError)).subscribe((data) => {
      this.mergePositions(data);
      this.movingsStream.next(this.movingHeads);
    });    
    
    // TODO fetch only when change occured (changed ID)
    setInterval(() => {
      this.http.get('http://' + ip + ':3000/movingHeads/positions').pipe(catchError(handleError)).subscribe(this.mergePositions.bind(this));
    }, positionFetchInterval);
  }

  private mergePositions(data: any): boolean {
    let changes: boolean = false;

    data.forEach(({ id, position }: { id: string, position: Position }) => {
      // for preset preview mode
      if(this.blockUpdates && !this.isDisabled(id)) return;

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

    return changes;

    // if changes occured, update display by Observable
    // if (changes) this.movingsStream.next(this.movingHeads);
  }

  // submit position updates
  private submitPosition(id: string, position: Position, tempPositon: Position) {
    // cooldown for multiple changes on same mh
    if (this.cooldownMHs.includes(id)) return;
    this.cooldownMHs.push(id);

    // update DB
    this.http.put('http://' + ip + ':3000/movingHeads/position/' + id, { position: position }, { responseType: 'text' }).pipe(catchError(handleError)).subscribe(() => { this.submitedPositions.set(id, tempPositon) });

    // enable cooldown
    setTimeout(() => {
      // remove from cooldown
      this.cooldownMHs = this.cooldownMHs.filter((id) => id !== id);
      // if change has occured -> resubmit
      if (JSON.stringify(this.tempPositions.get(id)) !== JSON.stringify(position)) {
        // TODO BAD: overides height, even if not updated
        this.submitPosition(id, this.tempPositions.get(id), this.tempPositions.get(id));
        // console.log("resubmit");
      }
      // console.log("reseted " + id)
    }, mhUpdateCooldown);
  }

  // get positions as Observable
  public getMovings(): Observable<any> {
    return this.movingsStream.asObservable();
  }

  public forceUpdate() : void {
    if(this.movingHeads)
      this.movingsStream.next(this.movingHeads);
  }

  public getPositions() {
    return this.tempPositions;
  }

  public getPosition(id: string) : Position {
    return this.tempPositions.get(id) || {x: 0, y: 0, height: 0, zoom: 0};
  }

  // TODO combine x y z heigt zoom into position attribute -> check that its updating correctly (instances)
  public setPosition(id: string, p: Position, update: boolean = true) {
    // for preset preview
    if(this.blockUpdates && update) return;

    let position: Position = {...p};
    // console.log(position)

    // if not specified, set height to old one for local use
    let tempPosition: Position = position;
    if(tempPosition.height === undefined)
      tempPosition.height = this.tempPositions.get(id).height;
    if(tempPosition.zoom === undefined)
      tempPosition.zoom = this.tempPositions.get(id).zoom;

    // update position in temp data
    this.tempPositions.set(id, tempPosition);
  	
    if(update) this.submitPosition(id, position, tempPosition);
  }

  public getHeight(id: string) : number {
    if(!this.getPosition(id)) return 0;
    return this.getPosition(id).height || 0;
  }

  public setHeight(id: string, height: number) {
    let position = {...this.tempPositions.get(id)};
    position.height = height;
    this.setPosition(id, position);
  }

  public getZoom(id: string) : number {
    if(!this.getPosition(id)) return 0;
    return this.getPosition(id).zoom || 0;
  }

  public setZoom(id: string, zoom: number) {
    let position = {...this.tempPositions.get(id)};
    position.zoom = zoom;
    this.setPosition(id, position);
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
    this.http.put('http://' + ip + ':3000/movingHeads/home/' + id, { position: this.getPosition(id) }, { responseType: 'text' }).pipe(catchError(handleError)).subscribe();
  }

  public home() {
    for(let mh of this.movingHeads) {
      this.http.get('http://' + ip + ':3000/movingHeads/home/' + mh.mhId, { responseType: 'text' }).pipe(catchError(handleError)).subscribe();
    } 
  }

  // for preset preview mode:
  public disableUpdates(block: boolean) {
    if(this.blockUpdates && !block) {
      // reset positions
      // console.log("reset data")
      this.tempPositions = new Map<string, Position>();
      this.submitedPositions = new Map<string, Position>();
    }
    this.blockUpdates = block;
  }

  public loadPositions(positions : Map<string, Position>, update = true) {
    if(!positions) return;

    for(let [mhId, position] of positions) {
      this.setPosition(mhId, position, update)
    }
  }

  // for disabeling moving heads in presets
  public disableMovingHeads(positions: Map<string, Position>) {
    if(!positions) return;
    this.movingHeads.forEach((mh: any) => this.disableMovingHead(mh.mhId, !positions.has(mh.mhId)));
  }

  public disableMovingHead(mhId : string, disable : boolean) {
    if(disable && !this.disabledMovingHeads.includes(mhId)) this.disabledMovingHeads.push(mhId);
    else if(!disable && this.disabledMovingHeads.includes(mhId)) this.disabledMovingHeads = this.disabledMovingHeads.filter((id) => id !== mhId);
  }
  
  public enableAll() {
    this.disabledMovingHeads = [];
  }

  public isDisabled(mhId : string) : boolean {
    return this.disabledMovingHeads.includes(mhId)
  }

  public getEnabledMovingHeads() : Array<any> {
    return this.movingHeads.filter((mh:any) => !this.disabledMovingHeads.includes(mh.mhId));
  }

  public getPresetPositions() : Map<string, Position> {
    let positions = new Map<string, Position>();
    for(let mh of this.getEnabledMovingHeads())
      positions.set(mh.mhId, this.getPosition(mh.mhId));
    return positions;
  }
}