import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Cascade, Collection, Entity, ManyToMany, OneToMany, ManyToOne, Property, Rel } from '@mikro-orm/core'
import { User } from '../user/user.entity.js'
import { Inscription } from '../inscription/inscription.entity.js'
import { Match } from '../match/match.entity.js'

@Entity()
export class Team extends BaseEntity{
    @Property({
        nullable:false, 
        unique:true
    })
    name!: string

    @ManyToOne(() => User, {
        nullable: false 
    })
    userCreator?: Rel<User>

    @ManyToMany(() => User, (user) => user.teams)
    players = new Collection<User>(this)

    @ManyToMany(() => Match, (match) => match.teams, {
        cascade: [Cascade.ALL],
        owner: true,
        nullable: true,
    })
    matches = new Collection<Team>(this);

    @OneToMany(() => Inscription, (inscription) => inscription.team, {
        cascade: [Cascade.ALL],
        nullable: true,
    })
    registrations = new Collection<Inscription>(this)
}