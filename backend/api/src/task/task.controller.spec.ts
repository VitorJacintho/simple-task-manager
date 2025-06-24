import { INestApplication } from "@nestjs/common"
import { AppModule } from "src/app.module"
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { describe, test, expect, beforeAll } from 'vitest';
import { TaskModule } from "./task.module";


describe('Create Task', () => {
    let app: INestApplication

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [TaskModule],
        }).compile()

        app = moduleRef.createNestApplication()

        await app.init()
    })

    test('[POST] /tasks', async () => {
        const response = await request(app.getHttpServer()).post('/tasks').send({
            nm_title: 'atividade de teste',
            ds_task: 'descrição da atividade de teste',
            tp_situation: 'P',
            cd_user: '1',
            elapsed_ms: 0,
            goal_ms: 1000,
            tp_status: 'P',
            createdAt: '2025-06-17 14:02:13.0880000'
        })

        expect(response.status).toBe(201)
    })
})