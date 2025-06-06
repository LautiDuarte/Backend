import { Competition } from '../competition/competition.entity.js'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Cascade, DateTimeType, Entity, ManyToOne, Property, Rel } from '@mikro-orm/core'
import { Team } from '../team/team.entity.js'

@Entity()
export class Inscription extends BaseEntity{
    @Property({
        type: DateTimeType,
        onCreate: () => new Date(),
        nullable: false
    })
    date = new Date()

    @Property({ nullable: false})
    status!: string

    @ManyToOne(() => Competition, { 
        nullable: false,
        deleteRule: 'cascade'
    })
    competition!: Rel<Competition>

    @ManyToOne(() => Team, { 
        nullable: false,
        deleteRule: 'cascade'
    })
    team!: Rel<Team>
}