import { ObjectId } from 'mongodb'

export class News{
  constructor(
    public title: string,
    public body: string,
    public _id?: ObjectId
  ){}

}