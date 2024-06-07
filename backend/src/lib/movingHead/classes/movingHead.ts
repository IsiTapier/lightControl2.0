import { DMXService } from "src/lib/dmx/dmx.service";
import { DMXDevice } from "../../device/classes/dmxDevice";
import { STAGE_HEIGHT, STAGE_X, STAGE_Y } from "../../settings";
import { Position } from "../interfaces/position";
import { DeviceType } from "../../device/types/deviceType";
import { ChannelType } from "../../device/types/channelType";
import { Channel } from "../../device/classes/channel";

export class MovingHead extends DMXDevice {
    private static current_mh_id = 1;

    private mhId : number;
    private xOff : number;
    private yOff : number;
    private heightOff : number;
    private panOff : number;
    private tiltOff : number;
    private maxPan : number;
    private maxTilt : number;

    private home : Position = {x: 0, y : 0, height : 0};

    private x : number = 0;
    private y : number = 0;
    private height : number = 0;
    
    public constructor(xOff : number, yOff : number, heightOff : number, panOff : number, tiltOff : number, maxPan : number, maxTilt : number, name : string, address : number, /*universe : number,*/ channels : Channel[]) {
        super(name, DeviceType.MovingHead, address, channels)
        if(!this.getDeviceId()) return;

        this.mhId = MovingHead.current_mh_id++;
        this.xOff = xOff;
        this.yOff = yOff;
        this.heightOff = heightOff;
        this.panOff = panOff;
        this.tiltOff = tiltOff; // smallest DMX value where mh 
        this.maxPan = maxPan;
        this.maxTilt = maxTilt;
    }

    public initMh() {
        this.updatePos(this.x, this.y, this.height, true); // use homepoint
    }

    public getMhId() : number {
        return this.mhId;
    }

    public getPosition() : Position {
        return {x: this.x, y: this.y, height: this.height};
    }

    public setHome() {
        this.home = this.getPosition();
        // TODO DB store
    }

    public setPosition(position : Position) {
        this.setXY(position.x, position.y);
        this.setHeight(position.height);
    }

    public setXY(x : number, y : number) {
        this.updatePos(x, y);
        this.x = x;
        this.y = y;
    }

    public addXY(x : number, y : number) {
        this.setXY(this.x+x, this.y+y);
    }

    public setHeight(height : number) {
        if(height < 0) height = 0;
        this.updatePos(this.x, this.y, height);
        this.height = height;
    }

    private updatePos(x : number = this.x, y : number = this.y, height : number = this.height, update : boolean = false) {
        if(update || this.calculatePan(x, y) != this.calculatePan(this.x, this.y))
            this.writeType(ChannelType.Pan, this.calculatePan(x, y));
        if(update || this.calculateTilt(x, y, height) != this.calculateTilt(this.x, this.y, this.height))
            this.writeType(ChannelType.Tilt, this.calculateTilt(x, y, height));
        // if(update || true) DMXService.update();  // TODO update or not? neccessary?
    }


    private calculatePan(x : number, y : number) {
        x-=this.xOff;
        y-=this.yOff;
        let yPan = y==0?90:Math.abs(Math.atan(x/y)*180/Math.PI);
        let pan = Math.round(255/(this.maxPan/360.)*(1-(y<0?(x>0?(360-yPan):(yPan)):(x>0?(180+yPan):(180-yPan)))/360.-this.panOff));
        return pan;
    }

    private calculateTilt(x : number, y : number, height : number) {
        if(height < 0) height = 0;
        x-=this.xOff;
        y-=this.yOff;
        // TODO check if use of TILT offset correct 
        // TODO check if float types are used
        let alpha = Math.atan(Math.sqrt(Math.pow(y,2)+Math.pow(x,2))/(this.heightOff-height*2-(y>STAGE_Y-this.yOff&&Math.abs(x+this.xOff)<STAGE_X?STAGE_HEIGHT:0))*1.)*180/Math.PI;
        // Eigentlich müsste es so sein:  TODO überprüfen
        // let offset = this.tiltOff - (this.maxTilt-180)/2./this.maxTilt*255
        // let center = 127.5+offset;
        let center = 127.5;
        let tilt = Math.round(center-(center-this.tiltOff)*alpha/90.);
        return tilt;
    }

}