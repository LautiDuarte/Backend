import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Cascade, Collection, Entity, ManyToMany, OneToMany, Property } from '@mikro-orm/core'
import { Team } from '../team/team.entity.js'
import { Competition } from '../competition/competition.entity.js'

@Entity()
export class User extends BaseEntity{
    @Property({nullable:false})
    name!: string

    @Property({nullable:false})
    lastName!: string

    @Property({nullable:false, unique: true})
    alias!: string

    @Property({nullable:false, unique: true})
    email!: string

    @Property({nullable:false})
    password!: string

    @ManyToMany(() => Team, (team) => team.players, {
        cascade: [Cascade.ALL],
        owner: true,
        nullable: true
    })
    teams = new Collection<Team>(this)

    //revisar como crear la competicion:
    @OneToMany(() => Competition, (competition) => competition.userCreator, {
        cascade: [Cascade.ALL],
        nullable: true
    })
    competitionsCreated = new Collection<Competition>(this)
}