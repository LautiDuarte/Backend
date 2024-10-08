import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class News extends BaseEntity{
  @Property({nullable:false})
  title!: string
    
  @Property({nullable:false})
  body!: string

  @Property({nullable:true})
  image!: string
}