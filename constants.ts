/** @format */

import { Category } from "./types";

export const CONTENT_DATA: Category[] = [
  // --- GROUP: PROGRAMMING LANGUAGES ---
  {
    id: "c-programming",
    title: "C Programming",
    group: "Programming Languages",
    chapters: [
      {
        id: "c-foundations",
        title: "C Foundations",
        topics: [
          {
            id: "c-basics",
            title: "Basics & Compilation",
            content:
              "Structure of C, Compilation stages (Pre-processing, Compilation, Assembly, Linking), Data Types.",
          },
          {
            id: "c-control",
            title: "Control Flow",
            content:
              "Loops (for, while, do-while), Switch-case, Conditional Statements (if-else).",
          },
          {
            id: "c-funcs",
            title: "Functions & Recursion",
            content:
              "Function definition, Call stack, Recursion vs Iteration, Scope rules.",
          },
        ],
      },
      {
        id: "c-memory",
        title: "Pointers & Memory",
        topics: [
          {
            id: "c-pointers",
            title: "Pointers Masterclass",
            content:
              "Pointer arithmetic, Double pointers, Void pointers, Function pointers.",
          },
          {
            id: "c-mem-mgmt",
            title: "Dynamic Memory",
            content:
              "malloc, calloc, realloc, free, Memory Leaks, Heap vs Stack.",
          },
          {
            id: "c-arrays",
            title: "Arrays & Strings",
            content:
              "1D/2D Arrays, String manipulation (<string.h>), Array decay to pointers.",
          },
        ],
      },
      {
        id: "c-advanced-structs",
        title: "Advanced C",
        topics: [
          {
            id: "c-structs",
            title: "Structures & Unions",
            content:
              "struct memory layout, Padding, Bit-fields, Unions, typedef.",
          },
          {
            id: "c-io",
            title: "File I/O & Preprocessor",
            content:
              "File modes, binary vs text files, Macros (#define), Conditional compilation.",
          },
        ],
      },
    ],
  },
  {
    id: "cpp-programming",
    title: "C++ Programming",
    group: "Programming Languages",
    chapters: [
      {
        id: "cpp-green-basic",
        title: " C++ Basic Topics",
        topics: [
          {
            id: "cpp-hello",
            title: "Hello World",
            content: "Basic syntax, main function structure, headers.",
          },
          {
            id: "cpp-compilation",
            title: "Compilation Process",
            content: "Preprocessing, Compilation, Assembly, Linking.",
          },
          {
            id: "cpp-comments",
            title: "Comments",
            content: "Single line vs Multi-line comments, Documentation.",
          },
          {
            id: "cpp-funcs-basic",
            title: "Functions",
            content: "Declaration, Definition, Parameters, Return types.",
          },
          {
            id: "cpp-preprocessor",
            title: "Preprocessor",
            content: "#include, #define, Macros.",
          },
          {
            id: "cpp-datatypes",
            title: "Data Types",
            content: "int, float, double, char, bool, void, modifiers.",
          },
          {
            id: "cpp-literals",
            title: "Literals",
            content: "Integer, Float, Character, String literals.",
          },
          {
            id: "cpp-operators",
            title: "Operators",
            content: "Arithmetic, Relational, Logical, Bitwise.",
          },
          {
            id: "cpp-precedence",
            title: "Operator Precedence",
            content: "Order of evaluation, associativity.",
          },
          {
            id: "cpp-conditionals",
            title: "Conditional Statements",
            content: "if, else if, else, switch-case.",
          },
          {
            id: "cpp-loops",
            title: "Loops",
            content: "for, while, do-while loops.",
          },
          {
            id: "cpp-arrays",
            title: "Arrays",
            content: "Fixed size arrays, multidimensional arrays.",
          },
          {
            id: "cpp-strings",
            title: "Strings",
            content: "C-style strings vs std::string.",
          },
        ],
      },
      {
        id: "cpp-yellow-core",
        title: " Core C++ Topics",
        topics: [
          {
            id: "cpp-pointers",
            title: "Pointers",
            content: "Memory addresses, pointer arithmetic, null pointers.",
          },
          {
            id: "cpp-refs",
            title: "References",
            content: "Reference variables, references vs pointers.",
          },
          {
            id: "cpp-call-val-ref",
            title: "Call by Value & Reference",
            content: "Passing arguments effectively.",
          },
          {
            id: "cpp-overloading",
            title: "Function Overloading",
            content: "Same name, different parameters.",
          },
          {
            id: "cpp-inline",
            title: "Inline Functions",
            content: "Optimization hints to compiler.",
          },
          {
            id: "cpp-this",
            title: "this Pointer",
            content: "Pointer to the current object instance.",
          },
          {
            id: "cpp-memory",
            title: "Memory (Stack & Heap)",
            content: "Stack allocation vs Heap allocation.",
          },
        ],
      },
      {
        id: "cpp-blue-oop",
        title: " OOP in C++",
        topics: [
          {
            id: "cpp-class-struct",
            title: "Class & Struct",
            content: "Differences, default access specifiers.",
          },
          {
            id: "cpp-access",
            title: "Access Specifiers",
            content: "public, private, protected.",
          },
          {
            id: "cpp-constructors",
            title: "Constructors",
            content: "Default, Parameterized, Copy constructors.",
          },
          {
            id: "cpp-destructors",
            title: "Destructors",
            content: "Cleanup resources, ~ClassName.",
          },
          {
            id: "cpp-inheritance",
            title: "Inheritance",
            content: "Base and Derived classes, types of inheritance.",
          },
          {
            id: "cpp-polymorphism",
            title: "Polymorphism",
            content: "Compile-time vs Run-time polymorphism.",
          },
          {
            id: "cpp-virtual",
            title: "Virtual Functions",
            content: "vtable, vptr, dynamic dispatch.",
          },
          {
            id: "cpp-override",
            title: "override & final",
            content: "C++11 keywords for safety.",
          },
          {
            id: "cpp-op-overload",
            title: "Operator Overloading",
            content: "Customizing operator behavior for classes.",
          },
          {
            id: "cpp-const",
            title: "Const Correctness",
            content: "const member functions, const arguments.",
          },
        ],
      },
      {
        id: "cpp-orange-stl",
        title: " STL & Modern C++",
        topics: [
          {
            id: "cpp-vector",
            title: "std::vector",
            content: "Dynamic arrays, push_back, resizing.",
          },
          {
            id: "cpp-array",
            title: "std::array",
            content: "Fixed size array wrapper.",
          },
          {
            id: "cpp-map",
            title: "std::map",
            content: "Ordered key-value pairs (Red-Black Tree).",
          },
          {
            id: "cpp-unordered-map",
            title: "std::unordered_map",
            content: "Hash map implementation.",
          },
          {
            id: "cpp-set",
            title: "std::set",
            content: "Unique sorted elements.",
          },
          {
            id: "cpp-iterators",
            title: "Iterators",
            content: "begin(), end(), traversal.",
          },
          {
            id: "cpp-algos",
            title: "Algorithms",
            content: "sort, find, count, binary_search.",
          },
          {
            id: "cpp-lambda",
            title: "Lambda Expressions",
            content: "Anonymous functions, capture lists.",
          },
          { id: "cpp-auto", title: "auto", content: "Type inference." },
          {
            id: "cpp-decltype",
            title: "decltype",
            content: "Inspecting types.",
          },
          {
            id: "cpp-deduction",
            title: "Type Deduction",
            content: "Template and auto type deduction rules.",
          },
        ],
      },
      {
        id: "cpp-red-advanced",
        title: " Advanced C++",
        topics: [
          {
            id: "cpp-templates",
            title: "Templates",
            content: "Generic programming, function and class templates.",
          },
          {
            id: "cpp-temp-spec",
            title: "Template Specialization",
            content: "Full and partial specialization.",
          },
          {
            id: "cpp-constexpr",
            title: "constexpr",
            content: "Compile-time evaluation.",
          },
          {
            id: "cpp-static-assert",
            title: "static_assert",
            content: "Compile-time assertions.",
          },
          {
            id: "cpp-move",
            title: "Move Semantics",
            content: "std::move, r-value references.",
          },
          {
            id: "cpp-rule-of",
            title: "Rule of 3 / 5 / 0",
            content: "Resource management rules.",
          },
          {
            id: "cpp-smart-ptrs",
            title: "Smart Pointers",
            content: "unique_ptr, shared_ptr, weak_ptr.",
          },
          {
            id: "cpp-exceptions",
            title: "Exception Handling",
            content: "try, catch, throw, RAII.",
          },
        ],
      },
      {
        id: "cpp-black-threads",
        title: " Multithreading",
        topics: [
          {
            id: "cpp-thread",
            title: "std::thread",
            content: "Creating and managing threads.",
          },
          {
            id: "cpp-mutex",
            title: "std::mutex",
            content: "Mutual exclusion.",
          },
          {
            id: "cpp-lock-guard",
            title: "lock_guard",
            content: "RAII wrapper for mutex.",
          },
          {
            id: "cpp-cond-var",
            title: "condition_variable",
            content: "Thread synchronization.",
          },
          {
            id: "cpp-atomic",
            title: "std::atomic",
            content: "Atomic operations.",
          },
        ],
      },
      {
        id: "cpp-purple-expert",
        title: "Expert / Optional",
        topics: [
          {
            id: "cpp-metaprog",
            title: "Metaprogramming",
            content: "Code that generates code.",
          },
          {
            id: "cpp-crtp",
            title: "CRTP",
            content: "Curiously Recurring Template Pattern.",
          },
          {
            id: "cpp-type-erasure",
            title: "Type Erasure",
            content: "std::any, std::variant.",
          },
          {
            id: "cpp-patterns",
            title: "Design Patterns",
            content: "Singleton, Factory, Observer in C++.",
          },
          {
            id: "cpp-build",
            title: "Build Systems (CMake)",
            content: "CMakeLists.txt basics.",
          },
          {
            id: "cpp-optimization",
            title: "Optimization",
            content: "Memory layout, cache locality.",
          },
          {
            id: "cpp-profiling",
            title: "Profiling",
            content: "Analyzing performance.",
          },
        ],
      },
    ],
  },
  {
    id: "java-programming",
    title: "Java Programming",
    group: "Programming Languages",
    chapters: [
      {
        id: "java-core",
        title: "Java Core",
        topics: [
          {
            id: "java-jvm",
            title: "JVM Architecture",
            content: "ClassLoader, JIT, Memory Areas.",
          },
          {
            id: "java-oop-concepts",
            title: "OOP Deep Dive",
            content: "Interface vs Abstract Class, Polymorphism.",
          },
          {
            id: "java-exceptions",
            title: "Exception Hierarchy",
            content: "Checked vs Unchecked Exceptions.",
          },
        ],
      },
      {
        id: "java-advanced",
        title: "Java Advanced",
        topics: [
          {
            id: "java-collections",
            title: "Collections Framework",
            content: "Internal working of HashMap, HashSet, ArrayList.",
          },
          {
            id: "java-streams",
            title: "Streams API",
            content: "Filter, Map, Reduce, Collectors.",
          },
          {
            id: "java-threads",
            title: "Multithreading",
            content: "ExecutorService, CompletableFuture, Synchronization.",
          },
        ],
      },
    ],
  },
  {
    id: "python-mastery",
    title: "Python Programming",
    group: "Programming Languages",
    chapters: [
      {
        id: "py-basics",
        title: "Python Essentials",
        topics: [
          {
            id: "py-syntax",
            title: "Syntax & Types",
            content:
              "Variables, Indentation, Dynamic Typing, Strings, Numbers.",
          },
          {
            id: "py-control",
            title: "Control Flow",
            content:
              "if-elif-else, for loops, while loops, break/continue, range().",
          },
          {
            id: "py-ds",
            title: "Data Structures",
            content: "Lists, Tuples, Dictionaries, Sets, List Comprehensions.",
          },
        ],
      },
      {
        id: "py-advanced",
        title: "Advanced Python",
        topics: [
          {
            id: "py-oop",
            title: "OOP in Python",
            content:
              "Classes, self, __init__, Inheritance, Magic Methods (dunder).",
          },
          {
            id: "py-func",
            title: "Functional Python",
            content:
              "Lambda, map, filter, reduce, Decorators, Generators, Iterators.",
          },
          {
            id: "py-libs",
            title: "Libraries Overview",
            content: "Intro to NumPy, Pandas, Requests, Flask/Django basics.",
          },
        ],
      },
    ],
  },

  // --- GROUP: WEB DEVELOPMENT ---
  {
    id: "frontend-foundations",
    title: "Frontend Foundations",
    group: "Web Development",
    chapters: [
      {
        id: "frontend-basics",
        title: "HTML, CSS & JS",
        topics: [
          {
            id: "html-css",
            title: "HTML5 & CSS3 Structure",
            content:
              "Semantic HTML, Box Model, Flexbox, Grid Layout, Responsive Design.",
          },
          {
            id: "js-essentials",
            title: "JavaScript Essentials",
            content:
              "ES6+ Syntax, DOM Manipulation, Event Handling, Async/Await, Promises.",
          },
          {
            id: "ts-basics",
            title: "TypeScript Fundamentals",
            content:
              "Static Typing, Interfaces, Generics, Enums, Type Inference.",
          },
        ],
      },
    ],
  },
  {
    id: "react-ecosystem",
    title: "Modern React.js",
    group: "Web Development",
    chapters: [
      {
        id: "modern-react",
        title: "React Core",
        topics: [
          {
            id: "react-components",
            title: "React Components & JSX",
            content:
              "Functional Components, JSX Rules, Props, State, Component Lifecycle.",
          },
          {
            id: "react-hooks",
            title: "React Hooks Deep Dive",
            content:
              "useState, useEffect, useContext, useReducer, useMemo, useCallback, Custom Hooks.",
          },
          {
            id: "react-router",
            title: "Routing & Navigation",
            content:
              "React Router v6, Dynamic Routes, Nested Routes, Protected Routes.",
          },
          {
            id: "state-mgmt",
            title: "Global State (Redux/Zustand)",
            content:
              "Redux Toolkit, Slices, Async Thunks, Context API, Zustand basics.",
          },
        ],
      },
    ],
  },
  {
    id: "nodejs-complete",
    title: "Node.js Complete",
    group: "Web Development",
    chapters: [
      {
        id: "node-green-basic",
        title: "Node.js Basics",
        topics: [
          {
            id: "node-intro",
            title: "Getting Started with Node.js",
            content: "What is Node.js, use cases, architecture overview.",
          },
          {
            id: "node-install",
            title: "Installing & Uninstalling Node.js",
            content: "Install, uninstall, verify Node.js.",
          },
          {
            id: "node-history",
            title: "Node.js History",
            content: "Evolution and versions.",
          },
          {
            id: "node-usecases",
            title: "Use Cases of Node.js",
            content: "Where Node.js fits best.",
          },
          {
            id: "node-repl",
            title: "Interacting with Console",
            content: "REPL, STDIN, STDOUT.",
          },
          {
            id: "node-cli",
            title: "CLI & Command Line Arguments",
            content: "Parsing CLI arguments.",
          },
        ],
      },
      // ... (Other Node.js chapters omitted for brevity but remain part of structure)
    ],
  },

  // --- GROUP: DATABASES ---
  {
    id: "mysql-database",
    title: "MySQL Database",
    group: "Databases",
    chapters: [
      {
        id: "mysql-green-basic",
        title: "🟢 MySQL Basic Topics",
        topics: [
          {
            id: "mysql-intro",
            title: "Getting Started with MySQL",
            content: "What is MySQL, installation, basic concepts.",
          },
          {
            id: "mysql-client",
            title: "MySQL Client",
            content: "mysql CLI, connecting to server.",
          },
          // ... more topics
        ],
      },
      // ... more chapters
    ],
  },
  // ... (Other categories remain the same)
  // --- GROUP: COMPUTER SCIENCE CORE ---
  {
    id: "cs-core-subjects",
    title: "CS Core Subjects",
    group: "Computer Science Core",
    chapters: [
      {
        id: "os-module",
        title: "Operating Systems",
        topics: [
          {
            id: "os-intro",
            title: "OS Basics & Kernel",
            content:
              "Types of OS, System Calls, Kernel vs Shell, User vs Kernel Mode.",
          },
          {
            id: "process-sched",
            title: "Process Scheduling",
            content:
              "FCFS, SJF, Round Robin, Priority Scheduling, Context Switching.",
          },
          {
            id: "sync-deadlock",
            title: "Synchronization & Deadlocks",
            content:
              "Semaphores, Mutex, Monitors, Deadlock conditions, Banker's Algorithm.",
          },
          {
            id: "mem-mgmt",
            title: "Memory Management",
            content:
              "Paging, Segmentation, Virtual Memory, Page Replacement Algorithms (LRU, FIFO).",
          },
          {
            id: "storage",
            title: "Storage Management",
            content:
              "Disk Scheduling (FCFS, SSTF, SCAN), RAID levels, File Systems.",
          },
        ],
      },
      {
        id: "dbms-module",
        title: "Database Management (DBMS)",
        topics: [
          {
            id: "sql-core",
            title: "SQL Queries",
            content:
              "DDL, DML, DCL, Joins (Inner, Outer, Left, Right), Subqueries, Views.",
          },
          {
            id: "er-model",
            title: "ER Modeling & Relational Model",
            content:
              "Entities, Attributes, Relationships, Keys (Primary, Foreign, Candidate).",
          },
          {
            id: "normalization",
            title: "Normalization",
            content: "1NF, 2NF, 3NF, BCNF, De-normalization trade-offs.",
          },
          {
            id: "trans-concur",
            title: "Transactions & Concurrency",
            content:
              "ACID Properties, Isolation Levels, Locking Protocols, MVCC.",
          },
          {
            id: "indexing",
            title: "Indexing & Optimization",
            content:
              "B-Trees, B+ Trees, Hashing, Query Optimization techniques.",
          },
        ],
      },
      {
        id: "networks-module",
        title: "Computer Networks",
        topics: [
          {
            id: "net-models",
            title: "OSI & TCP/IP Models",
            content: "Layered architecture, Encapsulation/Decapsulation, PDUs.",
          },
          {
            id: "app-layer",
            title: "Application Layer",
            content: "HTTP/HTTPS, DNS, FTP, SMTP, SSH, DHCP.",
          },
          {
            id: "transport-layer",
            title: "Transport Layer",
            content:
              "TCP vs UDP, Three-way Handshake, Flow Control, Congestion Control.",
          },
          {
            id: "network-layer",
            title: "Network Layer",
            content:
              "IP Addressing (IPv4/IPv6), Subnetting, Routing Algorithms (OSPF, BGP).",
          },
          {
            id: "link-physical",
            title: "Data Link & Physical",
            content: "MAC Addresses, Ethernet, CSMA/CD, Switching, Cabling.",
          },
        ],
      },
    ],
  },
  {
    id: "cs-dsa",
    title: "Data Structures & Algorithms",
    group: "Computer Science Core",
    chapters: [
      {
        id: "dsa-linear",
        title: "Linear Data Structures",
        topics: [
          {
            id: "arrays-strings",
            title: "Arrays & Strings",
            content:
              "Dynamic Arrays, Two Pointers, Sliding Window, String Matching.",
          },
          {
            id: "linked-lists",
            title: "Linked Lists",
            content: "Singly, Doubly, Circular Lists, Fast & Slow Pointers.",
          },
          {
            id: "stacks-queues",
            title: "Stacks & Queues",
            content: "Implementation, Monotonic Stack, Priority Queue, Deque.",
          },
        ],
      },
      {
        id: "dsa-trees-graphs",
        title: "Trees & Graphs",
        topics: [
          {
            id: "trees",
            title: "Trees & BST",
            content:
              "Traversals (In/Pre/Post), Binary Search Trees, AVL, Tries.",
          },
          {
            id: "heaps",
            title: "Heaps",
            content: "Min-Heap, Max-Heap, Heap Sort, Top-K Elements pattern.",
          },
          {
            id: "graphs",
            title: "Graph Algorithms",
            content:
              "Adjacency Matrix/List, BFS, DFS, Dijkstra, Bellman-Ford, Prim/Kruskal.",
          },
        ],
      },
      {
        id: "dsa-algos",
        title: "Core Algorithms",
        topics: [
          {
            id: "sorting-searching",
            title: "Sorting & Searching",
            content: "Merge Sort, Quick Sort, Binary Search, Radix Sort.",
          },
          {
            id: "dp",
            title: "Dynamic Programming",
            content: "Memoization vs Tabulation, Knapsack, LCS, LIS.",
          },
          {
            id: "backtracking",
            title: "Backtracking & Greedy",
            content:
              "N-Queens, Permutations, Huffman Coding, Activity Selection.",
          },
        ],
      },
    ],
  },
  {
    id: "system-design",
    title: "System Design & Architecture",
    group: "Computer Science Core",
    chapters: [
      {
        id: "sys-basics",
        title: "Design Fundamentals",
        topics: [
          {
            id: "scaling",
            title: "Scalability",
            content:
              "Vertical vs Horizontal Scaling, Caching Strategies, Load Balancing.",
          },
          {
            id: "db-design",
            title: "Database Design",
            content:
              "Replication, Sharding, CAP Theorem, SQL vs NoSQL selection.",
          },
          {
            id: "comm-protocols",
            title: "Communication Protocols",
            content: "REST, GraphQL, gRPC, WebSockets, Long Polling.",
          },
        ],
      },
      {
        id: "sys-advanced",
        title: "Advanced Systems",
        topics: [
          {
            id: "dist-systems",
            title: "Distributed Systems",
            content:
              "Consistent Hashing, MapReduce, Distributed Consensus (Paxos/Raft).",
          },
          {
            id: "high-level",
            title: "High Level Design",
            content:
              "Designing URL Shortener, Chat App, Uber, Netflix architecture.",
          },
        ],
      },
    ],
  },
  {
    id: "cs-math",
    title: "Mathematics for CS",
    group: "Computer Science Core",
    chapters: [
      {
        id: "discrete-math",
        title: "Discrete Mathematics",
        topics: [
          {
            id: "sets-logic",
            title: "Sets & Logic",
            content:
              "Set Theory, Propositional Logic, Predicate Logic, Truth Tables.",
          },
          {
            id: "graph-theory",
            title: "Graph Theory",
            content:
              "Types of Graphs, Euler/Hamiltonian paths, Coloring, Isomorphism.",
          },
          {
            id: "combinatorics",
            title: "Combinatorics",
            content:
              "Permutations, Combinations, Pigeonhole Principle, Recurrence Relations.",
          },
        ],
      },
    ],
  },

  // --- GROUP: MODERN TECH & ENGINEERING ---
  {
    id: "cloud-computing",
    title: "Cloud Computing",
    group: "Modern Tech & Engineering",
    chapters: [
      {
        id: "cloud-basics",
        title: "Cloud Concepts",
        topics: [
          {
            id: "service-models",
            title: "IaaS, PaaS, SaaS",
            content: "Service models definitions, examples, and trade-offs.",
          },
          {
            id: "deploy-models",
            title: "Deployment Models",
            content: "Public, Private, Hybrid, Community Cloud.",
          },
        ],
      },
      {
        id: "aws-services",
        title: "AWS Essentials",
        topics: [
          {
            id: "compute-storage",
            title: "Compute & Storage",
            content: "EC2, Lambda, S3, EBS, Glacier.",
          },
          {
            id: "networking-db",
            title: "Networking & DB",
            content: "VPC, Route53, RDS, DynamoDB.",
          },
        ],
      },
    ],
  },
  {
    id: "ai-ml",
    title: "Artificial Intelligence & ML",
    group: "Modern Tech & Engineering",
    chapters: [
      {
        id: "ml-foundations",
        title: "ML Foundations",
        topics: [
          {
            id: "sup-unsup",
            title: "Supervised vs Unsupervised",
            content:
              "Regression, Classification, Clustering, Dimensionality Reduction.",
          },
          {
            id: "nn-dl",
            title: "Neural Networks",
            content:
              "Perceptron, Activation Functions, Backpropagation, CNN, RNN.",
          },
        ],
      },
      {
        id: "gen-ai",
        title: "Generative AI & LLMs",
        topics: [
          {
            id: "transformers",
            title: "Transformers & Attention",
            content:
              "Encoder-Decoder, Self-Attention, Multi-Head Attention, GPT architecture.",
          },
          {
            id: "prompt-eng",
            title: "Prompt Engineering",
            content: "Zero-shot, Few-shot, Chain of Thought, RAG basics.",
          },
        ],
      },
    ],
  },
  {
    id: "eng-hardware",
    title: "Engineering & Hardware",
    group: "Modern Tech & Engineering",
    chapters: [
      {
        id: "digital-logic",
        title: "Digital Electronics",
        topics: [
          {
            id: "logic-gates",
            title: "Logic Gates & Boolean",
            content: "AND, OR, NOT, XOR, NAND, NOR, K-Maps, De Morgan's Laws.",
          },
          {
            id: "combinational",
            title: "Combinational Circuits",
            content: "Adders, Subtractors, Multiplexers, Decoders, Encoders.",
          },
          {
            id: "sequential",
            title: "Sequential Circuits",
            content: "Flip-Flops (SR, JK, D, T), Counters, Registers.",
          },
        ],
      },
      {
        id: "soft-eng",
        title: "Software Engineering",
        topics: [
          {
            id: "sdlc",
            title: "SDLC Models",
            content: "Waterfall, Agile, Scrum, Spiral, V-Model.",
          },
          {
            id: "testing",
            title: "Testing & QA",
            content:
              "Unit, Integration, System, Black-box vs White-box testing.",
          },
          {
            id: "uml",
            title: "UML & Design",
            content: "Class Diagrams, Use Case Diagrams, Sequence Diagrams.",
          },
        ],
      },
    ],
  },
];

