const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const { expect } = chai;

chai.use(chaiHttp);

describe('Task API Testing', function () {
    this.timeout(5000);
    let taskId;
    let deletedTaskId = '64fce8f7a1e4e9123b83d000';

    // Test: Adding a valid task
    it('should add a new task', (done) => {
        chai.request(server)
            .post('/api/task')
            .send({ title: 'Test Task', description: 'Test add task', priority: 'High' })
            .end((err, res) => {
                expect(res).to.have.status(201);
                taskId = res.body.data.insertedId;
                done();
            });
    });

    // Test: Adding a task with missing fields
    it('should return 400 when title is missing', (done) => {
        chai.request(server)
            .post('/api/task')
            .send({ description: 'Missing title', priority: 'High' })
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    // Test: Adding a task with an extremely long title
    it('should return 400 for a task with an excessively long title', (done) => {
        const longTitle = 'A'.repeat(300);
        chai.request(server)
            .post('/api/task')
            .send({ title: longTitle, description: 'Too long', priority: 'High' })
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    // Test: Performance - Add 100 tasks at once
    it('should handle bulk task additions efficiently', (done) => {
        const bulkTasks = Array.from({ length: 100 }).map((_, i) => ({
            title: `Bulk Task ${i}`,
            description: 'Bulk test',
            priority: 'Low'
        }));

        chai.request(server)
            .post('/api/task')
            .send(bulkTasks)
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });

    // Test: Completing a deleted task
    it('should return 404 for completing a deleted task', (done) => {
        chai.request(server)
            .put(`/api/task/complete/${deletedTaskId}`)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });
});
