import { PropertiesOf } from '@bobo/common';
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { User, UserKeycloakData } from '../../../domain/entities';

@Entity('users')
export class UserTypeormEntity {
  @PrimaryColumn('uuid')
  public id: string;

  @Column('varchar', { unique: true })
  public username: string;

  @Column('varchar', { nullable: true })
  public email: string | null;

  @Column('varchar', { nullable: true })
  public firstName: string | null;

  @Column('varchar', { nullable: true })
  public lastName: string | null;

  @Column('jsonb', { nullable: false })
  public keycloakData: UserKeycloakData;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  public updatedAt: Date;

  constructor(params?: PropertiesOf<UserTypeormEntity>) {
    if (params) {
      this.id = params.id;
      this.username = params.username;
      this.email = params.email;
      this.firstName = params.firstName;
      this.lastName = params.lastName;
      this.keycloakData = params.keycloakData;
      this.createdAt = params.createdAt;
      this.updatedAt = params.updatedAt;
    }
  }

  public toDomain(): User {
    return new User(this);
  }

  public static fromDomain(entity: User): UserTypeormEntity {
    return new UserTypeormEntity(entity);
  }
}
