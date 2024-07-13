import { Game } from '../game/game.entity.js'
import { Region } from '../region/region.entity.js'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Cascade, Collection, DateTimeType, Entity, ManyToMany, ManyToOne, OneToMany, Property, Rel } from '@mikro-orm/core'
import { Team } from '../team/team.entity.js'
import { User } from '../user/user.entity.js'
import { Inscription } from '../inscription/inscription.entity.js'

@Entity()
export class Competition extends BaseEntity{
    @Property({nullable:false, unique:true})
    name!: string

    @Property({nullable:false})
    type!: string

    //revisar la declaracion de estas fechas, ni idea si esta bien
    /*
    @Property({type: DateTimeType})
    dateStart!: Date

    @Property({type: DateTimeType})
    dateEnding!: Date
    */

    @ManyToOne(() => Game, { nullable: false })
    game!: Rel<Game>

    @ManyToOne(() => Region, { nullable: false })
    region!: Rel<Region>

    @ManyToMany(() => Team, (team) => team.competitions, {
    cascade: [Cascade.ALL],
    owner: true,
    })
    teams!: Team[]

    //revisar como crear la competicion:
    @ManyToOne(() => User, { nullable: false })
    userCreator!: Rel<User>

    @OneToMany(() => Inscription, (inscription) => inscription.competition, {
    cascade: [Cascade.ALL],
    })
    registrations = new Collection<Inscription>(this)
}