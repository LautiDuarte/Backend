import { Game } from '../game/game.entity.js'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Entity, Property, Cascade, OneToMany, Collection } from '@mikro-orm/core'

@Entity()
export class GameType extends BaseEntity{
    @Property({nullable:false, unique:true})
    name!: string

    @Property({nullable:false})
    description!: string   
    
    @OneToMany(() => Game, (game) => game.gameType, {
    cascade: [Cascade.ALL],
    })
    games = new Collection<Game>(this)
}