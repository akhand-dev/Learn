import { VirtualFile, FolderType } from '../types/editor';

const WORKSPACE_STORAGE_KEY = 'akhand_learned_workspace_v2';

export const INITIAL_WORKSPACE_FILES: VirtualFile[] = [
  // LEARNED FOLDER
  {
    id: 'learned-print-basics',
    name: '01_print_basics.py',
    path: 'learned/01_print_basics.py',
    folder: 'learned',
    summary: 'print() fundamentals, variable arguments (*args), and mixed data types.',
    notes: 'The asterisk (*) parameter allows passing an unlimited number of objects separated by commas. You can mix primitives (int, float, bool, None).',
    tags: ['print', 'primitives', 'strings', 'basics'],
    mastery: 'mastered',
    revisionCount: 3,
    lastRevised: '2026-10-15',
    createdAt: '2026-10-04',
    updatedAt: '2026-10-15',
    content: `# ==========================================
# LEARNED: print() Fundamentals & Data Types
# ==========================================

# 1. Basic print
print('hello world') 

# 2. Unlimited arguments with asterisk (*)
# You can pass mixed data types (str, int, bool) freely separated by commas:
print("Age:", 25, "Status:", True)

# 3. String variables
name = 'akhand pratap singh'
print('my name is', name)

# 4. Primitives: int, float, bool, None
user_id = 101
rating = 4.95
is_active = True
session_token = None

print(f"User: {name} (ID: {user_id}), Active: {is_active}, Rating: {rating}")
`,
  },
  {
    id: 'learned-sep-parameter',
    name: '02_sep_parameter.py',
    path: 'learned/02_sep_parameter.py',
    folder: 'learned',
    summary: 'Custom separator parameter (sep) in print() replacing default spaces.',
    notes: 'Overriding sep lets you separate objects with hyphens, newlines (\\n), directory slashes (/), or nothing ("").',
    tags: ['sep', 'formatting', 'strings'],
    mastery: 'mastered',
    revisionCount: 2,
    lastRevised: '2026-10-14',
    createdAt: '2026-10-04',
    updatedAt: '2026-10-15',
    content: `# ==========================================
# LEARNED: sep (Separator) Parameter
# ==========================================

# By default, Python puts a single space between objects.
# Overriding sep changes what is inserted between each argument:

# 1. Format dates with a hyphen:
print("2026", "10", "16", sep="-") 
# Output: 2026-10-16

# 2. Stack elements on new lines using '\\n':
x, y, z = 2, 3, 4
print('using the sep parameter:', x, y, z, sep='\\n')

# 3. Concatenate with zero space:
print('using no space', x, y, z, sep='')

# 4. Format directory paths with '/':
print("Home", "user", "documents", "python", sep="/") 
# Output: Home/user/documents/python
`,
  },
  {
    id: 'learned-end-parameter',
    name: '03_end_parameter.py',
    path: 'learned/03_end_parameter.py',
    folder: 'learned',
    summary: 'Controlling line endings with end parameter to prevent line breaks.',
    notes: 'By default, print() appends \\n. Setting end="... " keeps subsequent outputs on the exact same line.',
    tags: ['end', 'streams', 'loops'],
    mastery: 'mastered',
    revisionCount: 4,
    lastRevised: '2026-10-15',
    createdAt: '2026-10-04',
    updatedAt: '2026-10-15',
    content: `# ==========================================
# LEARNED: end (End of Line) Parameter
# ==========================================

# By default, print() appends '\\n' to the end.
# Overriding end lets you keep subsequent outputs on the same line:

print("Loading", end="... ")
print("Processing", end="... ")
print("Done!")
# Output: Loading... Processing... Done!

# Useful in loops to print progress in a single row:
for step in range(1, 6):
    print(f"Step {step}", end=" -> ")
print("Complete!")
`,
  },
  {
    id: 'learned-file-redirection',
    name: '04_file_redirection.py',
    path: 'learned/04_file_redirection.py',
    folder: 'learned',
    summary: 'Redirecting print output into files with file=handle.',
    notes: 'By default print writes to sys.stdout. Passing an open file handle writes text directly into files on disk.',
    tags: ['file-io', 'redirection', 'with-open'],
    mastery: 'mastered',
    revisionCount: 1,
    lastRevised: '2026-10-12',
    createdAt: '2026-10-05',
    updatedAt: '2026-10-15',
    content: `# ==========================================
# LEARNED: Output Redirection with file=
# ==========================================

# Writing output directly to a file instead of the terminal:
with open('create.py', 'w') as py:
    print("print('hello, it is created by start1.py')", file=py)

print("Wrote code successfully to create.py using print(..., file=py)!")

# You can also redirect error messages to sys.stderr:
import sys
print("Notice: System initialized successfully.", file=sys.stdout)
`,
  },
  {
    id: 'learned-buffer-flush',
    name: '05_buffer_flush.py',
    path: 'learned/05_buffer_flush.py',
    folder: 'learned',
    summary: 'Buffer flushing with flush=True for real-time console streaming.',
    notes: 'Python buffers I/O for speed. Setting flush=True forces immediate terminal rendering during loops.',
    tags: ['flush', 'buffer', 'time.sleep', 'loops'],
    mastery: 'mastered',
    revisionCount: 3,
    lastRevised: '2026-10-15',
    createdAt: '2026-10-05',
    updatedAt: '2026-10-15',
    content: `# ==========================================
# LEARNED: flush (Buffer Control)
# ==========================================
import time

# Setting flush=True forces Python to clear the buffer
# and immediately display the output without waiting for loop exit:
print("Streaming live progress: ", end="", flush=True)

for i in range(5):
    print(i, end=" ", flush=True)
    time.sleep(0.5)

print("\\nStreaming complete!")
`,
  },
  {
    id: 'learned-fstrings',
    name: '06_fstrings_formatting.py',
    path: 'learned/06_fstrings_formatting.py',
    folder: 'learned',
    summary: 'F-Strings (Python 3.6+) variable injection and decimal float formatting.',
    notes: 'Place f before quotes. Inject expressions inside {}. Round floats using :.2f.',
    tags: ['f-strings', 'formatting', 'floats'],
    mastery: 'mastered',
    revisionCount: 2,
    lastRevised: '2026-10-14',
    createdAt: '2026-10-06',
    updatedAt: '2026-10-15',
    content: `# ==========================================
# LEARNED: F-Strings (Formatted String Literals)
# ==========================================

name = "Alice"
price = 48.9487

# Injecting variables and rounding float to 2 decimal places:
print(f"Hello {name}, your total is \${price:.2f}")
# Output: Hello Alice, your total is $48.95

# Expressions inside braces:
x = 'akhand'
y = float(87.78)
print(f'hello {x}, your age score is {y:.2f} and next year it is {y + 1:.2f}')
`,
  },
  {
    id: 'learned-unpacking',
    name: '07_unpacking_operator.py',
    path: 'learned/07_unpacking_operator.py',
    folder: 'learned',
    summary: 'Unpacking sequence elements with asterisk (*) for custom separator printing.',
    notes: 'print(fruits, sep="-") does not work because the list is 1 argument. print(*fruits, sep="-") unpacks items!',
    tags: ['unpacking', 'lists', '*args'],
    mastery: 'mastered',
    revisionCount: 3,
    lastRevised: '2026-10-13',
    createdAt: '2026-10-06',
    updatedAt: '2026-10-15',
    content: `# ==========================================
# LEARNED: Unpacking Operator (*)
# ==========================================

fruits = ["Apple", "Banana", "Cherry"]

# Unpacks the list items as individual positional arguments to print():
print(*fruits, sep=", ")
# Output: Apple, Banana, Cherry

# Note: print(fruits, sep='-') will NOT separate items
# because Python treats the entire list as a single object.
# Always use the unpack operator (*)!
`,
  },
  {
    id: 'learned-classes-str',
    name: '08_classes_str_dunder.py',
    path: 'learned/08_classes_str_dunder.py',
    folder: 'learned',
    summary: 'Customizing object print representation using __str__ dunder method.',
    notes: 'Defining __str__(self) controls what print(object) displays instead of default hex memory addresses.',
    tags: ['oop', 'classes', '__str__', 'dunder'],
    mastery: 'mastered',
    revisionCount: 2,
    lastRevised: '2026-10-14',
    createdAt: '2026-10-07',
    updatedAt: '2026-10-15',
    content: `# ==========================================
# LEARNED: Customizing How Objects Print (__str__)
# ==========================================

class Player:
    def __init__(self, username, level):
        self.username = username
        self.level = level
        
    def __str__(self):
        return f"Player: {self.username} (Level {self.level})"

# Instantiate player object
p = Player("ShadowNinja", 42)

# Calling print(p) invokes p.__str__() automatically:
print(p)
# Output: Player: ShadowNinja (Level 42)
`,
  },
  {
    id: 'learned-arithmetic-operators',
    name: '09_arithmetic_operators.py',
    path: 'learned/09_arithmetic_operators.py',
    folder: 'learned',
    summary: 'Python arithmetic operators (+, -, *, /, %, **).',
    notes: 'Division (/) always returns a float in Python 3. Modulo (%) calculates remainder. (**) is exponentiation.',
    tags: ['operators', 'math', 'arithmetic'],
    mastery: 'mastered',
    revisionCount: 4,
    lastRevised: '2026-10-15',
    createdAt: '2026-10-08',
    updatedAt: '2026-10-15',
    content: `# ==========================================
# LEARNED: Arithmetic Operators
# ==========================================

a = 10
b = 10

print("Addition (+):", a + b)
print("Subtraction (-):", a - b)
print("Multiplication (*):", a * b)
print("True Division (/):", a / b)  # Always yields float (1.0)
print('Remainder (%):', a % b)
print('Exponentiation (**):', a ** b)
`,
  },
  {
    id: 'learned-assignment-mutation',
    name: '10_assignment_mutation.py',
    path: 'learned/10_assignment_mutation.py',
    folder: 'learned',
    summary: 'In-place assignment operators (+=, -=, *=, /=) and variable mutation.',
    notes: 'c += 10 updates c in place. /= always yields float. Testing state via custom helper functions.',
    tags: ['assignment', 'mutation', 'functions'],
    mastery: 'mastered',
    revisionCount: 3,
    lastRevised: '2026-10-15',
    createdAt: '2026-10-08',
    updatedAt: '2026-10-15',
    content: `# ==========================================
# LEARNED: Assignment Operators & Mutation
# ==========================================

def p(c):
    print("Current value:", c)

c = 10
p(c)       # 10

c += 10
p(c)       # 20 (c = c + 10)

c -= 10
print(c)   # 10 (c = c - 10)

c *= 10
p(c)       # 100 (c = c * 10)

c /= 10
p(c)       # 10.0 (c = c / 10 -> float)
`,
  },
  {
    id: 'learned-dictionaries',
    name: '11_dictionaries.py',
    path: 'learned/11_dictionaries.py',
    folder: 'learned',
    summary: 'Dictionary mappings, key-value syntax, and methods (items, keys, values).',
    notes: 'Dictionaries are unordered, mutable, indexed key-value mappings. Use .keys(), .values(), and .items().',
    tags: ['dictionaries', 'data-structures', 'mappings'],
    mastery: 'practicing',
    revisionCount: 2,
    lastRevised: '2026-10-15',
    createdAt: '2026-10-09',
    updatedAt: '2026-10-15',
    content: `# ==========================================
# LEARNED: Dictionaries (dict)
# ==========================================

# Dictionaries store unordered, mutable key-value pairs:
methods = {
    'method1': 'items()',
    'method2': 'keys()',
    'method3': 'values()'
}

print("Type:", type(methods))
print("Keys:", methods.keys())
print("Items:", methods.items())

# Iterating over key-value pairs:
for key, val in methods.items():
    print(f"Key '{key}' maps to method '{val}'")
`,
  },
  {
    id: 'learned-pip-modules',
    name: '12_pip_and_modules.py',
    path: 'learned/12_pip_and_modules.py',
    folder: 'learned',
    summary: 'Code reusability with modules and installing packages using pip.',
    notes: 'Modules let code be reused across files. Pip is Python install manager (flask, pyjokes, pyttsx3).',
    tags: ['pip', 'modules', 'reusability'],
    mastery: 'practicing',
    revisionCount: 2,
    lastRevised: '2026-10-15',
    createdAt: '2026-10-10',
    updatedAt: '2026-10-15',
    content: `# ==========================================
# LEARNED: Modules & Pip Package Manager
# ==========================================

# module -- code written to be reused across projects
# pip -- python install manager (pip install flask, pyjokes, pyttsx3)

x = input('enter your name: ')
print(f"Hello {x}, welcome to Python modules!")

# Simulating reusable joke module:
def get_developer_joke():
    return "Why do Python programmers prefer dark mode? Because light attracts bugs!"

print("Generated Joke:", get_developer_joke())
`,
  },
  {
    id: 'learned-comments-repl',
    name: '13_comments_and_repl.py',
    path: 'learned/13_comments_and_repl.py',
    folder: 'learned',
    summary: 'Python REPL usage and commenting syntax (single and multi-line).',
    notes: 'The REPL is an interactive sandbox. Use # for single-line comments and triple quotes (\'\'\' or """) for multi-line comments and strings.',
    tags: ['repl', 'comments', 'syntax'],
    mastery: 'mastered',
    revisionCount: 1,
    lastRevised: '2026-10-18',
    createdAt: '2026-10-18',
    updatedAt: '2026-10-18',
    content: `# ==========================================
# LEARNED: Python REPL and Commenting Syntax
# ==========================================

# 1. Python REPL (Read-Evaluate-Print Loop)
# Entering 'python' in your terminal starts the REPL.
# It acts as an interactive calculator and sandbox:
# >>> 2 + 2
# 4
# >>> print('hello')
# hello

# 2. Single-line comments
# Everything after # is ignored by Python.

# 3. Multi-line comments
'''
This is a multi-line comment.
It is often used for docstrings 
or explaining complex sections.
'''

"""
You can also use triple double quotes.
"""

# 4. Multi-line strings in print()
print("""
This is a multi-line string.
It will print exactly as formatted,
including newlines!
""")
`,
  },
  {
    id: 'learned-variables-types',
    name: '14_variables_types.py',
    path: 'learned/14_variables_types.py',
    folder: 'learned',
    summary: 'Variables, data types, naming rules, operators, and type conversion.',
    notes: 'Variables are containers. Types: int, float, str, bool, None. Input is always string, cast with int() or float() for math.',
    tags: ['variables', 'data-types', 'operators', 'casting', 'input'],
    mastery: 'mastered',
    revisionCount: 1,
    lastRevised: '2026-10-18',
    createdAt: '2026-10-18',
    updatedAt: '2026-10-18',
    content: `# ==========================================
# LEARNED: Variables, Data Types & Operators
# ==========================================

# 1. Variables and Data Types
name = "Akhand"        # str
age = 25               # int
rating = 4.9           # float
is_active = True       # bool
data = None            # NoneType

# 2. Variable Naming Rules
# Allowed: letters, digits, underscores (_)
# MUST start with letter or _
# NOT allowed: whitespace, special chars like @

# 3. Operators
# Arithmetic: + - * / % **
# Assignment: = += -= *= /=
# Comparison: == > < >= <= != (returns bool)
# Logical: AND, OR, NOT

# 4. Input & Type Casting
user_input = input("Enter a number: ") # Always string
num = int(user_input)                 # Explicit casting
print(f"Double is: {num * 2}")

# Type inspection
print(type(num))
`,
  },
  {
    id: 'learned-strings',
    name: '15_strings_basics.py',
    path: 'learned/15_strings_basics.py',
    folder: 'learned',
    summary: 'String properties, indexing, slicing, methods, and escape sequences.',
    notes: 'Strings are immutable. Slicing: [start:end:step]. Methods: len(), find(), replace(). Escapes: \\n, \\t.',
    tags: ['strings', 'slicing', 'methods', 'escape'],
    mastery: 'mastered',
    revisionCount: 1,
    lastRevised: '2026-10-18',
    createdAt: '2026-10-18',
    updatedAt: '2026-10-18',
    content: `# ==========================================
# LEARNED: String Properties, Slicing & Methods
# ==========================================

# 1. Properties
s = "PythonProgramming"
# Strings are immutable (cannot change characters in place)

# 2. Indexing & Slicing
print(f"First: {s[0]}, Last: {s[-1]}")
print(f"Slice (0-6): {s[0:6]}")
print(f"Skip Slicing (every 2nd): {s[::2]}")
print(f"Reverse: {s[::-1]}")

# 3. String Methods
print(f"Length: {len(s)}")
print(f"Find 'Gram': {s.find('Gram')}")
print(f"Replace: {s.replace('Python', 'Java')}")

# 4. Escape Sequences
print("Line1\\nLine2")
print("Tab\\tTabbed")
`,
  },
  {
    id: 'learned-lists-tuples',
    name: '16_lists_and_tuples.py',
    path: 'learned/16_lists_and_tuples.py',
    folder: 'learned',
    summary: 'Lists (mutable) vs. Tuples (immutable), methods, and operations.',
    notes: 'Lists: .append(), .sort(), .pop(). Tuples: () syntax, trailing comma for single element (1,), unpacking.',
    tags: ['lists', 'tuples', 'data-structures'],
    mastery: 'mastered',
    revisionCount: 1,
    lastRevised: '2026-10-18',
    createdAt: '2026-10-18',
    updatedAt: '2026-10-18',
    content: `# ==========================================
# LEARNED: Lists & Tuples
# ==========================================

# 1. Lists (Mutable)
my_list = [3, 1, 2]
my_list.append(4)
my_list.sort()
my_list.insert(0, 0)
print(f"List: {my_list}, Sum: {sum(my_list)}")

# 2. Tuples (Immutable)
my_tuple = (10, 20, 30)
# my_tuple[0] = 5 # This would raise an error!
single_tuple = (1,)
print(f"Tuple: {my_tuple}, Count of 10: {my_tuple.count(10)}")

# 3. Tuple Unpacking
a, b, c = my_tuple
print(f"Unpacked: a={a}, b={b}, c={c}")
`,
  },
  {
    id: 'learned-dictionaries-sets',
    name: '17_dictionaries_and_sets.py',
    path: 'learned/17_dictionaries_and_sets.py',
    folder: 'learned',
    summary: 'Dictionaries (key-value) and Sets (unique).',
    notes: 'Dicts: Unordered, mutable, indexed by keys. .get() is safe. Sets: Unordered, unique, {}. Empty set is set().',
    tags: ['dictionaries', 'sets', 'data-structures'],
    mastery: 'mastered',
    revisionCount: 1,
    lastRevised: '2026-10-18',
    createdAt: '2026-10-18',
    updatedAt: '2026-10-18',
    content: `# ==========================================
# LEARNED: Dictionaries & Sets
# ==========================================

# 1. Dictionaries (Key-Value)
d = {"name": "Akhand", "age": 25}
d.update({"city": "Delhi"})
print(f"Dict: {d}, Name: {d.get('name')}, Missing: {d.get('email', 'N/A')}")

# 2. Sets (Unique)
my_set = {1, 2, 2, 3}
my_set.add(4)
empty_set = set() # {} creates dict!
print(f"Set: {my_set}")

# 3. Set Operations
s1 = {1, 2, 3}
s2 = {3, 4, 5}
print(f"Union: {s1.union(s2)}, Intersection: {s1.intersection(s2)}")
`,
  },
  // PROJECTS FOLDER
  {
    id: 'project-countdown',
    name: 'countdown.py',
    path: 'projects/countdown.py',
    folder: 'projects',
    summary: 'Interactive real-time countdown timer streaming counts with time.sleep(1) and flush=True.',
    notes: 'Original project from akhand-dev/learned using loop range(x + 1), end="...", and flush=True.',
    tags: ['countdown', 'loops', 'time.sleep', 'flush'],
    mastery: 'mastered',
    revisionCount: 5,
    lastRevised: '2026-10-15',
    createdAt: '2026-10-10',
    updatedAt: '2026-10-15',
    content: `import time

# Akhand's original Countdown Project
x = int(input('till what number do you want the countdown: '))

print("Starting countdown:")
for t in range(x + 1):
    print(t, end='...', flush=True)
    time.sleep(1)

print("\\nCountdown finished successfully!")
`,
  },
  {
    id: 'project-math-calculator',
    name: 'calculator.py',
    path: 'projects/calculator.py',
    folder: 'projects',
    summary: 'Modular mathematical calculator practicing operators and function definitions.',
    notes: 'Evaluates addition, subtraction, multiplication, division, modulo, and exponentiation.',
    tags: ['calculator', 'math', 'operators', 'functions'],
    mastery: 'mastered',
    revisionCount: 3,
    lastRevised: '2026-10-15',
    createdAt: '2026-10-11',
    updatedAt: '2026-10-15',
    content: `def calculate(a, b, op):
    if op == '+': return a + b
    elif op == '-': return a - b
    elif op == '*': return a * b
    elif op == '/': return a / b if b != 0 else 'Error: Div by zero'
    elif op == '%': return a % b
    elif op == '**': return a ** b
    return 'Unknown operator'

print("=== PYTHON CALCULATOR PROJECT ===")
num1 = 15
num2 = 4

operations = ['+', '-', '*', '/', '%', '**']
for op in operations:
    res = calculate(num1, num2, op)
    print(f"{num1} {op} {num2} = {res}")
`,
  },
  {
    id: 'project-number-guess',
    name: 'guess_game.py',
    path: 'projects/guess_game.py',
    folder: 'projects',
    summary: 'Interactive number guessing logic game with hints and attempt counter.',
    notes: 'Practice control flow (if/elif/else), loops, and conditional breaks.',
    tags: ['games', 'control-flow', 'random'],
    mastery: 'practicing',
    revisionCount: 2,
    lastRevised: '2026-10-14',
    createdAt: '2026-10-12',
    updatedAt: '2026-10-15',
    content: `import random

print("=== NUMBER GUESSING GAME ===")
secret_number = random.randint(1, 20)
print("I have chosen a secret number between 1 and 20.")

guesses = [7, 14, 11]
attempts = 0

for g in guesses:
    attempts += 1
    print(f"\\nPlayer guessed: {g}")
    if g == secret_number:
        print(f"🎉 Correct! You guessed it in {attempts} tries!")
        break
    elif g < secret_number:
        print("Hint: Too low! Aim higher...")
    else:
        print("Hint: Too high! Aim lower...")
`,
  },
  {
    id: 'project-password-generator',
    name: 'password_generator.py',
    path: 'projects/password_generator.py',
    folder: 'projects',
    summary: 'Secure randomized password generator with custom length and characters.',
    notes: 'Combines string constants, random selection, and list comprehension join.',
    tags: ['security', 'strings', 'utilities'],
    mastery: 'learning',
    revisionCount: 1,
    lastRevised: '2026-10-15',
    createdAt: '2026-10-13',
    updatedAt: '2026-10-15',
    content: `import random
import string

def generate_password(length=12):
    characters = string.ascii_letters + string.digits + "!@#$%^&*"
    return "".join(random.choice(characters) for _ in range(length))

print("=== SECURE PASSWORD GENERATOR ===")
for i in range(3):
    pwd = generate_password(14)
    print(f"Generated Password #{i+1}: {pwd}")
`,
  },
  {
    id: 'project-todo-manager',
    name: 'todo_manager.py',
    path: 'projects/todo_manager.py',
    folder: 'projects',
    summary: 'In-memory task manager applying dictionaries and state management.',
    notes: 'Practice dictionary iteration with .items() and dictionary updates.',
    tags: ['dictionaries', 'cli', 'productivity'],
    mastery: 'practicing',
    revisionCount: 2,
    lastRevised: '2026-10-14',
    createdAt: '2026-10-14',
    updatedAt: '2026-10-15',
    content: `todos = {
    1: {"task": "Learn print() mechanics (sep, end, flush)", "done": True},
    2: {"task": "Practice arithmetic & assignment operators", "done": True},
    3: {"task": "Build countdown.py timer with time.sleep", "done": True},
    4: {"task": "Store and practice Python code in VS Code editor", "done": True},
    5: {"task": "Build custom games and CLI tools", "done": False},
}

print("=== MY PYTHON LEARNING TASKS ===")
for task_id, item in todos.items():
    check = "✓ [DONE]" if item["done"] else "○ [PENDING]"
    print(f"{task_id}. {check} {item['task']}")
`,
  },
  // ROOT
  {
    id: 'root-create',
    name: 'create.py',
    path: 'create.py',
    folder: 'root',
    summary: 'Dynamically generated Python script via file=py redirection.',
    notes: 'Created dynamically from start1.py via with open("create.py", "w") as py: print(..., file=py).',
    tags: ['generated', 'file-redirection'],
    mastery: 'mastered',
    revisionCount: 1,
    lastRevised: '2026-10-15',
    createdAt: '2026-10-05',
    updatedAt: '2026-10-15',
    content: `print('hello, it is created by start1.py')
`,
  },
  {
    id: 'learned-loops',
    name: '18_loops.py',
    path: 'learned/18_loops.py',
    folder: 'learned',
    summary: 'Loops (while, for), range() function, and loop control (break, continue, pass, for-else).',
    notes: 'while: repeats while true. for: iterates sequences. range(): generates sequences. Control: break, continue, pass, for-else.',
    tags: ['loops', 'control-flow', 'iteration'],
    mastery: 'learning',
    revisionCount: 1,
    lastRevised: '2026-10-18',
    createdAt: '2026-10-18',
    updatedAt: '2026-10-18',
    content: `# ==========================================
# LEARNED: Loops in Python
# ==========================================

# 1. while loop
count = 0
while count < 3:
    print(f"While count: {count}")
    count += 1

# 2. for loop with range()
# range(start, stop, step)
for i in range(0, 5, 2):
    print(f"For loop with range: {i}")

# 3. Loop Control Statements
for i in range(5):
    if i == 1: continue     # Skip 1
    if i == 4: break        # Exit at 4
    if i == 2: pass         # Placeholder
    print(f"Item: {i}")
else:
    print("Loop finished naturally")
`,
  },
  {
    id: 'learned-functions-recursion',
    name: '19_functions_recursion.py',
    path: 'learned/19_functions_recursion.py',
    folder: 'learned',
    summary: 'Function definitions, arguments, return values, default parameters, and recursion.',
    notes: 'def defines functions. Use return for output. Default parameters handle missing args. Recursion needs a base case.',
    tags: ['functions', 'recursion', 'basics'],
    mastery: 'learning',
    revisionCount: 1,
    lastRevised: '2026-10-18',
    createdAt: '2026-10-18',
    updatedAt: '2026-10-18',
    content: `# ==========================================
# LEARNED: Functions & Recursion
# ==========================================

# 1. Defining and Calling Functions
def greet(name="User"):
    return f"Hello, {name}!"

print(greet("Akhand")) # Call with arg
print(greet())         # Call with default

# 2. Recursion
# A function calling itself. 
# Base condition is CRITICAL to avoid Stack Overflow!
def factorial(n):
    if n == 1: return 1
    return n * factorial(n - 1)

print(f"Factorial of 5: {factorial(5)}")
`,
  },
  {
    id: 'learned-file-io',
    name: '20_file_io.py',
    path: 'learned/20_file_io.py',
    folder: 'learned',
    summary: 'Opening files, modes (r, w, a), reading/writing methods, and using context managers.',
    notes: 'Files provide permanent storage. Use open(path, mode). Modes: r, w, a, b. The with statement automatically closes files.',
    tags: ['file-io', 'persistence'],
    mastery: 'learning',
    revisionCount: 1,
    lastRevised: '2026-10-18',
    createdAt: '2026-10-18',
    updatedAt: '2026-10-18',
    content: `# ==========================================
# LEARNED: File I/O
# ==========================================

# 1. Writing with 'w' (overwrite)
with open('data.txt', 'w') as f:
    f.write("Line 1\\nLine 2\\n")

# 2. Appending with 'a'
with open('data.txt', 'a') as f:
    f.write("Line 3 (Appended)")

# 3. Reading with 'r'
with open('data.txt', 'r') as f:
    content = f.read()
    print("--- File Content ---")
    print(content)
`,
  },
];

