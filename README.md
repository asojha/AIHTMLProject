# Math Problems Generator

A responsive React-based web application for generating and practicing math problems with addition, subtraction, multiplication, and division.

## Features

- ✅ Generate math problems for individual operations or all types at once
- ✅ Responsive 4-column grid layout (adapts to screen size)
- ✅ Real-time answer validation
- ✅ Score card with detailed statistics
- ✅ Session saving to localStorage
- ✅ Support for all four basic operations

## File Structure

```
AIHTMLProject/
├── index.html      # Main HTML file
├── styles.css      # All CSS styles
├── app.js          # React application code
└── README.md       # This file
```

## Running the Application

Since the application uses external JavaScript files with Babel transformation, you need to run it from a web server (not directly from `file://`).

### Option 1: Python HTTP Server
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

### Option 2: Node.js serve
```bash
npx serve
```

### Option 3: VS Code Live Server
If you're using VS Code, install the "Live Server" extension and click "Go Live".

## Usage

1. Select an operation type (Addition, Subtraction, Multiplication, or Division)
2. Click "Generate 5 Problems" for the selected operation, or "Generate All Types (5 each)" for all operations
3. Enter your answers in the input fields
4. Click "Score" to validate answers and see your score card
5. Click "Save Session" to save your progress to localStorage

## Technologies Used

- React 18 (via CDN)
- Babel Standalone (for JSX transformation)
- Vanilla CSS with responsive design
- LocalStorage API for session persistence
