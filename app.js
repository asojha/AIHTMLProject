// ============================================
// Utility Functions
// ============================================

/**
 * Generates a random number between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns the symbol for a given operation
 * @param {string} operation - Operation type
 * @returns {string} Operation symbol
 */
function getOperationSymbol(operation) {
    const symbols = {
        'addition': '+',
        'subtraction': '-',
        'multiplication': '×',
        'division': '÷'
    };
    return symbols[operation] || '+';
}

/**
 * Returns the display name for a given operation
 * @param {string} operation - Operation type
 * @returns {string} Operation name
 */
function getOperationName(operation) {
    const names = {
        'addition': 'Add',
        'subtraction': 'Sub',
        'multiplication': 'Mult',
        'division': 'Div'
    };
    return names[operation] || 'Add';
}

// ============================================
// Problem Generation Functions
// ============================================

/**
 * Generates a math problem for the given operation
 * @param {string} operation - Operation type (addition, subtraction, multiplication, division)
 * @returns {Object} Problem object with num1, num2, correctAnswer, and operation
 */
function generateProblem(operation) {
    let num1, num2, correctAnswer;

    switch(operation) {
        case 'addition':
            num1 = generateRandomNumber(1, 100);
            num2 = generateRandomNumber(1, 100);
            correctAnswer = num1 + num2;
            break;
        
        case 'subtraction':
            num1 = generateRandomNumber(10, 100);
            num2 = generateRandomNumber(1, num1);
            correctAnswer = num1 - num2;
            break;
        
        case 'multiplication':
            num1 = generateRandomNumber(1, 12);
            num2 = generateRandomNumber(1, 12);
            correctAnswer = num1 * num2;
            break;
        
        case 'division':
            num2 = generateRandomNumber(2, 12);
            const quotient = generateRandomNumber(1, 12);
            num1 = num2 * quotient;
            correctAnswer = quotient;
            break;
        
        default:
            num1 = generateRandomNumber(1, 100);
            num2 = generateRandomNumber(1, 100);
            correctAnswer = num1 + num2;
    }

    return { num1, num2, correctAnswer, operation };
}

// ============================================
// React Components
// ============================================

/**
 * ProblemCard Component - Displays a single math problem
 */
