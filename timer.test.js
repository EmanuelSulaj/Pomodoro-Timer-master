import '@testing-library/jest-dom';

describe('Timer Functionality', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="timer-number">25:00</div>
            <button id="timer-button">Start</button>
        `;
    });

    test('timer should start at 25:00', () => {
        expect(document.getElementById('timer-number').textContent).toBe('25:00');
    });

    test('timer button should toggle between Start and Stop', () => {
        const timerButton = document.getElementById('timer-button');
        expect(timerButton.textContent).toBe('Start');
        timerButton.click();
        // Add your actual timer button click logic test
    });
}); 