export const virtualWorkspace = {
  getFiles(): VirtualFile[] {
    try {
      const data = localStorage.getItem(WORKSPACE_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(INITIAL_WORKSPACE_FILES));
        return INITIAL_WORKSPACE_FILES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_WORKSPACE_FILES;
    }
  },

  saveAllFiles(files: VirtualFile[]): void {
    localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(files));
  },

  getFileById(id: string): VirtualFile | undefined {
    return this.getFiles().find((f) => f.id === id);
  },

  saveFileContent(id: string, newContent: string): VirtualFile | undefined {
    const files = this.getFiles();
    let updatedFile: VirtualFile | undefined;
    const updated = files.map((f) => {
      if (f.id === id) {
        updatedFile = {
          ...f,
          content: newContent,
          updatedAt: new Date().toISOString().split('T')[0],
        };
        return updatedFile;
      }
      return f;
    });
    this.saveAllFiles(updated);
    return updatedFile;
  },

  createFile(
    folder: FolderType,
    fileName: string,
    initialContent?: string,
    summary?: string
  ): VirtualFile {
    const files = this.getFiles();
    const cleanName = fileName.endsWith('.py') ? fileName : `${fileName}.py`;
    const cleanPath = folder === 'root' ? cleanName : `${folder}/${cleanName}`;
    const now = new Date().toISOString().split('T')[0];

    const newFile: VirtualFile = {
      id: `${folder}-${Date.now()}`,
      name: cleanName,
      path: cleanPath,
      folder,
      content:
        initialContent ??
        `# ==========================================
# File: ${cleanPath}
# Created: ${now}
# ==========================================

print("Hello from ${cleanName}!")
`,
      summary: summary || `Python file in ${folder}/`,
      notes: 'Add your revision notes and key takeaways here.',
      tags: [folder, 'python'],
      mastery: 'learning',
      revisionCount: 1,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [...files, newFile];
    this.saveAllFiles(updated);
    return newFile;
  },

  deleteFile(id: string): void {
    const files = this.getFiles();
    const updated = files.filter((f) => f.id !== id);
    this.saveAllFiles(updated);
  },

  recordRevision(id: string): VirtualFile | undefined {
    const files = this.getFiles();
    let updatedFile: VirtualFile | undefined;
    const now = new Date().toISOString().split('T')[0];
    const updated = files.map((f) => {
      if (f.id === id) {
        updatedFile = {
          ...f,
          revisionCount: (f.revisionCount || 0) + 1,
          lastRevised: now,
        };
        return updatedFile;
      }
      return f;
    });
    this.saveAllFiles(updated);
    return updatedFile;
  },

  resetWorkspace(): void {
    localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(INITIAL_WORKSPACE_FILES));
  },
};
