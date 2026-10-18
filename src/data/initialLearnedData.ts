import { LearnedTopic, UserProject } from '../types/learning';

export const INITIAL_LEARNED_TOPICS: LearnedTopic[] = [
  {
    id: 'topic-print-basics',
    title: 'print() Fundamentals & Primitive Data Types',
    category: 'Basics & Syntax',
    summary: 'Using print() to output messages, numbers, booleans, and mixing data types via comma separation.',
    notes: 'The asterisk (*) parameter allows passing an unlimited number of arguments. Python supports int, float, bool, and None primitives.',
    codeSnippet: `print('hello world')
print("Age:", 25, "Status:", True)
name = 'akhand pratap singh'
print('my name is', name)`,
    sampleOutput: `hello world
Age: 25 Status: True
my name is akhand pratap singh`,
    mastery: 'mastered',
    tags: ['print', 'primitives', 'strings', 'variables'],
    dateLearned: '2026-10-04',
  },
  {
    id: 'topic-sep-param',
    title: 'sep (Separator) Parameter in print()',
    category: 'I/O & Formatting',
    summary: 'Overriding the default space separator with any character, newline, or path delimiter.',
    notes: 'By default, print() inserts a space between multiple items. You can use sep="-" for dates, sep="/" for file paths, sep="\\n" for stacked outputs, or sep="" for no space.',
    codeSnippet: `print("2026", "10", "04", sep="-")
x, y, z = 2, 3, 4
print('using the sep parameter:', x, y, z, sep='\\n')
print("Home", "user", "documents", sep="/")`,
    sampleOutput: `2026-10-04
using the sep parameter:
2
3
4
Home/user/documents`,
    mastery: 'mastered',
    tags: ['sep', 'formatting', 'strings'],
    dateLearned: '2026-10-04',
  },
  {
    id: 'topic-end-param',
    title: 'end Parameter for Continuous Line Output',
    category: 'I/O & Formatting',
    summary: 'Preventing automatic newline characters and keeping subsequent print statements on the same line.',
    notes: 'By default, print() appends \\n. Setting end="... " or end=" " allows streaming progress without jumping to a new line.',
    codeSnippet: `print("Loading", end="... ")
print("Done!")`,
    sampleOutput: `Loading... Done!`,
    mastery: 'mastered',
    tags: ['end', 'streams', 'progress'],
    dateLearned: '2026-10-04',
  },
  {
    id: 'topic-file-redirection',
    title: 'Output Redirection with file Parameter',
    category: 'I/O & Formatting',
    summary: 'Writing printed text directly into text files or stderr using file=handle.',
    notes: 'Instead of writing to sys.stdout, passing an open file handle writes output directly to disk. The with statement automatically closes the file.',
    codeSnippet: `with open('create.py', 'w') as py:
    print("print('hello, it is created by start1.py')", file=py)`,
    sampleOutput: `[Generated create.py file with code inside]`,
    mastery: 'mastered',
    tags: ['file-io', 'redirection', 'with-open'],
    dateLearned: '2026-10-05',
  },
  {
    id: 'topic-flush-buffer',
    title: 'Buffer Control with flush=True',
    category: 'I/O & Formatting',
    summary: 'Forcing the I/O stream buffer to immediately render text on screen without waiting for loop completion.',
    notes: 'Python normally buffers terminal I/O for performance. Setting flush=True is critical for real-time progress bars, timers, and animations.',
    codeSnippet: `import time
\nfor i in range(2):
    print(i, end=" ", flush=True)
    time.sleep(0.5)`,
    sampleOutput: `0 1 `,
    mastery: 'mastered',
    tags: ['flush', 'buffer', 'time.sleep', 'loops'],
    dateLearned: '2026-10-05',
  },
  {
    id: 'topic-fstrings',
    title: 'F-Strings (Formatted String Literals, Python 3.6+)',
    category: 'Basics & Syntax',
    summary: 'Injecting expressions and variables directly into strings with float precision formatting.',
    notes: 'Prepend with f. Inside {var}, expressions are evaluated. Use :.2f to round floats to 2 decimal places.',
    codeSnippet: `name = "Alice"
price = 48.9487
print(f"Hello {name}, your total is \${price:.2f}")

y = float(87.78)
print(f'hello {name}, i know your age is {y:.2f}')`,
    sampleOutput: `Hello Alice, your total is $48.95
hello Alice, i know your age is 87.78`,
    mastery: 'mastered',
    tags: ['f-strings', 'formatting', 'floats'],
    dateLearned: '2026-10-06',
  },
  {
    id: 'topic-unpacking',
    title: 'List/Tuple Unpacking Operator (*)',
    category: 'Data Structures',
    summary: 'Unpacking sequence items into individual positional arguments for print() and functions.',
    notes: 'print(fruits, sep=", ") fails to separate because the list is treated as a single argument. print(*fruits, sep=", ") unpacks elements so sep applies!',
    codeSnippet: `fruits = ["Apple", "Banana", "Cherry"]
print(*fruits, sep=", ")
# print(fruits, sep=('- ')) will not work as expected`,
    sampleOutput: `Apple, Banana, Cherry`,
    mastery: 'mastered',
    tags: ['unpacking', 'lists', 'operators', '*args'],
    dateLearned: '2026-10-06',
  },
  {
    id: 'topic-str-method',
    title: 'Custom Object String Representation (__str__)',
    category: 'Object-Oriented (OOP)',
    summary: 'Defining how custom class instances display when printed or converted to str.',
    notes: 'Without __str__, Python prints a generic memory address like <__main__.Player object at 0x...>. Defining def __str__(self): returns a human-readable string.',
    codeSnippet: `class Player:
    def __init__(self, username, level):
        self.username = username
        self.level = level
        
    def __str__(self):
        return f"Player: {self.username} (Level {self.level})"

p = Player("ShadowNinja", 42)
print(p)`,
    sampleOutput: `Player: ShadowNinja (Level 42)`,
    mastery: 'mastered',
    tags: ['oop', 'classes', '__str__', 'dunder-methods'],
    dateLearned: '2026-10-07',
  },
  {
    id: 'topic-arithmetic-ops',
    title: 'Arithmetic Operators (+, -, *, /, %, **)',
    category: 'Operators & Math',
    summary: 'Standard math operations in Python including true division, modulo remainder, and exponentiation.',
    notes: 'Division (/) always returns a float in Python 3. Modulo (%) calculates the remainder. Exponentiation (**) raises a base to power.',
    codeSnippet: `a = 10
b = 10
print(a + b)      # 20
print(a - b)      # 0
print(a * b)      # 100
print(a / b)      # 1.0 (float)
print('remainder', a % b)  # 0
print('expo', a ** b)       # 10000000000`,
    sampleOutput: `20
0
100
1.0
remainder 0
expo 10000000000`,
    mastery: 'mastered',
    tags: ['arithmetic', 'operators', 'math'],
    dateLearned: '2026-10-08',
  },
  {
    id: 'topic-assignment-ops',
    title: 'In-Place Assignment Mutation (+=, -=, *=, /=)',
    category: 'Operators & Math',
    summary: 'Mutating variable values in-place and tracing state across function boundaries.',
    notes: 'c += 10 is shorthand for c = c + 10. Note that /= always turns the result into a float.',
    codeSnippet: `def p(c):
    print(c)

c = 10
p(c)    # 10
c += 10
p(c)    # 20
c -= 10
print(c) # 10
c *= 10
p(c)    # 100
c /= 10
p(c)    # 10.0`,
    sampleOutput: `10
20
10
100
10.0`,
    mastery: 'mastered',
    tags: ['assignment', 'mutation', 'functions'],
    dateLearned: '2026-10-08',
  },
  {
    id: 'topic-dictionaries',
    title: 'Dictionaries (dict) & Methods (items, keys, values)',
    category: 'Data Structures',
    summary: 'Unordered, mutable, key-value mapped data structures in Python.',
    notes: 'Dictionaries store mappings. Common methods include .keys(), .values(), and .items() which return iterable views.',
    codeSnippet: `methods = {'method1': 'items()', 'method2': 'keys()'}
print(type(methods))       # <class 'dict'>
print(methods.keys())      # dict_keys(['method1', 'method2'])
print(methods.items())     # dict_items([('method1', 'items()'), ('method2', 'keys()')])`,
    sampleOutput: `<class 'dict'>
dict_keys(['method1', 'method2'])
dict_items([('method1', 'items()'), ('method2', 'keys()')])`,
    mastery: 'practicing',
    tags: ['dictionaries', 'key-value', 'data-structures'],
    dateLearned: '2026-10-09',
  },
  {
    id: 'topic-pip-modules',
    title: 'Python Modules & The Pip Package Manager',
    category: 'Modules & Pip',
    summary: 'Understanding reusable code modules and installing third-party packages via pip.',
    notes: 'Modules allow code written once to be reused across projects. Pip is the standard package manager (pip install flask, pyjokes, pyttsx3).',
    codeSnippet: `# pip install pyjokes
import pyjokes
joke = pyjokes.get_joke()
print(joke)

# User input
name = input('enter your name: ')
print(f"Welcome, {name}!")`,
    sampleOutput: `Why do programmers prefer dark mode? Because light attracts bugs!
enter your name: Akhand
Welcome, Akhand!`,
    mastery: 'practicing',
    tags: ['pip', 'modules', 'pyjokes', 'input'],
    dateLearned: '2026-10-10',
  },
  {
    id: 'topic-comments-repl',
    title: 'Python REPL & Commenting Syntax',
    category: 'Basics & Syntax',
    summary: 'Using the REPL for interactive coding and various commenting techniques.',
    notes: 'The REPL is an interactive sandbox. Use # for single-line comments and triple quotes for multi-line comments/strings.',
    codeSnippet: `# Single-line comment

'''
This is a multi-line
comment or docstring
'''

print("""This is a
multi-line string""")`,
    sampleOutput: `This is a
multi-line string`,
    mastery: 'mastered',
    tags: ['repl', 'comments', 'syntax'],
    dateLearned: '2026-10-18',
  },
  {
    id: 'topic-variables-types',
    title: 'Variables, Data Types & Operators',
    category: 'Basics & Syntax',
    summary: 'Memory containers, primary data types, naming rules, operators, and type conversion.',
    notes: 'Variables are containers. Types: int, float, str, bool, None. Input is always string, cast with int() or float() for math.',
    codeSnippet: `age = 25               # int
rating = 4.9           # float
is_active = True       # bool

# Input requires casting
user_input = input("Enter a number: ")
num = int(user_input)
print(f"Double is: {num * 2}")`,
    sampleOutput: `Enter a number: 10
Double is: 20`,
    mastery: 'mastered',
    tags: ['variables', 'data-types', 'operators', 'casting', 'input'],
    dateLearned: '2026-10-18',
  },
  {
    id: 'topic-strings',
    title: 'Strings: Properties, Slicing & Methods',
    category: 'Basics & Syntax',
    summary: 'String immutability, zero-based/negative indexing, slicing syntax, common methods, and escape sequences.',
    notes: 'Strings are immutable sequences. Use string[start:end:step] for slicing. Methods: len(), find(), replace(), etc. Escape sequences: \\n, \\t, \\", \\\', \\\\.',
    codeSnippet: `s = "Python"
print(s[0:3])    # Pyt
print(s[::-1])   # nohtyP (reverse)
print(s.replace("P", "p")) # python
print("New\\nLine")`,
    sampleOutput: `Pyt
nohtyP
python
New
Line`,
    mastery: 'mastered',
    tags: ['strings', 'slicing', 'methods', 'f-strings'],
    dateLearned: '2026-10-18',
  },
  {
    id: 'topic-lists-tuples',
    title: 'Lists & Tuples',
    category: 'Data Structures',
    summary: 'Mutable lists vs. immutable tuples, common methods, and operations.',
    notes: 'Lists: .append(), .sort(), .pop(). Tuples: () syntax, trailing comma for single element (1,), unpacking.',
    codeSnippet: `my_list = [1, 2, 3]
my_list.append(4)
my_tuple = (1, 2)
a, b = my_tuple`,
    sampleOutput: `List: [1, 2, 3, 4]
Tuple: (1, 2)`,
    mastery: 'mastered',
    tags: ['lists', 'tuples', 'data-structures', 'mutation'],
    dateLearned: '2026-10-18',
  },
  {
    id: 'topic-dictionaries-sets',
    title: 'Dictionaries & Sets',
    category: 'Data Structures',
    summary: 'Unordered mutable key-value collections and unordered unique element collections.',
    notes: 'Dicts: Unique keys, .get() is safe. Sets: Unique elements, {}, empty set must use set().',
    codeSnippet: `d = {"key": "value"}
print(d.get("key"))
s = {1, 2, 2, 3}
print(s)`,
    sampleOutput: `value
{1, 2, 3}`,
    mastery: 'mastered',
    tags: ['dictionaries', 'sets', 'data-structures'],
    dateLearned: '2026-10-18',
  },
  {
    id: 'topic-loops',
    title: 'Loops in Python (while, for, range)',
    category: 'Loops & Time',
    summary: 'Mastering iteration with while and for loops, the range() function, and loop control statements.',
    notes: 'while repeats while true. for iterates sequences. range(start, stop, step) generates sequences. break/continue/pass manage flow, for-else handles natural completion.',
    codeSnippet: `for i in range(3):
    if i == 1: continue
    print(i)
else:
    print("Finished")`,
    sampleOutput: `0
2
Finished`,
    mastery: 'learning',
    tags: ['loops', 'iteration', 'control-flow', 'range'],
    dateLearned: '2026-10-18',
  },
  {
    id: 'topic-functions-recursion',
    title: 'Functions & Recursion',
    category: 'Basics & Syntax',
    summary: 'Mastering modular code with functions, arguments, return values, default parameters, and recursive calls.',
    notes: 'Functions use def to define reusable blocks. Use return for outputs. Default params set fallback values. Recursion is a function calling itself; needs a base condition to terminate.',
    codeSnippet: `def factorial(n):
    if n == 1: return 1
    return n * factorial(n - 1)

print(factorial(5))`,
    sampleOutput: `120`,
    mastery: 'learning',
    tags: ['functions', 'recursion', 'modularity'],
    dateLearned: '2026-10-18',
  },
  {
    id: 'topic-file-io',
    title: 'File I/O (Persistence & Context Managers)',
    category: 'I/O & Formatting',
    summary: 'Mastering permanent data storage using file I/O operations and context managers.',
    notes: 'Use open(filename, mode) for files. Modes: r (read), w (overwrite), a (append), b (binary). The with statement (context manager) automatically closes files, preventing memory leaks.',
    codeSnippet: `with open('test.txt', 'w') as f:
    f.write('Hello File!')

with open('test.txt', 'r') as f:
    print(f.read())`,
    sampleOutput: `Hello File!`,
    mastery: 'learning',
    tags: ['file-io', 'persistence', 'with-open'],
    dateLearned: '2026-10-18',
  },
];

