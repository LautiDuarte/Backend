import { Competition } from '../competition/competition.entity.js'
import { Round } from '../round/round.entity.js'
import { Team } from '../team/team.entity.js'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import {  Entity, Collection, ManyToMany, ManyToOne, Property, Rel } from '@mikro-orm/core'

@Entity()
export class Match extends BaseEntity{

  @Property({
        type: Date,
        nullable: false
    })
    matchDate!: Date

  @ManyToOne(() => Competition, { 
        nullable: false,
        deleteRule: 'cascade'
    })
    competition!: Rel<Competition>

  @ManyToOne(() => Round, { 
        nullable: false,
        deleteRule: 'cascade'
    })
    round!: Rel<Competition>

  @ManyToMany(() => Team, (team) => team.matches)
    teams = new Collection<Team>(this)
}