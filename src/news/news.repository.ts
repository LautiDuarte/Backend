import { Repository } from '../shared/repository.js'
import { News } from './news.entity.js'
import { db } from '../shared/db/conn.js'
import { ObjectId } from 'mongodb'
import { after } from 'node:test'

const news = db.collection<News>('news')

export class NewsRepository implements Repository<News> {
  public async findAll(): Promise<News[] | undefined> {
    return await news.find().toArray()
  }

  public async findOne(item: { id: string }): Promise<News| undefined> {
    const _id = new ObjectId(item.id)
    return (await news.findOne({_id})) || undefined
  }

  public async add(item: News): Promise<News | undefined> {
    item._id = (await news.insertOne(item)).insertedId
    return item
  }

  public async update(id: string, item: News): Promise<News | undefined> {
    const _id = new ObjectId(id)
    return (await news.findOneAndUpdate({_id},{$set:item},{returnDocument:'after'})) || undefined
  }

  public async delete(item: { id: string }):  Promise<News | undefined> {
    const _id = new ObjectId(item.id)
    return (await news.findOneAndDelete({_id})) || undefined 
  }
}