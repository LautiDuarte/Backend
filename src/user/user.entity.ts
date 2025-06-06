import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import {
  Cascade,
  Collection,
  DateTimeType,
  Entity,
  ManyToMany,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { Team } from '../team/team.entity.js';
import { Competition } from '../competition/competition.entity.js';
import { Enum } from '@mikro-orm/core';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User extends BaseEntity {
  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false })
  lastName!: string;

  @Property({ nullable: false, unique: true })
  userName!: string;

  @Property({ nullable: false, unique: true })
  email!: string;

  @Property({ nullable: false })
  password!: string;

  @Property({ nullable: true })
  resetPasswordToken?: string;

  @Property({ nullable: true })
  resetPasswordExpires?: Date;

  @Property({ nullable: true })
  iconUrl!: string;

  @Property({ type: DateTimeType })
  createdAt? = new Date();

  @Property({ type: DateTimeType, onUpdate: () => new Date() })
  updatedAt? = new Date();

  @ManyToMany(() => Team, (team) => team.players, {
    cascade: [Cascade.ALL],
    owner: true,
    nullable: true,
  })
  teams = new Collection<Team>(this);

  //revisar como crear la competicion:
  @OneToMany(() => Competition, (competition) => competition.userCreator, {
    cascade: [Cascade.ALL],
    nullable: true,
  })
  competitionsCreated = new Collection<Competition>(this);

  @Enum({ items: () => UserRole, default: UserRole.USER })
  role: UserRole = UserRole.USER;
}
