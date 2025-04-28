import { Game } from '../game/game.entity.js'
import { Region } from '../region/region.entity.js'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Cascade, Collection, DateTimeType, Entity, ManyToOne, OneToMany, Property, Rel } from '@mikro-orm/core'
import { User } from '../user/user.entity.js'
import { Inscription } from '../inscription/inscription.entity.js'
import { Team } from '../team/team.entity.js'

@Entity()
export class Competition extends BaseEntity{
    @Property({
        nullable:false
    })
    name!: string

    @Property({
        type: DateTimeType,
        nullable:true
    })
    dateStart!: Date

    @Property({
        type: DateTimeType,
        nullable:true
    })
    dateEnd!: Date

    @Property({
        type: DateTimeType,
        nullable:false})
    dateInscriptionLimit!: Date

    @ManyToOne(() => Team, {
        nullable: true 
    })
    winner!: Rel<Team>

    @ManyToOne(() => Game, {
        nullable: false 
    })
    game!: Rel<Game>

    @ManyToOne(() => Region, {
        nullable: false 
    })
    region!: Rel<Region>

    @ManyToOne(() => User, {
        nullable: false 
    })
    userCreator?: Rel<User>

    @OneToMany(() => Inscription, (inscription) => inscription.competition, {
        cascade: [Cascade.ALL],
        nullable: true,
    })
    registrations? = new Collection<Inscription>(this)
}