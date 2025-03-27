import {Entity, PrimaryGeneratedColumn, Column} from "typeorm"

@Entity()
export class Assistant {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    assistant_id: string
}