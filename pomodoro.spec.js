describe('Pomodoro Timer', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should start timer when clicking start button', () => {
        cy.get('#timer-button').click();
        cy.get('#timer-number').should('not.have.text', '25:00');
    });

    it('should add new task', () => {
        cy.get('#task-add-button').click();
        // Add task creation steps
        cy.get('#tasks-container').should('contain', 'New Task');
    });

    it('should complete pomodoro session', () => {
        cy.get('#timer-button').click();
        // Wait for timer completion
        cy.get('#timer-number', { timeout: 1500000 }).should('have.text', '00:00');
    });
}); 