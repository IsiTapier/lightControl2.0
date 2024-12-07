import { DMXDevice } from "../../device/classes/dmxDevice";
import { STAGE_HEIGHT, STAGE_X, STAGE_Y } from "../../settings";
import { Position } from "./position";
import { ChannelType } from "../../device/types/channelType";
import { MovingHeadDto } from "../dto/movingHead.dto";
import { DMXService } from "src/lib/dmx/dmx.service";

export class MovingHead extends DMXDevice {
    private mhId : string;
    private xOff : number;
    private yOff : number;
    private heightOff : number;
    private panOff : number;
    private tiltOff : number;
    private maxPan : number;
    private maxTilt : number;
    private home : Position = {x: 0, y : 0, height : 0, zoom : 0};
    private position : Position;

    public constructor(mh : MovingHeadDto) {
        super(mh.device);

        this.mhId = mh._id.toString();
        this.xOff = mh.xOff;
        this.yOff = mh.yOff;
        this.heightOff = mh.heightOff;
        this.panOff = mh.panOff;
        this.tiltOff = mh.tiltOff; // smallest DMX value where mh 
        this.maxPan = mh.maxPan;
        this.maxTilt = mh.maxTilt;
        this.home = mh.home;
    }

    public isEqualToMh(mh: MovingHeadDto): boolean {
        return  this.isEqualTo(mh.device) &&
                this.mhId === mh._id &&
                this.xOff === mh.xOff &&
                this.yOff === mh.yOff &&
                this.heightOff === mh.heightOff &&
                this.panOff === mh.panOff &&
                this.tiltOff === mh.tiltOff &&
                this.maxPan === mh.maxPan &&
                this.maxTilt === mh.maxTilt &&
                JSON.stringify(this.home)===JSON.stringify(mh.home)   // TODO not working with ID (for Database)
    }

    public initMh() : void {
        // this.init(false);    // already called from device service
        this.setPosition(this.home, false, true); // TODO check update
    }

    public setMhId(id : string) : void {
        this.mhId = id;
    }

    public getMhId() : string {
        return this.mhId;
    }

    public getPosition() : Position {
        return this.position;
    }

    public goHome() : void {
        this.setPosition(this.home, true); // TODO check update
    }

    public getHome() : Position {
        return this.home;
    }

    public setHome(newHome : Position = null) : void {  // IMPORTANT: DB update only via call from movingHeadService
        if(!newHome) this.home = {...this.getPosition()};
        else this.home = newHome;
    }

    public setPosition(position : Position, update : boolean = true, force : boolean = false) : void {
        this.updatePos(position, update, force);
        this.position = {...position};
    }

    /*public setXY(x : number, y : number, update : boolean = false) : void {
        this.updatePos(x, y, this.height, update);
        this.x = x;
        this.y = y;
    }

    public addXY(x : number, y : number, update : boolean = false) : void {
        this.setXY(this.x+x, this.y+y, update);
    }
        
    public setHeight(height : number, update : boolean = false) : void {
        if(height < 0) height = 0;
        this.updatePos(this.x, this.y, height, update);
        this.height = height;
    }*/

    private updatePos(p: Position, update : boolean = false, force : boolean = false) : void {
        let hasChanged = false;
        if(force || this.calculatePan(p.x, p.y) !== this.calculatePan(this.position.x, this.position.y)) // force update for init
            hasChanged = this.writeType(ChannelType.Pan, this.calculatePan(p.x, p.y), false).includes('STATUS');
        if(force || this.calculateTilt(p.x, p.y, p.height) !== this.calculateTilt(this.position.x, this.position.y, this.position.height))
            hasChanged = this.writeType(ChannelType.Tilt, this.calculateTilt(p.x, p.y, p.height), false).includes('STATUS') || hasChanged;
        if(force || p.zoom !== this.position.zoom)
            hasChanged = this.writeType(ChannelType.Zoom, p.zoom, false).includes('STATUS') || hasChanged;
        if(update && hasChanged) DMXService.update();
    }

    private calculatePan(x : number, y : number) : number {
        x-=this.xOff;
        y-=this.yOff;
        let yPan = y===0?90:Math.abs(Math.atan(x/y)*180/Math.PI);
        let pan = Math.round((255/(this.maxPan/360.))*(1-(y<0?(x>0?(360-yPan):(yPan)):(x>0?(180+yPan):(180-yPan)))/360.)-this.panOff);
        return pan;
    }

    private calculateTilt(x : number, y : number, height : number) : number {
        if(height < 0) height = 0;
        x-=this.xOff;
        y-=this.yOff;
        // TODO check if use of TILT offset correct 
        // TODO check if float types are used
        let alpha = Math.atan(Math.sqrt(Math.pow(y,2)+Math.pow(x,2))/(this.heightOff-height-((y>STAGE_Y-this.yOff&&Math.abs(x+this.xOff)<STAGE_X)?STAGE_HEIGHT:0))*1.)*180/Math.PI;

        // Eigentlich müsste es so sein:  TODO überprüfen
        // let offset = this.tiltOff - (this.maxTilt-180)/2./this.maxTilt*255
        // let center = 127.5+offset;
        let center = 127.5;
        let tilt = Math.round(center-(center-this.tiltOff)*alpha/90.);
        return tilt;
    }
}