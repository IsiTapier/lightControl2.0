import { Owner } from "src/lib/cat/schemas/owner.schema";

export class CreateCatDto {
    readonly name: string;
    readonly age: number;
    readonly breed: string;
    readonly owner: Owner;
  }