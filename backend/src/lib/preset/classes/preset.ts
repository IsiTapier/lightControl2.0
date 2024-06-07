import { MovingHead } from "src/lib/movingHead/classes/movingHead";
import { Position } from "src/lib/movingHead/interfaces/position";

export class Preset {
    private static current_preset_id = 0;

    private presetId : number;
    private positions : Map<MovingHead, Position> = new Map<MovingHead, Position>();
    
    constructor(ids : number[]) {
        for(let id of ids) { // TODO
            // if(DeviceManager.getDevice(id).getType() !== DeviceType.MovingHead) continue;
            // TODO check if Device array can contain MovingHead object
            let movingHead; // = DeviceManager.getDevice(id);
            this.positions.set(movingHead, movingHead.getPositon());
        }
        if(this.positions.size === 0) return null;
        this.presetId = Preset.current_preset_id++;
    }

    public getPresetId() {
        return this.presetId;
    }

    public load() {
        for(let mh of this.positions.keys()) 
            mh.setPosition(this.positions.get(mh));
    }

}