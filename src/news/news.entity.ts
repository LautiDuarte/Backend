import { ObjectId } from 'mongodb';
import crypto from 'node:crypto'

export class News{
  constructor(
    public title: string,
    public body: string,
    public _id?: ObjectId
  ){}

}