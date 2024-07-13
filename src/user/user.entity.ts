import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Cascade, Collection, Entity, ManyToMany, OneToMany, Property } from '@mikro-orm/core'
import { Team } from '../team/team.entity.js'
import { Competition } from '../competition/competition.entity.js'

@Entity()
export class User extends BaseEntity{
    @Property({nullable:false, unique:true})
    name!: string

    @Property({nullable:false})
    lastName!: string

    @Property({nullable:false})
    alias!: string

    @Property({nullable:false})
    email!: string

    @Property({nullable:false})
    password!: string

    @ManyToMany(() => Team, (team) => team.players, {
    cascade: [Cascade.ALL],
    owner: true,
    })
    teams!: Team[]

    //revisar como crear la competicion:
    @OneToMany(() => Competition, (competition) => competition.userCreator, {
    cascade: [Cascade.ALL],
    })
    competitionsCreated = new Collection<Competition>(this)
}