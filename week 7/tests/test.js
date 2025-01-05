const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const { expect } = chai;

chai.use(chaiHttp);

describe('Task API Testing', function () {
    this.timeout(5000); 
    let taskId;

    // Test for adding a new task
    it('should add a new task', (done) => {
        chai.request(server)
            .post('/api/task')
            .send({
                title: 'Test Task',
                description: 'Testing add task',
                priority: 'High'
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('message', 'Task added successfully');
                taskId = res.body.data.insertedId;
                done();
            });
    });

    // Test for marking a task as completed
    it('should mark a task as completed', (done) => {
        chai.request(server)
            .put(`/api/task/complete/${taskId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Task marked as completed');
                done();
            });
    });

    // Test for invalid task ID
    it('should return 404 for invalid task ID', (done) => {
        chai.request(server)
            .put('/api/task/complete/invalidId123')
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('message', 'Task not found');
                done();
            });
    });

    // Test for deleting a task
    it('should delete a task', (done) => {
        chai.request(server)
            .delete(`/api/task/${taskId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Task marked as deleted');
                done();
            });
    });
});
