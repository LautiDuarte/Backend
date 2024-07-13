import { Competition } from "../competition/competition.entity.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"; 
import { Entity, Property, Cascade, OneToMany, Collection } from '@mikro-orm/core'

@Entity()
export class Region extends BaseEntity{
    @Property({nullable:false, unique:true})	
    name!: string
    
    @Property({nullable:false})	
    description!: string

    @OneToMany(() => Competition, (competition) => competition.region, {
    cascade: [Cascade.ALL],
    })
    competitions = new Collection<Competition>(this)
}