import { Game } from '../game/game.entity.js'
import { Region } from '../region/region.entity.js'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Cascade, Collection, DateTimeType, Entity, ManyToMany, ManyToOne, OneToMany, Property, Rel } from '@mikro-orm/core'
import { User } from '../user/user.entity.js'
import { Inscription } from '../inscription/inscription.entity.js'

@Entity()
export class Competition extends BaseEntity{
    @Property({
        nullable:false, 
        unique:true
    })
    name!: string

    @Property({
        nullable:false
    })
    type!: string


    @Property({
        type: DateTimeType,
        nullable:false
    })
    dateStart!: Date

    @Property({
        type: DateTimeType,
        nullable:false})
    dateEnding!: Date

    @ManyToOne(() => Game, {
        nullable: false 
    })
    game!: Rel<Game>

    @ManyToOne(() => Region, {
        nullable: false 
    })
    region!: Rel<Region>


    //revisar como crear la competicion:
    @ManyToOne(() => User, {
        nullable: false 
    })
    userCreator!: Rel<User>

    @OneToMany(() => Inscription, (inscription) => inscription.competition, {
        cascade: [Cascade.ALL],
        nullable: true
    })
    registrations = new Collection<Inscription>(this)
}