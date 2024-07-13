import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core'
import { User } from '../user/user.entity.js'
import { Competition } from '../competition/competition.entity.js'

@Entity()
export class Team extends BaseEntity{
    @Property({nullable:false, unique:true})
    name!: string

    @ManyToMany(() => User, (user) => user.teams)
    players = new Collection<User>(this)

    @ManyToMany(() => Competition, (competition) => competition.teams)
    competitions = new Collection<Competition>(this)
}