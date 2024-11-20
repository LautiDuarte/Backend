import { Competition } from '../competition/competition.entity.js'
import { GameType } from '../gameType/gameType.entity.js'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Entity, Property, ManyToOne, Rel, OneToMany, Cascade, Collection } from '@mikro-orm/core'

@Entity()
export class Game extends BaseEntity{
    @Property({
        nullable:false, 
        unique:true
    })
    name!: string

    @Property({
        nullable:false
    })
    description!: string

    @Property({
        nullable:true
    })
    imageUrl!: string
    
    @ManyToOne(() => GameType, { 
        nullable: false 
    })
    gameType!: Rel<GameType>

    @OneToMany(() => Competition, (competition) => competition.game, {
        cascade: [Cascade.ALL],
        nullable: true
    })
    competitions = new Collection<Competition>(this)
}