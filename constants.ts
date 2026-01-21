
import { Category } from './types';

export const CONTENT_DATA: Category[] = [
  // --- GROUP: PROGRAMMING LANGUAGES ---
  {
      id: 'c-programming',
      title: 'C Programming',
      group: 'Programming Languages',
      chapters: [
          {
              id: 'c-foundations',
              title: 'C Foundations',
              topics: [
                  { id: 'c-basics', title: 'Basics & Compilation', content: 'Structure of C, Compilation stages (Pre-processing, Compilation, Assembly, Linking), Data Types.' },
                  { id: 'c-control', title: 'Control Flow', content: 'Loops (for, while, do-while), Switch-case, Conditional Statements (if-else).' },
                  { id: 'c-funcs', title: 'Functions & Recursion', content: 'Function definition, Call stack, Recursion vs Iteration, Scope rules.' }
              ]
          },
          {
              id: 'c-memory',
              title: 'Pointers & Memory',
              topics: [
                  { id: 'c-pointers', title: 'Pointers Masterclass', content: 'Pointer arithmetic, Double pointers, Void pointers, Function pointers.' },
                  { id: 'c-mem-mgmt', title: 'Dynamic Memory', content: 'malloc, calloc, realloc, free, Memory Leaks, Heap vs Stack.' },
                  { id: 'c-arrays', title: 'Arrays & Strings', content: '1D/2D Arrays, String manipulation (<string.h>), Array decay to pointers.' }
              ]
          },
          {
              id: 'c-advanced-structs',
              title: 'Advanced C',
              topics: [
                  { id: 'c-structs', title: 'Structures & Unions', content: 'struct memory layout, Padding, Bit-fields, Unions, typedef.' },
                  { id: 'c-io', title: 'File I/O & Preprocessor', content: 'File modes, binary vs text files, Macros (#define), Conditional compilation.' }
              ]
          }
      ]
  },
  {
      id: 'cpp-programming',
      title: 'C++ Programming',
      group: 'Programming Languages',
      chapters: [
          {
              id: 'cpp-green-basic',
              title: '🟢 C++ Basic Topics',
              topics: [
                  { id: 'cpp-hello', title: 'Hello World', content: 'Basic syntax, main function structure, headers.' },
                  { id: 'cpp-compilation', title: 'Compilation Process', content: 'Preprocessing, Compilation, Assembly, Linking.' },
                  { id: 'cpp-comments', title: 'Comments', content: 'Single line vs Multi-line comments, Documentation.' },
                  { id: 'cpp-funcs-basic', title: 'Functions', content: 'Declaration, Definition, Parameters, Return types.' },
                  { id: 'cpp-preprocessor', title: 'Preprocessor', content: '#include, #define, Macros.' },
                  { id: 'cpp-datatypes', title: 'Data Types', content: 'int, float, double, char, bool, void, modifiers.' },
                  { id: 'cpp-literals', title: 'Literals', content: 'Integer, Float, Character, String literals.' },
                  { id: 'cpp-operators', title: 'Operators', content: 'Arithmetic, Relational, Logical, Bitwise.' },
                  { id: 'cpp-precedence', title: 'Operator Precedence', content: 'Order of evaluation, associativity.' },
                  { id: 'cpp-conditionals', title: 'Conditional Statements', content: 'if, else if, else, switch-case.' },
                  { id: 'cpp-loops', title: 'Loops', content: 'for, while, do-while loops.' },
                  { id: 'cpp-arrays', title: 'Arrays', content: 'Fixed size arrays, multidimensional arrays.' },
                  { id: 'cpp-strings', title: 'Strings', content: 'C-style strings vs std::string.' }
              ]
          },
          {
              id: 'cpp-yellow-core',
              title: '🟡 Core C++ Topics',
              topics: [
                  { id: 'cpp-pointers', title: 'Pointers', content: 'Memory addresses, pointer arithmetic, null pointers.' },
                  { id: 'cpp-refs', title: 'References', content: 'Reference variables, references vs pointers.' },
                  { id: 'cpp-call-val-ref', title: 'Call by Value & Reference', content: 'Passing arguments effectively.' },
                  { id: 'cpp-overloading', title: 'Function Overloading', content: 'Same name, different parameters.' },
                  { id: 'cpp-inline', title: 'Inline Functions', content: 'Optimization hints to compiler.' },
                  { id: 'cpp-this', title: 'this Pointer', content: 'Pointer to the current object instance.' },
                  { id: 'cpp-memory', title: 'Memory (Stack & Heap)', content: 'Stack allocation vs Heap allocation.' }
              ]
          },
          {
              id: 'cpp-blue-oop',
              title: '🔵 OOP in C++',
              topics: [
                  { id: 'cpp-class-struct', title: 'Class & Struct', content: 'Differences, default access specifiers.' },
                  { id: 'cpp-access', title: 'Access Specifiers', content: 'public, private, protected.' },
                  { id: 'cpp-constructors', title: 'Constructors', content: 'Default, Parameterized, Copy constructors.' },
                  { id: 'cpp-destructors', title: 'Destructors', content: 'Cleanup resources, ~ClassName.' },
                  { id: 'cpp-inheritance', title: 'Inheritance', content: 'Base and Derived classes, types of inheritance.' },
                  { id: 'cpp-polymorphism', title: 'Polymorphism', content: 'Compile-time vs Run-time polymorphism.' },
                  { id: 'cpp-virtual', title: 'Virtual Functions', content: 'vtable, vptr, dynamic dispatch.' },
                  { id: 'cpp-override', title: 'override & final', content: 'C++11 keywords for safety.' },
                  { id: 'cpp-op-overload', title: 'Operator Overloading', content: 'Customizing operator behavior for classes.' },
                  { id: 'cpp-const', title: 'Const Correctness', content: 'const member functions, const arguments.' }
              ]
          },
          {
              id: 'cpp-orange-stl',
              title: '🟠 STL & Modern C++',
              topics: [
                  { id: 'cpp-vector', title: 'std::vector', content: 'Dynamic arrays, push_back, resizing.' },
                  { id: 'cpp-array', title: 'std::array', content: 'Fixed size array wrapper.' },
                  { id: 'cpp-map', title: 'std::map', content: 'Ordered key-value pairs (Red-Black Tree).' },
                  { id: 'cpp-unordered-map', title: 'std::unordered_map', content: 'Hash map implementation.' },
                  { id: 'cpp-set', title: 'std::set', content: 'Unique sorted elements.' },
                  { id: 'cpp-iterators', title: 'Iterators', content: 'begin(), end(), traversal.' },
                  { id: 'cpp-algos', title: 'Algorithms', content: 'sort, find, count, binary_search.' },
                  { id: 'cpp-lambda', title: 'Lambda Expressions', content: 'Anonymous functions, capture lists.' },
                  { id: 'cpp-auto', title: 'auto', content: 'Type inference.' },
                  { id: 'cpp-decltype', title: 'decltype', content: 'Inspecting types.' },
                  { id: 'cpp-deduction', title: 'Type Deduction', content: 'Template and auto type deduction rules.' }
              ]
          },
          {
              id: 'cpp-red-advanced',
              title: '🔴 Advanced C++',
              topics: [
                  { id: 'cpp-templates', title: 'Templates', content: 'Generic programming, function and class templates.' },
                  { id: 'cpp-temp-spec', title: 'Template Specialization', content: 'Full and partial specialization.' },
                  { id: 'cpp-constexpr', title: 'constexpr', content: 'Compile-time evaluation.' },
                  { id: 'cpp-static-assert', title: 'static_assert', content: 'Compile-time assertions.' },
                  { id: 'cpp-move', title: 'Move Semantics', content: 'std::move, r-value references.' },
                  { id: 'cpp-rule-of', title: 'Rule of 3 / 5 / 0', content: 'Resource management rules.' },
                  { id: 'cpp-smart-ptrs', title: 'Smart Pointers', content: 'unique_ptr, shared_ptr, weak_ptr.' },
                  { id: 'cpp-exceptions', title: 'Exception Handling', content: 'try, catch, throw, RAII.' }
              ]
          },
          {
              id: 'cpp-black-threads',
              title: '⚫ Multithreading',
              topics: [
                  { id: 'cpp-thread', title: 'std::thread', content: 'Creating and managing threads.' },
                  { id: 'cpp-mutex', title: 'std::mutex', content: 'Mutual exclusion.' },
                  { id: 'cpp-lock-guard', title: 'lock_guard', content: 'RAII wrapper for mutex.' },
                  { id: 'cpp-cond-var', title: 'condition_variable', content: 'Thread synchronization.' },
                  { id: 'cpp-atomic', title: 'std::atomic', content: 'Atomic operations.' }
              ]
          },
          {
              id: 'cpp-purple-expert',
              title: '🟣 Expert / Optional',
              topics: [
                  { id: 'cpp-metaprog', title: 'Metaprogramming', content: 'Code that generates code.' },
                  { id: 'cpp-crtp', title: 'CRTP', content: 'Curiously Recurring Template Pattern.' },
                  { id: 'cpp-type-erasure', title: 'Type Erasure', content: 'std::any, std::variant.' },
                  { id: 'cpp-patterns', title: 'Design Patterns', content: 'Singleton, Factory, Observer in C++.' },
                  { id: 'cpp-build', title: 'Build Systems (CMake)', content: 'CMakeLists.txt basics.' },
                  { id: 'cpp-optimization', title: 'Optimization', content: 'Memory layout, cache locality.' },
                  { id: 'cpp-profiling', title: 'Profiling', content: 'Analyzing performance.' }
              ]
          }
      ]
  },
  {
      id: 'java-programming',
      title: 'Java Programming',
      group: 'Programming Languages',
      chapters: [
          {
              id: 'java-core',
              title: 'Java Core',
              topics: [
                  { id: 'java-jvm', title: 'JVM Architecture', content: 'ClassLoader, JIT, Memory Areas.' },
                  { id: 'java-oop-concepts', title: 'OOP Deep Dive', content: 'Interface vs Abstract Class, Polymorphism.' },
                  { id: 'java-exceptions', title: 'Exception Hierarchy', content: 'Checked vs Unchecked Exceptions.' }
              ]
          },
          {
              id: 'java-advanced',
              title: 'Java Advanced',
              topics: [
                  { id: 'java-collections', title: 'Collections Framework', content: 'Internal working of HashMap, HashSet, ArrayList.' },
                  { id: 'java-streams', title: 'Streams API', content: 'Filter, Map, Reduce, Collectors.' },
                  { id: 'java-threads', title: 'Multithreading', content: 'ExecutorService, CompletableFuture, Synchronization.' }
              ]
          }
      ]
  },
  {
      id: 'python-mastery',
      title: 'Python Programming',
      group: 'Programming Languages',
      chapters: [
          {
              id: 'py-basics',
              title: 'Python Essentials',
              topics: [
                  { id: 'py-syntax', title: 'Syntax & Types', content: 'Variables, Indentation, Dynamic Typing, Strings, Numbers.' },
                  { id: 'py-control', title: 'Control Flow', content: 'if-elif-else, for loops, while loops, break/continue, range().' },
                  { id: 'py-ds', title: 'Data Structures', content: 'Lists, Tuples, Dictionaries, Sets, List Comprehensions.' }
              ]
          },
          {
              id: 'py-advanced',
              title: 'Advanced Python',
              topics: [
                  { id: 'py-oop', title: 'OOP in Python', content: 'Classes, self, __init__, Inheritance, Magic Methods (dunder).' },
                  { id: 'py-func', title: 'Functional Python', content: 'Lambda, map, filter, reduce, Decorators, Generators, Iterators.' },
                  { id: 'py-libs', title: 'Libraries Overview', content: 'Intro to NumPy, Pandas, Requests, Flask/Django basics.' }
              ]
          }
      ]
  },

  // --- GROUP: WEB DEVELOPMENT ---
  {
    id: 'frontend-foundations',
    title: 'Frontend Foundations',
    group: 'Web Development',
    chapters: [
      {
        id: 'frontend-basics',
        title: 'HTML, CSS & JS',
        topics: [
            { id: 'html-css', title: 'HTML5 & CSS3 Structure', content: 'Semantic HTML, Box Model, Flexbox, Grid Layout, Responsive Design.' },
            { id: 'js-essentials', title: 'JavaScript Essentials', content: 'ES6+ Syntax, DOM Manipulation, Event Handling, Async/Await, Promises.' },
            { id: 'ts-basics', title: 'TypeScript Fundamentals', content: 'Static Typing, Interfaces, Generics, Enums, Type Inference.' }
        ]
      }
    ]
  },
  {
    id: 'react-ecosystem',
    title: 'Modern React.js',
    group: 'Web Development',
    chapters: [
      {
        id: 'modern-react',
        title: 'React Core',
        topics: [
          {
              id: 'react-components',
              title: 'React Components & JSX',
              content: 'Functional Components, JSX Rules, Props, State, Component Lifecycle.'
          },
          {
              id: 'react-hooks',
              title: 'React Hooks Deep Dive',
              content: 'useState, useEffect, useContext, useReducer, useMemo, useCallback, Custom Hooks.'
          },
          {
              id: 'react-router',
              title: 'Routing & Navigation',
              content: 'React Router v6, Dynamic Routes, Nested Routes, Protected Routes.'
          },
          {
              id: 'state-mgmt',
              title: 'Global State (Redux/Zustand)',
              content: 'Redux Toolkit, Slices, Async Thunks, Context API, Zustand basics.'
          }
        ]
      }
    ]
  },
  {
    id: 'nodejs-complete',
    title: 'Node.js Complete',
    group: 'Web Development',
    chapters: [
      {
        id: 'node-green-basic',
        title: 'Node.js Basics',
        topics: [
          { id: 'node-intro', title: 'Getting Started with Node.js', content: 'What is Node.js, use cases, architecture overview.' },
          { id: 'node-install', title: 'Installing & Uninstalling Node.js', content: 'Install, uninstall, verify Node.js.' },
          { id: 'node-history', title: 'Node.js History', content: 'Evolution and versions.' },
          { id: 'node-usecases', title: 'Use Cases of Node.js', content: 'Where Node.js fits best.' },
          { id: 'node-repl', title: 'Interacting with Console', content: 'REPL, STDIN, STDOUT.' },
          { id: 'node-cli', title: 'CLI & Command Line Arguments', content: 'Parsing CLI arguments.' }
        ]
      },
      {
        id: 'node-yellow-modules',
        title: 'Modules & Packages',
        topics: [
          { id: 'node-modules', title: 'Modules & require()', content: 'Exporting and importing modules.' },
          { id: 'node-module-load', title: 'How Modules are Loaded', content: 'Module resolution and caching.' },
          { id: 'node-package', title: 'package.json', content: 'Dependencies, scripts, metadata.' },
          { id: 'node-npm', title: 'npm & Yarn', content: 'Package managers.' },
          { id: 'node-nvm', title: 'nvm', content: 'Node version management.' }
        ]
      },
      {
        id: 'node-blue-core',
        title: 'Core Node.js',
        topics: [
          { id: 'node-fs', title: 'Filesystem I/O', content: 'Reading and writing files.' },
          { id: 'node-http', title: 'HTTP Module', content: 'Creating HTTP servers.' },
          { id: 'node-events', title: 'Event Emitters', content: 'Event-driven programming.' },
          { id: 'node-streams', title: 'Streams', content: 'Readable, Writable streams.' },
          { id: 'node-readline', title: 'Readline', content: 'User input handling.' },
          { id: 'node-child', title: 'Child Processes', content: 'Executing commands and files.' }
        ]
      },
      {
        id: 'node-orange-async',
        title: 'Asynchronous Programming',
        topics: [
          { id: 'node-sync-async', title: 'Sync vs Async', content: 'Blocking vs non-blocking.' },
          { id: 'node-callbacks', title: 'Callbacks', content: 'Error-first callbacks.' },
          { id: 'node-promises', title: 'Promises', content: 'Promise chaining.' },
          { id: 'node-async-await', title: 'Async/Await', content: 'Modern async handling.' },
          { id: 'node-avoid-hell', title: 'Avoid Callback Hell', content: 'Better async patterns.' },
          { id: 'node-eventloop', title: 'Event Loop', content: 'Node.js event loop internals.' }
        ]
      },
      {
        id: 'node-red-express',
        title: 'Web Apps with Express',
        topics: [
          { id: 'express-intro', title: 'Express Basics', content: 'Web framework overview.' },
          { id: 'express-routing', title: 'Routing', content: 'GET, POST, PUT, DELETE.' },
          { id: 'express-post', title: 'Handling POST Requests', content: 'Request body parsing.' },
          { id: 'express-rest', title: 'REST CRUD APIs', content: 'Building RESTful APIs.' },
          { id: 'express-structure', title: 'Project Structure', content: 'Route-Controller-Service pattern.' },
          { id: 'express-static', title: 'Serving Files', content: 'Deliver HTML and assets.' }
        ]
      },
      {
        id: 'node-purple-db',
        title: 'Databases',
        topics: [
          { id: 'node-mongo', title: 'MongoDB Integration', content: 'Connecting MongoDB.' },
          { id: 'node-mongoose', title: 'Mongoose', content: 'Schemas and models.' },
          { id: 'node-sql', title: 'SQL Databases', content: 'MySQL, PostgreSQL, MSSQL.' },
          { id: 'node-pooling', title: 'Connection Pooling', content: 'Efficient DB connections.' },
          { id: 'node-redis', title: 'Redis', content: 'Caching and sessions.' }
        ]
      },
      {
        id: 'node-black-realtime',
        title: 'Realtime & Networking',
        topics: [
          { id: 'node-socket', title: 'Socket.io', content: 'Realtime communication.' },
          { id: 'node-websocket', title: 'WebSockets', content: 'Bi-directional communication.' },
          { id: 'node-tcp', title: 'TCP Sockets', content: 'Low-level networking.' },
          { id: 'node-client-server', title: 'Client-Server Communication', content: 'Networking basics.' }
        ]
      },
      {
        id: 'node-auth-security',
        title: 'Security & Authentication',
        topics: [
          { id: 'node-security', title: 'Securing Node.js Apps', content: 'Best security practices.' },
          { id: 'node-cors', title: 'CORS', content: 'Cross-origin handling.' },
          { id: 'node-passport', title: 'Passport.js', content: 'Authentication strategies.' },
          { id: 'node-oauth', title: 'OAuth 2.0', content: 'Third-party authentication.' }
        ]
      },
      {
        id: 'node-devops',
        title: 'Production & Performance',
        topics: [
          { id: 'node-env', title: 'Environment Variables', content: 'Config management.' },
          { id: 'node-keepalive', title: 'Running Node as Service', content: 'PM2 and services.' },
          { id: 'node-graceful', title: 'Graceful Shutdown', content: 'Safe app termination.' },
          { id: 'node-performance', title: 'Performance Optimization', content: 'Common bottlenecks.' },
          { id: 'node-profiling', title: 'Profiling & Debugging', content: 'Performance analysis.' },
          { id: 'node-deploy', title: 'Deployment', content: 'Production deployment strategies.' }
        ]
      },
      {
        id: 'node-expert-optional',
        title: 'Advanced / Optional',
        topics: [
          { id: 'node-cluster', title: 'Cluster & Multithreading', content: 'Scaling Node apps.' },
          { id: 'node-worker', title: 'Worker Threads', content: 'CPU intensive tasks.' },
          { id: 'node-napi', title: 'N-API', content: 'Native addons.' },
          { id: 'node-di', title: 'Dependency Injection', content: 'Loose coupling.' },
          { id: 'node-testing', title: 'Unit Testing', content: 'Testing frameworks.' }
        ]
      }
    ]
  },

  // --- GROUP: DATABASES ---
  {
      id: 'mysql-database',
      title: 'MySQL Database',
      group: 'Databases',
      chapters: [
        {
          id: 'mysql-green-basic',
          title: '🟢 MySQL Basic Topics',
          topics: [
            { id: 'mysql-intro', title: 'Getting Started with MySQL', content: 'What is MySQL, installation, basic concepts.' },
            { id: 'mysql-client', title: 'MySQL Client', content: 'mysql CLI, connecting to server.' },
            { id: 'mysql-databases', title: 'Creating Databases', content: 'CREATE DATABASE, USE database.' },
            { id: 'mysql-tables', title: 'Table Creation', content: 'CREATE TABLE syntax, schema design.' },
            { id: 'mysql-datatypes', title: 'Data Types', content: 'Numeric, string, date/time data types.' },
            { id: 'mysql-null', title: 'NULL', content: 'NULL values, IS NULL, IS NOT NULL.' },
            { id: 'mysql-comments', title: 'Comments', content: 'Single-line and multi-line comments.' },
            { id: 'mysql-reserved', title: 'Reserved Words', content: 'Keywords and escaping with backticks.' }
          ]
        },
        {
          id: 'mysql-yellow-crud',
          title: '🟡 CRUD Operations',
          topics: [
            { id: 'mysql-select', title: 'SELECT', content: 'Fetching data from tables.' },
            { id: 'mysql-insert', title: 'INSERT', content: 'Inserting single and multiple rows.' },
            { id: 'mysql-update', title: 'UPDATE', content: 'Updating existing records.' },
            { id: 'mysql-delete', title: 'DELETE', content: 'Removing records safely.' },
            { id: 'mysql-orderby', title: 'ORDER BY', content: 'Sorting query results.' },
            { id: 'mysql-limit', title: 'LIMIT & OFFSET', content: 'Pagination of results.' },
            { id: 'mysql-backticks', title: 'Backticks', content: 'Escaping identifiers.' }
          ]
        },
        {
          id: 'mysql-blue-queries',
          title: '🔵 Query Operations',
          topics: [
            { id: 'mysql-groupby', title: 'GROUP BY', content: 'Grouping rows with aggregate functions.' },
            { id: 'mysql-only-full', title: 'ONLY_FULL_GROUP_BY Error', content: 'Understanding SQL mode error 1055.' },
            { id: 'mysql-arithmetic', title: 'Arithmetic Operations', content: 'Math operations in queries.' },
            { id: 'mysql-strings', title: 'String Operations', content: 'CONCAT, SUBSTRING, LENGTH.' },
            { id: 'mysql-datetime', title: 'Date & Time Operations', content: 'DATE, TIME, TIMESTAMP functions.' },
            { id: 'mysql-timezone', title: 'Time Zones', content: 'Handling time zones correctly.' }
          ]
        },
        {
          id: 'mysql-orange-joins',
          title: '🟠 Joins & Set Operations',
          topics: [
            { id: 'mysql-joins', title: 'Joins', content: 'INNER, LEFT, RIGHT joins.' },
            { id: 'mysql-multi-joins', title: 'Joining Multiple Tables', content: 'Joining 3 or more tables.' },
            { id: 'mysql-union', title: 'UNION', content: 'Combining result sets.' }
          ]
        },
        {
          id: 'mysql-red-schema',
          title: '🔴 Schema & Objects',
          topics: [
            { id: 'mysql-alter', title: 'ALTER TABLE', content: 'Modify table structure.' },
            { id: 'mysql-drop', title: 'DROP TABLE', content: 'Deleting tables.' },
            { id: 'mysql-temp', title: 'Temporary Tables', content: 'Session-based tables.' },
            { id: 'mysql-enum', title: 'ENUM', content: 'Enum data type usage.' },
            { id: 'mysql-view', title: 'VIEW', content: 'Virtual tables.' },
            { id: 'mysql-index', title: 'Indexes & Keys', content: 'Primary, unique, secondary indexes.' },
            { id: 'mysql-fulltext', title: 'Full-Text Search', content: 'Text searching with FULLTEXT indexes.' }
          ]
        },
        {
          id: 'mysql-black-advanced',
          title: '⚫ Advanced MySQL',
          topics: [
            { id: 'mysql-procedures', title: 'Stored Procedures', content: 'Reusable SQL logic.' },
            { id: 'mysql-functions', title: 'Functions', content: 'User-defined functions.' },
            { id: 'mysql-triggers', title: 'Triggers', content: 'Automatic actions on events.' },
            { id: 'mysql-events', title: 'Events', content: 'Scheduled jobs.' },
            { id: 'mysql-prepare', title: 'Prepared Statements', content: 'Dynamic and secure queries.' },
            { id: 'mysql-json', title: 'JSON', content: 'JSON data type and usage.' },
            { id: 'mysql-json-extract', title: 'Extract JSON Values', content: 'JSON_EXTRACT and operators.' },
            { id: 'mysql-regex', title: 'Regular Expressions', content: 'Pattern matching.' }
          ]
        },
        {
          id: 'mysql-purple-transactions',
          title: '🟣 Transactions & Storage',
          topics: [
            { id: 'mysql-transaction', title: 'Transactions', content: 'ACID properties.' },
            { id: 'mysql-lock', title: 'LOCK TABLE', content: 'Table-level locking.' },
            { id: 'mysql-relations', title: 'One to Many', content: 'Relational modeling.' },
            { id: 'mysql-engines', title: 'Storage Engines', content: 'InnoDB vs MyISAM.' },
            { id: 'mysql-convert', title: 'MyISAM to InnoDB', content: 'Engine migration.' }
          ]
        },
        {
          id: 'mysql-admin',
          title: 'Administration & Security',
          topics: [
            { id: 'mysql-users', title: 'Create User', content: 'User management.' },
            { id: 'mysql-grants', title: 'GRANT & REVOKE', content: 'Privileges and security.' },
            { id: 'mysql-password', title: 'Change Password', content: 'Credential management.' },
            { id: 'mysql-ssl', title: 'SSL Connection', content: 'Secure connections.' },
            { id: 'mysql-recover', title: 'Recover Root Password', content: 'Password recovery steps.' },
            { id: 'mysql-logs', title: 'Log Files', content: 'Error and query logs.' },
            { id: 'mysql-errors', title: 'Error Codes', content: 'Common MySQL errors.' },
            { id: 'mysql-server-info', title: 'Server Information', content: 'Server status and variables.' }
          ]
        },
        {
          id: 'mysql-devops',
          title: 'Performance & DevOps',
          topics: [
            { id: 'mysql-performance', title: 'Performance Tips', content: 'Query optimization basics.' },
            { id: 'mysql-tuning', title: 'Performance Tuning', content: 'Configuration tuning.' },
            { id: 'mysql-replication', title: 'Replication', content: 'Master-slave replication.' },
            { id: 'mysql-cluster', title: 'Clustering', content: 'High availability.' },
            { id: 'mysql-partition', title: 'Partitioning', content: 'Large table optimization.' },
            { id: 'mysql-backup', title: 'mysqldump', content: 'Backup and restore.' },
            { id: 'mysql-import', title: 'mysqlimport & LOAD DATA', content: 'Bulk data import.' },
            { id: 'mysql-docker', title: 'MySQL with Docker Compose', content: 'Containerized MySQL setup.' },
            { id: 'mysql-charset', title: 'Character Sets & Collations', content: 'UTF-8 and encoding.' }
          ]
        }
      ]
  },

// ================================
// --- GROUP: COMPUTER SCIENCE CORE ---
// ================================

{
  id: 'cs-core-subjects',
  title: 'CS Core Subjects',
  group: 'Computer Science Core',
  chapters: [

    // ---------------- OS ----------------
    {
      id: 'os-module',
      title: 'Operating Systems',
      topics: [
        {
          id: 'os-intro',
          title: 'OS Basics & Kernel',
          content: 'Types of OS, Kernel vs Shell, System Calls, User Mode vs Kernel Mode.'
        },
        {
          id: 'os-process',
          title: 'Processes & Threads',
          content: 'Process states, PCB, Threads vs Processes, Context Switching.'
        },
        {
          id: 'process-sched',
          title: 'CPU Scheduling',
          content: 'FCFS, SJF, Priority, Round Robin, Scheduling criteria.'
        },
        {
          id: 'sync-deadlock',
          title: 'Synchronization & Deadlocks',
          content: 'Critical section, Semaphores, Mutex, Monitors, Deadlock conditions, Banker’s Algorithm.'
        },
        {
          id: 'mem-mgmt',
          title: 'Memory Management',
          content: 'Paging, Segmentation, Virtual Memory, Page Replacement (FIFO, LRU, Optimal).'
        },
        {
          id: 'storage',
          title: 'Storage & File Systems',
          content: 'Disk scheduling, File allocation methods, RAID levels.'
        }
      ]
    },

    // ---------------- DBMS ----------------
    {
      id: 'dbms-module',
      title: 'Database Management Systems',
      topics: [
        {
          id: 'dbms-intro',
          title: 'DBMS Basics',
          content: 'DBMS vs RDBMS, Schema, Instance, Data independence.'
        },
        {
          id: 'sql-core',
          title: 'SQL Queries',
          content: 'DDL, DML, DCL, Joins, Subqueries, Views.'
        },
        {
          id: 'er-model',
          title: 'ER & Relational Model',
          content: 'Entities, Attributes, Relationships, Keys.'
        },
        {
          id: 'normalization',
          title: 'Normalization',
          content: '1NF, 2NF, 3NF, BCNF, Trade-offs.'
        },
        {
          id: 'trans-concur',
          title: 'Transactions & Concurrency',
          content: 'ACID, Isolation levels, Locking, MVCC.'
        },
        {
          id: 'indexing',
          title: 'Indexing & Optimization',
          content: 'B-Tree, B+ Tree, Hash Indexing, Query Optimization.'
        }
      ]
    },

    // ---------------- COMPUTER NETWORKS ----------------
    {
      id: 'networks-module',
      title: 'Computer Networks',
      topics: [
        {
          id: 'net-intro',
          title: 'Network Basics',
          content: 'Definition, types of networks, components, topologies.'
        },
        {
          id: 'net-models',
          title: 'OSI & TCP/IP Models',
          content: 'Layered architecture, encapsulation, PDUs.'
        },
        {
          id: 'app-layer',
          title: 'Application Layer',
          content: 'HTTP/HTTPS, DNS, FTP, SMTP, SSH, DHCP.'
        },
        {
          id: 'transport-layer',
          title: 'Transport Layer',
          content: 'TCP vs UDP, 3-way handshake, flow & congestion control.'
        },
        {
          id: 'network-layer',
          title: 'Network Layer',
          content: 'IP addressing, subnetting, routing (OSPF, RIP, BGP).'
        },
        {
          id: 'link-physical',
          title: 'Data Link & Physical Layer',
          content: 'MAC, Ethernet, Switching, CSMA/CD, Cabling.'
        },
        {
          id: 'net-security',
          title: 'Network Security',
          content: 'Firewalls, VPN, SSL/TLS, common attacks.'
        }
      ]
    }
  ]
},

// ================================
// --- GROUP: DATA STRUCTURES & ALGORITHMS ---
// ================================

{
  id: 'cs-dsa',
  title: 'Data Structures & Algorithms',
  group: 'Computer Science Core',
  chapters: [

    {
      id: 'dsa-linear',
      title: 'Linear Data Structures',
      topics: [
        {
          id: 'arrays-strings',
          title: 'Arrays & Strings',
          content: 'Two pointers, sliding window, prefix sum.'
        },
        {
          id: 'linked-lists',
          title: 'Linked Lists',
          content: 'Singly, Doubly, Circular, Fast & Slow pointers.'
        },
        {
          id: 'stacks-queues',
          title: 'Stacks & Queues',
          content: 'Monotonic stack, priority queue, deque.'
        }
      ]
    },

    {
      id: 'dsa-trees-graphs',
      title: 'Trees & Graphs',
      topics: [
        {
          id: 'trees',
          title: 'Trees & BST',
          content: 'Traversals, BST, AVL, Trie.'
        },
        {
          id: 'heaps',
          title: 'Heaps',
          content: 'Min/Max heap, Heap sort, Top-K problems.'
        },
        {
          id: 'graphs',
          title: 'Graphs',
          content: 'BFS, DFS, Dijkstra, Bellman-Ford, MST.'
        }
      ]
    },

    {
      id: 'dsa-algos',
      title: 'Core Algorithms',
      topics: [
        {
          id: 'sorting-searching',
          title: 'Sorting & Searching',
          content: 'Merge, Quick, Binary Search.'
        },
        {
          id: 'dp',
          title: 'Dynamic Programming',
          content: 'Knapsack, LCS, LIS.'
        },
        {
          id: 'backtracking',
          title: 'Backtracking & Greedy',
          content: 'N-Queens, Huffman, Activity selection.'
        }
      ]
    }
  ]
},

// ================================
// --- GROUP: SYSTEM DESIGN ---
// ================================

{
  id: 'system-design',
  title: 'System Design & Architecture',
  group: 'Computer Science Core',
  chapters: [

    {
      id: 'sys-basics',
      title: 'Design Fundamentals',
      topics: [
        {
          id: 'scaling',
          title: 'Scalability',
          content: 'Horizontal vs Vertical scaling, caching, load balancing.'
        },
        {
          id: 'db-design',
          title: 'Database Design',
          content: 'Replication, sharding, CAP theorem.'
        },
        {
          id: 'comm-protocols',
          title: 'Communication Protocols',
          content: 'REST, GraphQL, gRPC, WebSockets.'
        }
      ]
    },

    {
      id: 'sys-advanced',
      title: 'Advanced Systems',
      topics: [
        {
          id: 'dist-systems',
          title: 'Distributed Systems',
          content: 'Consistency, consensus (Paxos, Raft), MapReduce.'
        },
        {
          id: 'high-level',
          title: 'High Level Design',
          content: 'Designing large scale systems (URL shortener, chat app).'
        }
      ]
    }
  ]
},

// ================================
// --- GROUP: MATHEMATICS FOR CS ---
// ================================

{
  id: 'cs-math',
  title: 'Mathematics for Computer Science',
  group: 'Computer Science Core',
  chapters: [
    {
      id: 'discrete-math',
      title: 'Discrete Mathematics',
      topics: [
        {
          id: 'sets-logic',
          title: 'Sets & Logic',
          content: 'Set theory, propositional & predicate logic.'
        },
        {
          id: 'graph-theory',
          title: 'Graph Theory',
          content: 'Euler, Hamiltonian paths, coloring.'
        },
        {
          id: 'combinatorics',
          title: 'Combinatorics',
          content: 'Permutations, combinations, recurrence relations.'
        }
      ]
    }
  ]
},

  // --- GROUP: MODERN TECH & ENGINEERING ---
  {
      id: 'cloud-computing',
      title: 'Cloud Computing',
      group: 'Modern Tech & Engineering',
      chapters: [
          {
              id: 'cloud-basics',
              title: 'Cloud Concepts',
              topics: [
                  { id: 'service-models', title: 'IaaS, PaaS, SaaS', content: 'Service models definitions, examples, and trade-offs.' },
                  { id: 'deploy-models', title: 'Deployment Models', content: 'Public, Private, Hybrid, Community Cloud.' }
              ]
          },
          {
              id: 'aws-services',
              title: 'AWS Essentials',
              topics: [
                  { id: 'compute-storage', title: 'Compute & Storage', content: 'EC2, Lambda, S3, EBS, Glacier.' },
                  { id: 'networking-db', title: 'Networking & DB', content: 'VPC, Route53, RDS, DynamoDB.' }
              ]
          }
      ]
  },
  {
      id: 'ai-ml',
      title: 'Artificial Intelligence & ML',
      group: 'Modern Tech & Engineering',
      chapters: [
          {
              id: 'ml-foundations',
              title: 'ML Foundations',
              topics: [
                  { id: 'sup-unsup', title: 'Supervised vs Unsupervised', content: 'Regression, Classification, Clustering, Dimensionality Reduction.' },
                  { id: 'nn-dl', title: 'Neural Networks', content: 'Perceptron, Activation Functions, Backpropagation, CNN, RNN.' }
              ]
          },
          {
              id: 'gen-ai',
              title: 'Generative AI & LLMs',
              topics: [
                  { id: 'transformers', title: 'Transformers & Attention', content: 'Encoder-Decoder, Self-Attention, Multi-Head Attention, GPT architecture.' },
                  { id: 'prompt-eng', title: 'Prompt Engineering', content: 'Zero-shot, Few-shot, Chain of Thought, RAG basics.' }
              ]
          }
      ]
  },
  {
      id: 'eng-hardware',
      title: 'Engineering & Hardware',
      group: 'Modern Tech & Engineering',
      chapters: [
          {
              id: 'digital-logic',
              title: 'Digital Electronics',
              topics: [
                  { id: 'logic-gates', title: 'Logic Gates & Boolean', content: 'AND, OR, NOT, XOR, NAND, NOR, K-Maps, De Morgan\'s Laws.' },
                  { id: 'combinational', title: 'Combinational Circuits', content: 'Adders, Subtractors, Multiplexers, Decoders, Encoders.' },
                  { id: 'sequential', title: 'Sequential Circuits', content: 'Flip-Flops (SR, JK, D, T), Counters, Registers.' }
              ]
          },
          {
              id: 'soft-eng',
              title: 'Software Engineering',
              topics: [
                  { id: 'sdlc', title: 'SDLC Models', content: 'Waterfall, Agile, Scrum, Spiral, V-Model.' },
                  { id: 'testing', title: 'Testing & QA', content: 'Unit, Integration, System, Black-box vs White-box testing.' },
                  { id: 'uml', title: 'UML & Design', content: 'Class Diagrams, Use Case Diagrams, Sequence Diagrams.' }
              ]
          }
      ]
  }
];

export const SYSTEM_INSTRUCTION = `You are an AI Tutor for a Computer Science learning application.
This content is user-specific.
Do not modify global content.
Follow heading strictly.
Generate fresh explanation only.`;

export const GENERATION_TEMPLATE = `
# ROLE
You are an AI Tutor for a Computer Science learning application.

# CONTEXT
Category: {{category}}
Chapter: {{chapter}}
Topic Heading: {{topic_heading}}

Base Content (Context Only):
{{original_content}}

User Prompt:
{{user_prompt}}

# RULES (STRICT)
- Do NOT change the topic heading.
- Do NOT reference or modify base content.
- Generate fresh explanation only.
- Content is user-specific.
- Follow the user prompt for language (English or Hinglish).
- Default to English if not specified.
- Add real-life examples if possible.
- Keep code minimal and clean.
- Avoid unnecessary theory.
- Output MUST be valid Markdown.

# OUTPUT FORMAT
## {{topic_heading}}

### Explanation
(Simple, structured explanation)

### Real-Life Example
(Relatable analogy)

### Code Example (if applicable)
(Short, clean code)

### Key Points
- Point 1
- Point 2
- Point 3

### Quick Summary
(2–3 lines)
`;
