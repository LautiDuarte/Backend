import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Cascade, Collection, Entity, ManyToMany, OneToMany, Property } from '@mikro-orm/core'
import { User } from '../user/user.entity.js'
import { Inscription } from '../inscription/inscription.entity.js'

@Entity()
export class Team extends BaseEntity{
    @Property({
        nullable:false, 
        unique:true
    })
    name!: string

    @ManyToMany(() => User, (user) => user.teams)
    players = new Collection<User>(this)


    @OneToMany(() => Inscription, (inscription) => inscription.team, {
        cascade: [Cascade.ALL],
        nullable: true
    })
    registrations = new Collection<Inscription>(this)
}