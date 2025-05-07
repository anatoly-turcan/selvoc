import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { PropertiesOf } from '@common/utils';
import { User, UserKeycloakData } from '@modules/user/domain';

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
    const { createdAt, updatedAt, ...commonProps } = this;

    return new User({ ...commonProps, timestamps: { createdAt, updatedAt } });
  }

  public static fromDomain(entity: User): UserTypeormEntity {
    const { timestamps, ...commonProps } = entity;

    return new UserTypeormEntity({ ...commonProps, ...timestamps });
  }
}
