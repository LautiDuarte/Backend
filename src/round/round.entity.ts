import { Competition } from '../competition/competition.entity.js'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import {  Entity, ManyToOne, Property, Rel } from '@mikro-orm/core'

@Entity()
export class Round extends BaseEntity{

  @ManyToOne(() => Competition, { 
        nullable: false,
        deleteRule: 'cascade'
    })
    competition!: Rel<Competition>

  @Property({
      nullable:false
    })
    nro_round!: number
}