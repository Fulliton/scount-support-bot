import { Entity, PrimaryGeneratedColumn, Column} from "typeorm"

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    chat_id: number

    @Column({ nullable: true })
    thread_id: string|null

    @Column({ nullable: true })
    assistant_id: string|null
}