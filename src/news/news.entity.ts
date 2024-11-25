import { DateTimeType, Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Timestamp } from 'mongodb'

@Entity()
export class News extends BaseEntity{
  @Property({nullable:false})
  title!: string
    
  @Property({nullable:false})
  body!: string

  @Property({nullable:true})
  imageUrl!: string

  @Property({ type: DateTimeType, onCreate: () => new Date() })
  date? = new Date()
}