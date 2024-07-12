//import { ObjectId } from 'mongodb';
import { BaseEntity } from "../shared/db/baseEntity.entity.js"; 
import { Entity, Property, Cascade } from '@mikro-orm/core'

@Entity()
export class Region extends BaseEntity{
    @Property({nullable:false, unique:true})	
    name!: string
    
    @Property({nullable:false})	
    description!: string
}