export const INITIAL_USER_PROJECTS: UserProject[] = [
  {
    id: 'proj-countdown',
    title: 'Real-Time Countdown Timer',
    fileName: 'projects/countdown.py',
    category: 'CLI Utilities',
    description: 'An interactive CLI countdown timer asking for user input and streaming counts with 1-second delays using flush=True.',
    code: `import time
x = int(input('till what number do you want the countdown: '))
for t in range(x + 1):
    print(t, end='...', flush=True)
    time.sleep(1)
print("\\nCountdown completed!")`,
    expectedOutput: `till what number do you want the countdown: 5
0...1...2...3...4...5...
Countdown completed!`,
    status: 'completed',
    createdAt: '2026-10-10',
    updatedAt: '2026-10-15',
  },
  {
    id: 'proj-create-gen',
    title: 'Self-Generating Script (File Redirection)',
    fileName: 'create.py',
    category: 'Automation & File I/O',
    description: 'A dynamic script automatically generated by start1.py demonstrating file redirection in Python.',
    code: `print('hello, it is created by start1.py')`,
    expectedOutput: `hello, it is created by start1.py`,
    status: 'completed',
    createdAt: '2026-10-11',
    updatedAt: '2026-10-15',
  },
  {
    id: 'proj-calc',
    title: 'Interactive Math Calculator',
    fileName: 'projects/calculator.py',
    category: 'CLI Utilities',
    description: 'A modular CLI calculator using arithmetic and assignment operators to evaluate calculations with formatted precision.',
    code: `def calculate(a, b, op):
    if op == '+': return a + b
    elif op == '-': return a - b
    elif op == '*': return a * b
    elif op == '/': return a / b if b != 0 else 'Error: Div by zero'
    elif op == '%': return a % b
    elif op == '**': return a ** b
    return 'Unknown op'

a = 15
b = 4
for op in ['+', '-', '*', '/', '%', '**']:
    result = calculate(a, b, op)
    print(f"{a} {op} {b} = {result}")`,
    expectedOutput: `15 + 4 = 19
15 - 4 = 11
15 * 4 = 60
15 / 4 = 3.75
15 % 4 = 3
15 ** 4 = 50625`,
    status: 'completed',
    createdAt: '2026-10-12',
    updatedAt: '2026-10-15',
  },
];

