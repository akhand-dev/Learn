export interface ScriptFile {
  id: string;
  name: string;
  path: string;
  category: 'projects' | 'python' | 'generated';
  summary: string;
  topics: string[];
  code: string;
}

export const ORIGINAL_SCRIPTS: ScriptFile[] = [
  {
    id: 'countdown',
    name: 'countdown.py',
    path: 'projects/countdown.py',
    category: 'projects',
    summary: 'Real-time countdown timer leveraging time.sleep(1), loop iterations, and flush=True buffer control.',
    topics: ['time.sleep', 'loops', 'flush=True', 'end="..."', 'input()'],
    code: `import time
x = int(input('till what number do you want the countdown'))
for t in range(x + 1):
    print(t,end='...', flush= True)
    time.sleep(1)
`
  },
  {
    id: 'start1',
    name: 'start1.py',
    path: 'python/start1.py',
    category: 'python',
    summary: 'Comprehensive exploration of the print() function: *args, sep, end, file redirection, buffer flush, F-strings, unpacking, and __str__.',
    topics: ['*objects', 'sep parameter', 'end parameter', 'file redirection', 'flush control', 'f-strings', 'unpacking (*)', '__str__'],
    code: `#print
print('hello world') 

#The asterisk (*) means you can pass an unlimited number of objects separated by commas.
# You can mix data types (strings, integers, lists, etc.) freely.
print("Age:", 25, "Status:", True)
# Output: Age: 25 Status: True
name =  'akhand pratap singh'
print('my name is',name)

#sep (Separator)
#When you pass multiple objects, Python automatically places a space between them by default.
# You can change this behavior to use any string—or even nothing at all—by overriding
# Separate items with a hyphen
print("2026", "10", "04", sep="-") 
# Output: 2026-10-04
x = 2
y = 3
z = 4
print('using the sep parameter:',x, y, z, sep='\\n')
print('using ' '',x,y,z, sep = ' ')
print('using no space', x ,y , z, sep='')

# Remove spaces entirely
print("Home", "user", "documents", sep="/") 
# Output: Home/user/documents

#end (End of Line)
#By default, print() appends a newline character (\\n) to the very end of the output, causing the next print() statement to start on a fresh line.
# Overriding end lets you keep subsequent outputs on the same line.
print("Loading", end="... ")
print("Done!")
# Output: Loading... Done!

#file (Output Redirection)
#By default, print() sends text to sys.stdout (your terminal screen).
# However, you can redirect the output directly into a text file or an error stream (sys.stderr) using the file argument.
# Writing output directly to a file
with open('create.py', 'w') as py:
    print("print('hello, it is created by start1.py')", file=py)

#flush (Buffer Control)
#Python usually "buffers" text output for performance reasons, meaning it waits until it has a chunk of text before writing it to the screen or file.
# Setting flush=True forces Python to clear the buffer and immediately display the output. This is crucial for real-time progress bars or time-sensitive command-line tools.
import time

for i in range(2):
    print(i, end=" ", flush=True) # Forces immediate display
    time.sleep(0.5)

#Modern Python developers rarely concatenate strings manually using +.
# Instead, they format data right inside the print() function using F-strings (Formatted String Literals).
#F-Strings (Python 3.6+)
#Place an f right before the opening quote, and you can inject variables or evaluate mathematical expressions directly inside curly braces {}
name = "Alice"
price = 48.9487

# Injecting variables and rounding a float to 2 decimal places
print(f"Hello {name}, your total is \${price:.2f}")
# Output: Hello Alice, your total is $50.00
x = 'akhand'
y = float(87.78)
print(f'hello{name} , i know your age is {y:.2f}')

#If you have a list or tuple and want to print its contents separated by a character, you can combine the unpack operator (*) with the sep parameter.
fruits = ["Apple", "Banana", "Cherry"]

# Unpacks the list items as individual arguments to print
print(*fruits, sep=", ")
# Output: Apple, Banana, Cherry
print(fruits, sep=('- ')) # will not work # you have to use *to use the elements sepaerately

'''Customizing How Objects Print
When you pass a custom object (like a class instance) to print(), Python doesn't know how to format it and will display a generic memory address. You can fix this by defining the __str__ method inside your class to dictate exactly what print() should show.
'''
class Player:
    def __init__(self, username, level):
        self.username = username
        self.level = level
        
    def __str__(self):
        return f"Player: {self.username} (Level {self.level})"

p = Player("ShadowNinja", 42)
print(p) 
# Output: Player: ShadowNinja (Level 42)

#complete print 
#import sys
#print(*objects, sep=' ', end='\\n', file=sys.stdout, flush=False)
`
  },
  {
    id: 'print',
    name: 'print.py',
    path: 'python/print.py',
    category: 'python',
    summary: 'Core Python syntax: arithmetic operations, assignment mutation, custom printing wrappers, pip packages, and dictionaries.',
    topics: ['Arithmetic (+, -, *, /, %, **)', 'Assignment Operators (+=, -=, *=, /=)', 'Functions', 'input()', 'Pip & Modules', 'Dictionaries'],
    code: `#print
print('hi') #variable  --int, float, bool, None

#operators

#arithmetic
a = 10
b = 10
print(a+b)
print(a-b)
print(a*b)
print(a/b)
print('remainder',a%b)
print('expo',a**b)

#assingment
def p(c):
    print(c)

c = 10
p(c)
c += 10
p(c)
c -= 10
print(c)
c *= 10
p(c)
c /= 10
p(c)

x = input('enter your name:')
#module -- code written to be reused
#pip -- python install manager -- pip install flask, pip install pyjokes, pip pyttsx3


#dictories - unordered , mutable, indexed key_value
'''
methods = ['method1':'items()','method2':'keys()']
print(type(methods))
'''
`
  },
  {
    id: 'create',
    name: 'create.py',
    path: 'create.py',
    category: 'generated',
    summary: 'A dynamic script generated at runtime by start1.py via file redirection `file=py`.',
    topics: ['File Output Redirection', 'Automated Code Generation'],
    code: `print('hello, it is created by start1.py')
`
  }
];

export const PYTHON_JOKES = [
  "Why do Python programmers prefer dark mode? Because light attracts bugs!",
  "There are 10 types of people in the world: those who understand binary, and those who don't.",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
  "Why was the JavaScript developer sad? Because he didn't Node how to Express himself.",
  "Python: where indentation errors teach you discipline you never had.",
  "['hip', 'hip']! (hip hip array!)"
];