function ProblemCard({ problem, index, onAnswerChange, feedback }) {
    const operationSymbol = getOperationSymbol(problem.operation);
    const operationName = getOperationName(problem.operation);
    const stepValue = problem.operation === 'division' ? '0.01' : '1';
    const inputId = `answer-${problem.id}`;
    const feedbackId = `feedback-${problem.id}`;
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            const scoreBtn = document.querySelector('.validate-btn');
            if (scoreBtn) scoreBtn.click();
        }
    };

    return (
        <div className={`problem ${feedback?.status || ''}`}>
            <div className="problem-header">
                <span className="problem-number">#{index + 1}</span>
                <span className="problem-type">{operationName}</span>
            </div>
            <div className="problem-text">
                {problem.num1} {operationSymbol} {problem.num2} = 
            </div>
            <input
                type="number"
                id={inputId}
                className="problem-input"
                placeholder="?"
                step={stepValue}
                onChange={(e) => onAnswerChange(problem.id, e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <div className={`problem-feedback ${feedback?.status || ''}`} id={feedbackId}>
                {feedback?.message || ''}
            </div>
        </div>
    );
}

/**
 * ScoreCard Component - Displays score statistics and breakdown
 */
function ScoreCard({ scoreData }) {
    if (!scoreData) return null;

    const { total, correct, incorrect, percentage, breakdown } = scoreData;

    return (
        <div className="score-card">
            <h2>📊 Score Card</h2>
            <div className="score-stats">
                <div className="stat-item">
                    <div className="stat-label">Total Problems</div>
                    <div className="stat-value">{total}</div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">Correct</div>
                    <div className="stat-value" style={{ color: '#4caf50' }}>{correct}</div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">Incorrect</div>
                    <div className="stat-value" style={{ color: '#f44336' }}>{incorrect}</div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">Score</div>
                    <div className="stat-value">{percentage}%</div>
                </div>
            </div>
            {breakdown && Object.keys(breakdown).length > 0 && (
                <div className="score-breakdown">
                    <h3>Breakdown by Operation</h3>
                    {Object.entries(breakdown).map(([operation, stats]) => (
                        <div key={operation} className="breakdown-item">
                            <span className="breakdown-operation">
                                {getOperationName(operation)}: {stats.correct}/{stats.total}
                            </span>
                            <span className="breakdown-score">
                                {Math.round((stats.correct / stats.total) * 100)}%
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ============================================
// Main App Component
// ============================================

/**
 * Main App Component - Manages state and renders the application
 */
function App() {
    const { useState } = React;
    
    // State management
    const [selectedOperation, setSelectedOperation] = useState('addition');
    const [problems, setProblems] = useState([]);
    const [answers, setAnswers] = useState({});
    const [feedback, setFeedback] = useState({});
    const [showValidate, setShowValidate] = useState(false);
    const [scoreData, setScoreData] = useState(null);

    const operations = ['addition', 'subtraction', 'multiplication', 'division'];

    /**
     * Generates 5 problems for the selected operation
     */
    const generateProblems = (operation = selectedOperation) => {
        const newProblems = [];
        for (let i = 0; i < 5; i++) {
            const problem = generateProblem(operation);
            newProblems.push({
                ...problem,
                id: `${operation}-${Date.now()}-${i}`
            });
        }
        setProblems(newProblems);
        setAnswers({});
        setFeedback({});
        setScoreData(null);
        setShowValidate(true);
    };

    /**
     * Generates 5 problems for each operation type (20 total)
     */
    const generateAllTypes = () => {
        const allProblems = [];
        operations.forEach(operation => {
            for (let i = 0; i < 5; i++) {
                const problem = generateProblem(operation);
                allProblems.push({
                    ...problem,
                    id: `${operation}-${Date.now()}-${i}`
                });
            }
        });
        setProblems(allProblems);
        setAnswers({});
        setFeedback({});
        setScoreData(null);
        setShowValidate(true);
    };

    /**
     * Handles answer input changes
     */
    const handleAnswerChange = (problemId, value) => {
        setAnswers(prev => ({
            ...prev,
            [problemId]: value
        }));
        // Clear feedback for this problem when user changes answer
        if (feedback[problemId]) {
            setFeedback(prev => {
                const newFeedback = { ...prev };
                delete newFeedback[problemId];
                return newFeedback;
            });
        }
    };

    /**
     * Saves the current session to localStorage
     */
    const saveSession = () => {
        const sessionData = {
            timestamp: new Date().toISOString(),
            problems: problems,
            answers: answers,
            feedback: feedback,
            scoreData: scoreData
        };
        
        try {
            const sessions = JSON.parse(localStorage.getItem('mathSessions') || '[]');
            sessions.push(sessionData);
            localStorage.setItem('mathSessions', JSON.stringify(sessions));
            alert('✅ Session saved successfully!');
        } catch (error) {
            alert('❌ Error saving session: ' + error.message);
        }
    };

    /**
     * Validates all answers and generates score card
     */
    const validateAnswers = () => {
        const newFeedback = {};
        let correctCount = 0;
        let incorrectCount = 0;
        const breakdown = {};

        problems.forEach(problem => {
            const userAnswer = problem.operation === 'division' 
                ? parseFloat(answers[problem.id]) 
                : parseInt(answers[problem.id]);
            
            const isCorrect = userAnswer === problem.correctAnswer;
            const isEmpty = !answers[problem.id] || isNaN(userAnswer);

            // Initialize breakdown for this operation
            if (!breakdown[problem.operation]) {
                breakdown[problem.operation] = { correct: 0, total: 0 };
            }
            breakdown[problem.operation].total++;

            if (isEmpty) {
                newFeedback[problem.id] = {
                    status: 'incorrect',
                    message: 'Please enter an answer'
                };
                incorrectCount++;
            } else if (isCorrect) {
                newFeedback[problem.id] = {
                    status: 'correct',
                    message: '✓ Correct!'
                };
                correctCount++;
                breakdown[problem.operation].correct++;
            } else {
                newFeedback[problem.id] = {
                    status: 'incorrect',
                    message: `✗ Incorrect. Answer: ${problem.correctAnswer}`
                };
                incorrectCount++;
            }
        });

        setFeedback(newFeedback);

        // Calculate score data
        const total = problems.length;
        const percentage = Math.round((correctCount / total) * 100);
        const scoreInfo = {
            total,
            correct: correctCount,
            incorrect: incorrectCount,
            percentage,
            breakdown
        };
        setScoreData(scoreInfo);

        if (correctCount === total) {
            setTimeout(() => {
                alert('🎉 Congratulations! All answers are correct!');
            }, 100);
        }
    };

    // Render
    return (
        <div className="container">
            <h1>🔢 Math Problems Generator</h1>
            
            <div className="operation-buttons">
                {operations.map(op => (
                    <button
                        key={op}
                        className={`operation-btn ${selectedOperation === op ? 'active' : ''}`}
                        onClick={() => setSelectedOperation(op)}
                    >
                        {op === 'addition' && '➕ Addition'}
                        {op === 'subtraction' && '➖ Subtraction'}
                        {op === 'multiplication' && '✖️ Multiplication'}
                        {op === 'division' && '➗ Division'}
                    </button>
                ))}
            </div>
            
            <div className="button-container">
                <button className="generate-btn" onClick={() => generateProblems()}>
                    Generate 5 Problems
                </button>
                <button className="generate-all-btn" onClick={generateAllTypes}>
                    Generate All Types (5 each)
                </button>
            </div>

            {problems.length > 0 && (
                <>
                    <div className="problems-container">
                        {problems.map((problem, index) => (
                            <ProblemCard
                                key={problem.id}
                                problem={problem}
                                index={index}
                                onAnswerChange={handleAnswerChange}
                                feedback={feedback[problem.id]}
                            />
                        ))}
                    </div>
                    
                    {showValidate && (
                        <div className="button-container">
                            <button className="save-btn" onClick={saveSession}>
                                💾 Save Session
                            </button>
                            <button className="validate-btn" onClick={validateAnswers}>
                                Score
                            </button>
                        </div>
                    )}

                    {scoreData && <ScoreCard scoreData={scoreData} />}
                </>
            )}
        </div>
    );
}

// ============================================
// Initialize React App
// ============================================
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