export const PROJECT_TEMPLATES = [
  {
    title: 'Number Guessing Game',
    fileName: 'projects/guess_game.py',
    category: 'Games & Logic',
    description: 'Classic guess-the-number game with hints (higher/lower) and an attempt counter.',
    code: `import random

secret = random.randint(1, 20)
print("I'm thinking of a number between 1 and 20.")
attempts = 0

for guess in [7, 14, 11]:
    attempts += 1
    print(f"Guess: {guess}")
    if guess == secret:
        print(f"🎉 Correct in {attempts} tries!")
        break
    elif guess < secret:
        print("Too low! Aim higher...")
    else:
        print("Too high! Aim lower...")`,
  },
  {
    title: 'Password Generator CLI',
    fileName: 'projects/password_gen.py',
    category: 'Security & Utilities',
    description: 'Generates secure passwords combining letters, digits, and punctuation with custom length.',
    code: `import random
import string

def make_password(length=12):
    chars = string.ascii_letters + string.digits + "!@#$%^&*"
    return "".join(random.choice(chars) for _ in range(length))

print("Generated Passwords:")
for i in range(3):
    print(f"Key {i+1}: {make_password(14)}")`,
  },
  {
    title: 'Todo List Manager',
    fileName: 'projects/todo_manager.py',
    category: 'Data Structures',
    description: 'Simple in-memory dictionary-based task list with status tracking and completion toggles.',
    code: `todos = {
    1: {"task": "Learn print() mechanics", "done": True},
    2: {"task": "Practice operators and mutation", "done": True},
    3: {"task": "Build countdown timer project", "done": True},
    4: {"task": "Store my python learning projects", "done": False},
}

print("=== MY PYTHON LEARNING TASKS ===")
for id, item in todos.items():
    status = "✓ [DONE]" if item["done"] else "○ [PENDING]"
    print(f"{id}. {status} {item['task']}")`,
  },
];
