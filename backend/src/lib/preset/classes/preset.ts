import { Position } from "src/lib/movingHead/classes/position";
import { PresetDto } from "../dto/preset.dto";

export class Preset {
    private presetId : string;
    private name : string;
    private positions : Map<string, Position> = new Map<string, Position>();
    
    toJSON(): any {
        return {
            presetId: this.presetId,
            name: this.name,
            positions: Object.fromEntries(this.positions),
        }
    }

    constructor(preset : PresetDto) {
       this.presetId = preset._id;
       this.name = preset.name;
       this.positions = preset.positions;
    }

    public isValid(): boolean {
        return !!this.presetId && this.name !== '' && this.positions && this.positions.size > 0;
    }

    public isEqualToPreset(preset: PresetDto): boolean {
        return  this.presetId === preset._id && this.name === preset.name && JSON.stringify(Array.from(this.positions.entries())) === JSON.stringify(Array.from(preset.positions.entries()));
    }

    public getPresetId(): string {
        return this.presetId;
    }

    public getPositions(): Map<string, Position> {
        return this.positions;
    }
}