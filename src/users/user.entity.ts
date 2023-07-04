import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Report } from '../reports/report.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Report, report => report.user)
  reports: Report[];
}
