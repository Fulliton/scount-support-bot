import { Entity, PrimaryGeneratedColumn, Column} from "typeorm"

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    chat_id: number

    @Column({ nullable: true })
    thread_id: string|null

    @Column({ nullable: true })
    assistant_id: string|null

    @Column({ nullable: true })
    file_id: string|null

    @Column({ nullable: true })
    vector_store_id: string|null
}