import { ObjectId } from 'mongodb';

export class Region{
  constructor(
    public name: string,
    public description: string,
    public _id?: ObjectId
  ){}

}