import { Competition } from '../competition/competition.entity.js'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Cascade, Entity, ManyToOne, Property, Rel } from '@mikro-orm/core'
import { Team } from '../team/team.entity.js'

@Entity()
export class Inscription extends BaseEntity{
    @Property({ nullable: false })
    date!: string

    @Property({ nullable: false})
    status!: string

    @ManyToOne(() => Competition, { nullable: false })
    competition!: Rel<Competition>

    @ManyToOne(() => Team, { nullable: false })
    team!: Rel<Team>
}