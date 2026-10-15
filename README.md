# Learned - Interactive Python Lab (React 19)

A modern, interactive web application ported from the Python workbook repository `akhand-dev/learned`. This application transforms Python learning scripts and terminal experiments into an interactive visual lab.

## Features Ported

1. **Countdown Timer (`projects/countdown.py`)**:
   - Interactive step-by-step counter using loop ranges (`range(x + 1)`).
   - Real-time simulation of `time.sleep()` with variable speed controls (1x, 2x, 4x, 10x).
   - Buffer flushing and continuous output line demonstration (`end='...'`, `flush=True`).

2. **Print() Function Mastery (`python/start1.py`)**:
   - **`sep` parameter**: Interactive separator tester (hyphens, newlines, paths, spaces, custom strings).
   - **`end` parameter**: Single-line and inline streaming simulation.
   - **`file` redirection**: Virtual filesystem writer creating `create.py` via `print(..., file=py)`.
   - **`flush` buffer control**: Comparative animation showing buffered output vs immediate flushing.
   - **F-Strings**: Variable injection and decimal precision formatting (`{price:.2f}`).
   - **List Unpacking (`*`)**: Side-by-side comparison of unpacked arguments vs raw list passing.
   - **`__str__` in OOP**: Custom object string representation in classes (`Player` class demo).
   - **Complete anatomy**: Visual breakdown of `print(*objects, sep=' ', end='\n', file=sys.stdout, flush=False)`.

3. **Operators & Python Ecosystem (`python/print.py`)**:
   - **Arithmetic Operators**: Dynamic calculator for `+`, `-`, `*`, `/`, `%` (remainder), and `**` (exponentiation).
   - **Assignment Stepper**: Step-through debugger tracking in-place variable mutations (`+=`, `-=`, `*=`, `/=`) through function calls.
   - **Dictionaries**: Live dictionary explorer with `keys()`, `values()`, and `items()` methods.
   - **Pip & Ecosystem**: Notes and live simulators for packages like `pyjokes`, `flask`, and `pyttsx3`.

4. **Terminal REPL & Virtual File Explorer**:
   - In-browser simulated Python REPL with standard output streaming.
   - Complete file tree browser with syntax-highlighted code inspection and file download.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Bundler**: Vite
