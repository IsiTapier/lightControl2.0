import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from './schemas/cat.schema';
import { CatsService } from './cats.service';
import { Owner, OwnerSchema } from './schemas/owner.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]), MongooseModule.forFeature([{ name: Owner.name, schema: OwnerSchema }])],
    controllers: [],
    providers: [CatsService],
    exports: [CatsService]
})
export class CatsModule {}
