import { Entity, PrimaryGeneratedColumn, Column} from "typeorm"

@Entity()
export class Tobacco {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    chat_id: number

    @Column()
    name: string

    // Вкус до 10
    @Column()
    taste: number

    // Время курения
    @Column()
    smoking_time: string

    // Жаростойкость
    @Column()
    heat_resistance: string

    // Тяжесть
    @Column()
    heaviness: string

    // Вывод
    @Column()
    conclusion: string
}