export const SYSTEM_INSTRUCTION = `You are a Senior Computer Science Teacher and Mentor.
Your goal is to teach concepts from zero to advanced level in very simple English.
Focus on deep conceptual understanding, internal working (memory/stack), and real-life examples.`;

export const GENERATION_TEMPLATE = `
You are my Senior Computer Science Teacher and Mentor.

GOAL:
Teach me the topic "**{{topic_heading}}**" (Context: {{category}} > {{chapter}}) from zero to advanced level in **very simple English** so that even a beginner can understand.

User Specific Instructions: {{user_prompt}}

TEACHING STYLE:
- Explain step by step
- Do not skip any concept
- Use simple language
- Use real-life examples wherever possible
- Use tables when comparison is needed
- Give small code examples (Language: C++ or Python unless specified otherwise)
- Show dry run of code logic (Memory/Stack visualization)
- Focus on building deep conceptual understanding

OUTPUT STRUCTURE:

1. **Introduction**
   - Definition in simple terms
   - Why do we need this? (Real life problem)
   - Real life analogy

2. **Core Concepts & Internals**
   - How it works internally?
   - What happens in Memory/Stack? (Crucial for deep understanding)
   - Visualizing the flow

3. **Practical Implementation**
   - Clean Code Examples
   - Step-by-step Dry Run of the code (Tracing values)

4. **Advanced Concepts & Analysis**
   - Pros vs Cons (Table)
   - Time & Space Complexity
   - Common Mistakes to avoid

5. **Conclusion & Assessment**
   - Summary
   - 3 Interview Questions (with brief answers)
   - 1 Mini Coding Challenge for practice

Original Content for Reference:
{{original_content}}
`;
