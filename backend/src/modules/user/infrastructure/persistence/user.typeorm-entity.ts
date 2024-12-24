import { UserKeycloakData } from '@modules/user/domain';
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserTypeormEntity {
  @PrimaryColumn('uuid')
  public id: string;

  @Column({ unique: true })
  public username: string;

  @Column('varchar', { nullable: true })
  public email: string | null;

  @Column('varchar', { nullable: true })
  public firstName: string | null;

  @Column('varchar', { nullable: true })
  public lastName: string | null;

  @Column('jsonb', { nullable: false })
  public keycloakData: UserKeycloakData;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(params?: UserTypeormEntity) {
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
}
