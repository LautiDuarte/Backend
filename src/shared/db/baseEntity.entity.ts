import { PrimaryKey, DateTimeType, Property } from '@mikro-orm/core'

export abstract class BaseEntity {
  @PrimaryKey()
  id?: number

  /*

  @Property({ 
    type: DateTimeType 
    onCreate: () => new Date()
    })
  createdAt? = new Date()

  @Property({
    type: DateTimeType,
    onUpdate: () => new Date()
  })
  updatedAt? = new Date()

  */
}