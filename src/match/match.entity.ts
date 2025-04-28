import { Competition } from '../competition/competition.entity.js'
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

  @Property({
      nullable: false
    })
    round!: string                              // Representa la etapa de la ronda (Octavos, Cuartos, Semifinales, Finales)

  @ManyToOne(() => Competition, { 
        nullable: false,
        deleteRule: 'cascade'
    })
    competition!: Rel<Competition>

  @ManyToMany(() => Team, (team) => team.matches)
    teams = new Collection<Team>(this)
}