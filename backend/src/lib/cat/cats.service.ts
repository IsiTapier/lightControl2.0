import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cat, CatDocument } from './schemas/cat.schema';
import { CreateCatDto } from './dto/create-cat.dto';
import { Owner, OwnerDocument } from './schemas/owner.schema';

@Injectable()
export class CatsService {
  constructor(@InjectModel(Cat.name) private catModel: Model<CatDocument>, @InjectModel(Owner.name) private ownerModel: Model<OwnerDocument>) {}

  async create(createCatDto: CreateCatDto) {
    const createdOwner = new this.ownerModel(createCatDto.owner);
    await createdOwner.save();
    console.log("test");
    console.log(createdOwner);
    const createdCat = new this.catModel(createCatDto);
    console.log(createdCat);
    createdCat.owner = createdOwner;
    console.log(createdCat);
    await createdCat.save();
    console.log(createdCat);   
    
    const cats = await this.catModel.findOne({ name: 'test' }).populate('owner', '', this.ownerModel).exec();
        console.log('cats ',cats);
  }
  
  async findAll(): Promise<Cat[]> {
    return this.catModel.find().populate('owner', '', this.ownerModel).exec();
  } 
}