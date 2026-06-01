import { CourseData } from '../services/contentService';

export const preloadedCourses: Record<string, CourseData> = {
  HumanBody: {
    title: "Human Body",
    subtitle: "Ultra-Realistic Anatomical Ecosystem",
    intro: "A precision-engineered medical simulation exploring the human body's core biological matrices. Utilizing high-fidelity characteristic scans and custom medical transparency shaders, this module allows for non-invasive exploration of skeletal, cardiovascular, and neural architectures.",
    category: "Anatomy",
    difficulty: "Advanced",
    duration: "35 min",
    iconName: "Heart",
    color: "red",
    sections: [
      {
        title: "Central Nervous System",
        content: "The command center of the body. Explores the cerebrum, cerebellum, and the spinal cord's intricate neural pathways that transmit electrical impulses at high speeds.",
        icon: "BrainCircuit",
        color: "text-blue-400"
      },
      {
        title: "Cardiovascular Network",
        content: "A continuous fluid dynamics ecosystem. Examines the highly efficient muscular pumping mechanism of the heart and the branching fractal architecture of arteries and veins.",
        icon: "Activity",
        color: "text-red-400"
      }
    ],
    modules: [
      {
        title: "Nervous System Dynamics",
        desc: "Analyze the structure of neurons and how action potentials transmit signals along the spinal cord.",
        completed: false,
        objectives: ["Map the Central Nervous System", "Understand signal transmission rates"],
        interactiveLabel: "View Neurons",
        interactiveType: "3d-viewer",
        quiz: {
          question: "Which cell type is key to electrical signal propagation in the central nervous system?",
          options: ["Neuron", "Osteoclast", "Erythrocyte", "Myocyte"],
          correctAnswer: 0
        }
      },
      {
        title: "Cardiovascular Fluidity",
        desc: "Investigate blood flow, pressure gradients, and the systolic/diastolic phases of the human heart.",
        completed: false,
        objectives: ["Analyze cardiac output", "Trace blood pathways"],
        interactiveLabel: "View Heart",
        interactiveType: "3d-viewer",
        quiz: {
          question: "What refers to the volume of blood pumped by the heart per minute?",
          options: ["Heart Rate", "Stroke Volume", "Cardiac Output", "Arterial Pressure"],
          correctAnswer: 2
        }
      }
    ],
    math: {
      title: "Cardiac Output",
      intro: "Cardiac output (CO) is the volume of blood pumped by the heart per minute.",
      formula: "CO = HR \\times SV",
      variables: [
        { symbol: "CO", definition: "Cardiac Output (mL/min)" },
        { symbol: "HR", definition: "Heart Rate (beats/min)" },
        { symbol: "SV", definition: "Stroke Volume (mL/beat)" }
      ]
    },
    conclusion: {
      title: "Biological Masterpiece",
      content: "The human body is an intricate machine, where trillions of cells collaborate flawlessly to sustain life and intelligence.",
      highlight: "100%",
      highlightNote: "Biological Synergy"
    }
  },
  Photolithography: {
    title: "Photolithography Machine",
    subtitle: "Nanoscale Semiconductor Manufacturing",
    intro: "A rigorous technical analysis of Extreme Ultraviolet (EUV) lithography systems. This module provides an exhaustive overview of the physics and engineering required to print patterns at the 2-7nm node. Students will master the stochastic nature of EUV photon interaction, the design of Mo/Si multilayer reflectors, and the precise control of wafer stages accelerating at 10-15G.",
    category: "Semiconductor Engineering",
    difficulty: "Advanced",
    duration: "65 min",
    iconName: "Cpu",
    color: "indigo",
    sections: [
      {
        title: "EUV Light Generation (LPP)",
        content: "Photons at 13.5nm are produced via Laser Produced Plasma (LPP). A high-power CO2 laser intersects with 30μm tin droplets at 50kHz, exciting them to a plasma state where they emit EUV radiation during recombination.",
        icon: "Zap",
        color: "text-purple-400"
      },
      {
        title: "Catoptric Optical Column",
        content: "Due to the high absorption of EUV in all refractive media, the system uses a fully reflective optical column. These mirrors achieve sub-angstrom flatness, utilizing Bragg interference via ~40 pairs of Molybdenum/Silicon layers.",
        icon: "Layers",
        color: "text-blue-400"
      },
      {
        title: "Scanning Dynamics & Overlay",
        content: "Throughput and yield are governed by stage accuracy. The reticle and wafer stages must synchronize with sub-nanometer precision during scanning, managing extreme thermal loads and vibratory disturbances.",
        icon: "Activity",
        color: "text-cyan-400"
      }
    ],
    math: {
      title: "Rayleigh Criterion",
      intro: "The minimum resolvable feature size (Critical Dimension) in photolithography is given by:",
      formula: "CD = k_1 \\cdot \\frac{\\lambda}{NA}",
      variables: [
        { symbol: "CD", definition: "Critical Dimension (minimum feature size)" },
        { symbol: "k_1", definition: "Process-related factor" },
        { symbol: "\\lambda", definition: "Wavelength of light used (e.g., 13.5 nm for EUV)" },
        { symbol: "NA", definition: "Numerical Aperture of the lens system" }
      ]
    },
    conclusion: {
      title: "The Pinnacle of Engineering",
      content: "Photolithography machines are arguably the most complex devices ever built, enabling the continued scaling of transistors and the advancement of global computing power.",
      highlight: "100% Precision",
      highlightNote: "Nanoscale Manufacturing"
    },
    modules: [
      {
        title: "EUV Plasma Physics",
        desc: "Analyze the stochastic dynamics of laser-produced tin plasma (LPP) and the emission spectra of 13.5nm EUV photons.",
        completed: false,
        objectives: ["Understand tin plasma emission", "Calculate conversion efficiency (CE)"],
        interactiveLabel: "Generate EUV Beam",
        interactiveType: "simulation",
        simulationId: "plasma",
        quiz: {
          question: "What is the primary wavelength of EUV light used in HVM lithography?",
          options: ["193 nm", "13.5 nm", "248 nm", "405 nm"],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the EUV Plasma Physics module?",
                  "options": [
                    "Practical analysis and simulation of EUV Plasma Physics",
                    "Historical context of EUV Plasma Physics",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Analyze the stochastic dynamics of laser-produced ...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Generate EUV Beam' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Generate EUV Beam' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring EUV Plasma Physics, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the EUV Plasma Physics module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: "Optical Column Engineering",
        desc: "Study the fabrication of Mo/Si multilayer Bragg reflectors with sub-angstrom surface roughness.",
        completed: false,
        objectives: ["Understand constructive interference in coatings", "Analyze reflective efficiency at grazing angles"],
        interactiveLabel: "3D Optical Align",
        interactiveType: "3d-viewer",
        quiz: {
          question: "Why are multilayer mirrors used instead of traditional refractive lenses for EUV?",
          options: ["EUV is heavily absorbed by all refractive materials", "Mirrors are cheaper to mass produce", "Lenses cause chromatic aberration in vacuums", "Mirrors provide higher magnification"],
          correctAnswer: 0
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Optical Column Engineering module?",
                  "options": [
                    "Practical analysis and simulation of Optical Column Engineering",
                    "Historical context of Optical Column Engineering",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Study the fabrication of Mo/Si multilayer Bragg re...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the '3D Optical Align' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like '3D Optical Align' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Optical Column Engineering, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Optical Column Engineering module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: "Cleanroom Laboratory",
        desc: "Experience the rigorous protocol and chemical processes within a Class 1 semiconductor cleanroom.",
        completed: false,
        objectives: ["Explore photoresist chemical amplification", "Manage pattern development parameters"],
        interactiveLabel: "Enter Virtual Lab",
        interactiveType: "simulation",
        simulationId: "virtual-lab",
        quiz: {
          question: "What is the purpose of chemically amplified resists (CARs)?",
          options: ["To slow down the printing process", "To increase sensitivity to low EUV dose", "To make the wafer heavier", "To change the color of the chip"],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Cleanroom Laboratory module?",
                  "options": [
                    "Practical analysis and simulation of Cleanroom Laboratory",
                    "Historical context of Cleanroom Laboratory",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Experience the rigorous protocol and chemical proc...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Enter Virtual Lab' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Enter Virtual Lab' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Cleanroom Laboratory, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Cleanroom Laboratory module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: "Nano-Overlay Precision",
        desc: "Investigate the magnetic levitation and control systems that achieve sub-nanometer overlay accuracy.",
        completed: false,
        objectives: ["Understand 6-DOF stage control", "Analyze thermal expansion compensators"],
        interactiveLabel: "Measure Overlay",
        interactiveType: "calculator",
        quiz: {
          question: "How many degrees of freedom (DOF) do modern wafer stages typically control?",
          options: ["2", "3", "6", "12"],
          correctAnswer: 2
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Nano-Overlay Precision module?",
                  "options": [
                    "Practical analysis and simulation of Nano-Overlay Precision",
                    "Historical context of Nano-Overlay Precision",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Investigate the magnetic levitation and control sy...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Measure Overlay' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Measure Overlay' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Nano-Overlay Precision, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Nano-Overlay Precision module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },
  Satellite: {
    title: "Advanced Satellite System",
    subtitle: "Orbital Mechanics & Neural Intelligence",
    intro: "An ultra-realistic exploration of a modern satellite system, integrating advanced orbital mechanics, high-resolution Earth observation payloads, and on-board neural intelligence for autonomous operations.",
    category: "Engineering",
    difficulty: "Advanced",
    duration: "35 min",
    iconName: "Satellite",
    color: "blue",
    sections: [
      {
        title: "Orbital Mechanics",
        content: "Satellites operate in specific orbits (LEO, MEO, GEO) determined by their mission. Orbital mechanics govern their trajectory, speed, and positioning relative to Earth.",
        icon: "Orbit",
        color: "blue"
      },
      {
        title: "Payload & Sensors",
        content: "The primary instruments of a satellite. This includes high-resolution optical cameras, synthetic aperture radar (SAR), and multispectral sensors for Earth observation.",
        icon: "Camera",
        color: "green"
      },
      {
        title: "Neural Intelligence Core",
        content: "Advanced on-board AI processing units enable real-time data analysis, autonomous navigation, anomaly detection, and intelligent bandwidth allocation without ground intervention.",
        icon: "Brain",
        color: "purple"
      },
      {
        title: "Power & Propulsion",
        content: "Solar arrays provide power, while ion thrusters or chemical propulsion systems maintain orbit and perform evasive maneuvers.",
        icon: "Zap",
        color: "yellow"
      }
    ],
    math: {
      title: "Orbital Velocity",
      intro: "The speed required to maintain a stable orbit:",
      formula: "v = \\sqrt{\\frac{GM}{r}}",
      variables: [
        { symbol: "v", definition: "Orbital velocity" },
        { symbol: "G", definition: "Gravitational constant" },
        { symbol: "M", definition: "Mass of Earth" },
        { symbol: "r", definition: "Distance from Earth's center" }
      ]
    },
    conclusion: {
      title: "Autonomous Future",
      content: "Modern satellites are not just passive relays; they are intelligent, autonomous platforms capable of complex decision-making in orbit.",
      highlight: "Neural Core Active",
      highlightNote: "Autonomous Operations"
    },
    modules: [
      {
        title: "Orbital Dynamics Engine",
        desc: "Formulate the patched-conic approximation for interplanetary transfer orbits.",
        completed: true,
        objectives: ["Calculate delta-V budgets", "Understand Hohmann transfer efficiency"],
        interactiveLabel: "Start Orbital Sim",
        interactiveType: "simulation",
        simulationId: "virtual-lab",
        quiz: {
          question: "Which orbit type minimizes signal latency for global communications?",
          options: ["LEO", "MEO", "GEO", "HEO"],
          correctAnswer: 0
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Orbital Dynamics Engine module?",
                  "options": [
                    "Practical analysis and simulation of Orbital Dynamics Engine",
                    "Historical context of Orbital Dynamics Engine",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Formulate the patched-conic approximation for inte...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Start Orbital Sim' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Start Orbital Sim' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Orbital Dynamics Engine, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Orbital Dynamics Engine module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: "Autonomous Intelligence Core",
        desc: "Configure the on-board neural net for real-time semantic segmentation of terrain topology.",
        completed: false,
        objectives: ["Analyze FP16 vs INT8 quantization for space-grade GPUs", "Evaluate autonomous obstacle avoidance"],
        interactiveLabel: "Open Neural Hub",
        interactiveType: "calculator",
        quiz: {
          question: "What is a primary benefit of on-board neural intelligence?",
          options: ["Increased weight", "Reduced latency in data processing", "Higher fuel consumption", "Lower resolution images"],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Autonomous Intelligence Core module?",
                  "options": [
                    "Practical analysis and simulation of Autonomous Intelligence Core",
                    "Historical context of Autonomous Intelligence Core",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Configure the on-board neural net for real-time se...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Open Neural Hub' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Open Neural Hub' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Autonomous Intelligence Core, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Autonomous Intelligence Core module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: "Earth Observation Suite",
        desc: "Study multispectral imaging and synthetic aperture radar (SAR) interferometry.",
        completed: false,
        objectives: ["Differentiate spectral bands", "Understand SAR imaging"],
        interactiveLabel: "Target Coordinates",
        interactiveType: "3d-viewer",
        quiz: {
          question: "What does SAR stand for in satellite imaging?",
          options: ["Signal and Radio", "Synthetic Aperture Radar", "Satellite Air Radio", "Solid Array Radar"],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Earth Observation Suite module?",
                  "options": [
                    "Practical analysis and simulation of Earth Observation Suite",
                    "Historical context of Earth Observation Suite",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Study multispectral imaging and synthetic aperture...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Target Coordinates' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Target Coordinates' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Earth Observation Suite, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Earth Observation Suite module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: "Ion Propulsion Physics",
        desc: "Understand the physics of Hall-effect thrusters and xenon ionization.",
        completed: false,
        objectives: ["Calculate thrust to weight ratio", "Explore fuel efficiency"],
        interactiveLabel: "Fire Thrusters",
        interactiveType: "simulation",
        simulationId: "plasma",
        quiz: {
          question: "What is a major advantage of Ion Propulsion over chemical rockets?",
          options: ["Higher thrust", "Higher specific impulse (efficiency)", "Lower cost", "Easier to build"],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Ion Propulsion Physics module?",
                  "options": [
                    "Practical analysis and simulation of Ion Propulsion Physics",
                    "Historical context of Ion Propulsion Physics",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Understand the physics of Hall-effect thrusters an...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Fire Thrusters' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Fire Thrusters' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Ion Propulsion Physics, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Ion Propulsion Physics module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: "Communication Links",
        desc: "Explore ka-band and laser communication systems.",
        completed: false,
        objectives: ["Understand signal attenuation", "Optimize data throughput"],
        interactiveLabel: "Link Uplink",
        quiz: {
          question: "Which frequency band is commonly used for high-bandwidth satellite internet?",
          options: ["AM Radio", "Ka-band", "VHF", "UHF"],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Communication Links module?",
                  "options": [
                    "Practical analysis and simulation of Communication Links",
                    "Historical context of Communication Links",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Explore ka-band and laser communication systems.\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Link Uplink' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Link Uplink' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Communication Links, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Communication Links module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },
  DysonSphere: {
    title: "Dyson Sphere Megastructure",
    subtitle: "Stellar Energy & Neural Civilization",
    intro: "An ultra-realistic exploration of a Dyson Sphere, a hypothetical megastructure that encompasses a star to capture its total energy output, managed by a civilization-scale neural intelligence.",
    category: "Engineering",
    difficulty: "Advanced",
    duration: "50 min",
    iconName: "Orbit",
    color: "amber",
    sections: [
      {
        title: "Dyson Swarm",
        content: "A vast collection of independent solar collectors orbiting the star. This configuration is more stable than a solid shell and allows for incremental construction.",
        icon: "Orbit",
        color: "amber"
      },
      {
        title: "Energy Transmission",
        content: "Captured solar energy is converted into high-frequency microwave or laser beams and transmitted to planetary hubs or orbital data centers.",
        icon: "Zap",
        color: "yellow"
      },
      {
        title: "Neural Command Hub",
        content: "A massive processing center that coordinates the billions of collectors in the swarm, optimizing their orientation and managing the global energy grid.",
        icon: "Brain",
        color: "purple"
      },
      {
        title: "Civilization Scaling",
        content: "The Dyson Sphere enables a Type II civilization on the Kardashev scale, providing the energy required for planetary-scale computation and interstellar travel.",
        icon: "Rocket",
        color: "blue"
      }
    ],
    math: {
      title: "Solar Constant & Energy",
      intro: "The total power output of a star (Luminosity) captured by a sphere at distance r:",
      formula: "P = L \\cdot \\frac{A_{sphere}}{A_{total}} = L \\cdot \\frac{4\\pi r^2}{4\\pi r^2} = L",
      variables: [
        { symbol: "P", definition: "Captured Power" },
        { symbol: "L", definition: "Stellar Luminosity" },
        { symbol: "r", definition: "Radius of the Dyson Sphere" }
      ]
    },
    conclusion: {
      title: "The Ultimate Megastructure",
      content: "The Dyson Sphere represents the pinnacle of engineering, where a civilization's intelligence is fully integrated with its cosmic environment.",
      highlight: "Stellar Core Active",
      highlightNote: "Type II Civilization"
    },
    modules: [
      {
        title: "Swarm Dynamics Simulation",
        desc: "Analyze the orbital stability and phase-tracking of billions of independent solar collectors.",
        completed: false,
        objectives: ["Understand swarm stability", "Calculate energy capture efficiency"],
        interactiveLabel: "Optimize Swarm",
        interactiveType: "simulation",
        simulationId: "virtual-lab",
        quiz: {
          question: "Why is a Dyson Swarm preferred over a solid Dyson Shell?",
          options: ["It's cheaper", "It's gravitationally stable", "It looks better", "It uses less material"],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Swarm Dynamics Simulation module?",
                  "options": [
                    "Practical analysis and simulation of Swarm Dynamics Simulation",
                    "Historical context of Swarm Dynamics Simulation",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Analyze the orbital stability and phase-tracking o...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Optimize Swarm' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Optimize Swarm' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Swarm Dynamics Simulation, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Swarm Dynamics Simulation module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: "Neural Grid Command",
        desc: "Explore how a Type II civilization AI manages the exajoule-scale energy distribution.",
        completed: false,
        objectives: ["Explore neural energy management", "Understand civilization scaling"],
        interactiveLabel: "Activate Neural Hub",
        interactiveType: "calculator",
        quiz: {
          question: "What Kardashev scale type is associated with a Dyson Sphere?",
          options: ["Type I", "Type II", "Type III", "Type IV"],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Neural Grid Command module?",
                  "options": [
                    "Practical analysis and simulation of Neural Grid Command",
                    "Historical context of Neural Grid Command",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Explore how a Type II civilization AI manages the ...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Activate Neural Hub' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Activate Neural Hub' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Neural Grid Command, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Neural Grid Command module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: "Stellar Life Extension",
        desc: "Quantitative analysis of 'star lifting' to manage hydrogen consumption and increase solar lifespan.",
        completed: false,
        objectives: ["Explore magnetic star lifting", "Calculate stellar lifespan extension"],
        interactiveLabel: "Initiate Star Lift",
        interactiveType: "simulation",
        simulationId: "plasma",
        quiz: {
          question: "What is 'Star Lifting'?",
          options: ["Moving a star", "Removing mass from a star", "Adding mass to a star", "Exploding a star"],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Stellar Life Extension module?",
                  "options": [
                    "Practical analysis and simulation of Stellar Life Extension",
                    "Historical context of Stellar Life Extension",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Quantitative analysis of star lifting to manage hy...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Initiate Star Lift' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Initiate Star Lift' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Stellar Life Extension, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Stellar Life Extension module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },
  MillikanOilDrop: {
    title: "Millikan's Oil Drop",
    subtitle: "Elementary Charge (1909)",
    intro: "The Millikan oil drop experiment was a landmark experiment performed by Robert A. Millikan and Harvey Fletcher in 1909. Its purpose was to measure the elementary electric charge—the charge of a single electron.",
    category: "Physics",
    difficulty: "Advanced",
    duration: "35 min",
    iconName: "FlaskConical",
    color: "indigo",
    sections: [
      {
        title: "The Setup",
        content: "The experiment involved observing tiny electrically charged droplets of oil located between two parallel metal surfaces, forming the plates of a capacitor. An atomizer was used to spray a fine mist of oil droplets into the chamber.",
        icon: "Eye",
        color: "text-emerald-400"
      },
      {
        title: "The Method",
        content: "Millikan observed the drops falling under the influence of gravity. He then applied a voltage across the plates, creating an electric field. By adjusting the voltage, he could balance the downward gravitational force with the upward electric force.",
        icon: "Zap",
        color: "text-amber-400"
      }
    ],
    math: {
      title: "The Physics & Math",
      intro: "When a droplet is suspended, the forces are balanced:",
      formula: "Fe = Fg => q · E = m · g",
      variables: [
        { symbol: "q", definition: "charge of the droplet" },
        { symbol: "E", definition: "electric field (Voltage / distance)" },
        { symbol: "m", definition: "mass of the droplet" },
        { symbol: "g", definition: "acceleration due to gravity" }
      ]
    },
    conclusion: {
      title: "Groundbreaking Conclusion",
      content: "By repeating the experiment for many droplets, Millikan found that the calculated charges were not continuous, but rather discrete. Every charge was an integer multiple of a single, fundamental, indivisible value.",
      highlight: "e ≈ 1.592 × 10⁻¹⁹ Coulombs",
      highlightNote: "(Modern accepted value is 1.602 × 10⁻¹⁹ C)"
    },
    modules: [
      {
        title: "Electrostatic Force Balance",
        desc: "Achieving terminal velocity equilibrium for micron-scale oil droplets.",
        completed: true,
        objectives: ["Balance gravity and electric force.", "Calculate charge."],
        interactiveLabel: "Balance Droplet",
        interactiveType: "simulation",
        simulationId: "virtual-lab",
        quiz: {
          question: "What two forces are balanced when the droplet is stationary?",
          options: ["Gravity and Friction", "Gravity and Electric Force", "Magnetic and Electric Force", "Strong and Weak Force"],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Electrostatic Force Balance module?",
                  "options": [
                    "Practical analysis and simulation of Electrostatic Force Balance",
                    "Historical context of Electrostatic Force Balance",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Achieving terminal velocity equilibrium for micron...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Balance Droplet' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Balance Droplet' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Electrostatic Force Balance, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Electrostatic Force Balance module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: "Stokes' Law Analysis",
        desc: "Calculate droplet mass using terminal velocity in a viscous medium (air).",
        completed: false,
        objectives: ["Measure terminal velocity", "Apply Stokes' Law"],
        interactiveLabel: "Measure Velocity",
        interactiveType: "calculator",
        quiz: {
          question: "Stokes' Law is used to determine what quantity of the oil drop?",
          options: ["Charge", "Radius/Mass", "Voltage", "Color"],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Stokes Law Analysis module?",
                  "options": [
                    "Practical analysis and simulation of Stokes Law Analysis",
                    "Historical context of Stokes Law Analysis",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Calculate droplet mass using terminal velocity in ...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Measure Velocity' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Measure Velocity' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Stokes Law Analysis, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Stokes Law Analysis module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: "Elementary Charge Quantization",
        desc: "Statistical analysis of collected data to reveal the fundamental unit of charge 'e'.",
        completed: false,
        objectives: ["Compare multiple drops", "Find greatest common divisor of charges"],
        interactiveLabel: "Analyze Quantization",
        interactiveType: "calculator",
        quiz: {
          question: "Millikan's experiment proved that electric charge is:",
          options: ["Continuous", "Quantized", "Infinite", "Zero"],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Elementary Charge Quantization module?",
                  "options": [
                    "Practical analysis and simulation of Elementary Charge Quantization",
                    "Historical context of Elementary Charge Quantization",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Statistical analysis of collected data to reveal t...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Analyze Quantization' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Analyze Quantization' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Elementary Charge Quantization, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Elementary Charge Quantization module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },

  Atom: {
    title: 'Quantum Atomic Structure',
    subtitle: 'The Building Blocks of Matter',
    intro: "The Quantum Atomic Structure module provides a comprehensive analysis of subatomic realms. By utilizing high-fidelity holographic projections, students can visualize the probabilistic nature of electron clouds, moving beyond the simplified Bohr model. This course emphasizes the role of quantum numbers and the Pauli exclusion principle in determining atomic behavior and chemical reactivity, providing a deep understanding of the fundamental building blocks of matter.",
    category: "Science",
    difficulty: "Beginner",
    duration: "15 min",
    iconName: "Atom",
    color: "cyan",
    sections: [
      {
        title: "The Nucleus",
        content: "At the center lies the nucleus, a dense core of protons and neutrons held together by the strong nuclear force. Despite occupying a tiny fraction of the atom's volume, it contains nearly all its mass.",
        icon: "Atom",
        color: "text-indigo-400"
      },
      {
        title: "Electron Cloud",
        content: "Electrons do not orbit like planets. Instead, they exist in probability clouds defined by quantum numbers. These orbitals (s, p, d, f) represent regions where an electron is likely to be found.",
        icon: "Sparkles",
        color: "text-cyan-400"
      }
    ],
    math: {
      title: "Wave Functions",
      intro: "The behavior of electrons is described by the Schrödinger equation:",
      formula: "ĤΨ = EΨ",
      variables: [
        { symbol: "Ĥ", definition: "Hamiltonian operator (total energy)" },
        { symbol: "Ψ", definition: "Wave function (quantum state)" },
        { symbol: "E", definition: "Energy eigenvalue" }
      ]
    },
    conclusion: {
      title: "Quantum Reality",
      content: "The atom is not a miniature solar system but a complex quantum system. Understanding this structure is key to chemistry, materials science, and quantum computing.",
      highlight: "Δx · Δp ≥ ℏ/2",
      highlightNote: "Heisenberg Uncertainty Principle"
    },
    modules: [
      { 
        title: 'Quantum Nucleus', 
        desc: 'Protons, neutrons, and the residual strong force interaction.', 
        completed: true,
        objectives: ['Identify the components of an atomic nucleus.', 'Understand the role of the strong nuclear force.'],
        interactiveLabel: 'Holographic Nucleus',
        interactiveType: '3d-viewer',
        quiz: {
          question: 'Which force holds the protons and neutrons together in the nucleus?',
          options: ['Electromagnetic Force', 'Gravity', 'Strong Nuclear Force', 'Weak Nuclear Force'],
          correctAnswer: 2
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Quantum Nucleus module?",
                  "options": [
                    "Practical analysis and simulation of Quantum Nucleus",
                    "Historical context of Quantum Nucleus",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Protons, neutrons, and the residual strong force i...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Holographic Nucleus' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Holographic Nucleus' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Quantum Nucleus, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Quantum Nucleus module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      { 
        title: 'Orbital Probability Shells', 
        desc: 'Visualizing wave functions (ψ) and electron density distributions.', 
        completed: false,
        objectives: ['Visualize electron probability clouds.', 'Define principal quantum numbers.'],
        interactiveLabel: 'Simulate Orbitals',
        interactiveType: 'simulation',
        simulationId: 'plasma',
        quiz: {
          question: 'What does the principal quantum number (n) indicate?',
          options: ['Spin direction', 'Energy level and distance from nucleus', 'Orbital shape', 'Magnetic orientation'],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Orbital Probability Shells module?",
                  "options": [
                    "Practical analysis and simulation of Orbital Probability Shells",
                    "Historical context of Orbital Probability Shells",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Visualizing wave functions (ψ) and electron densit...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Simulate Orbitals' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Simulate Orbitals' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Orbital Probability Shells, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Orbital Probability Shells module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: 'Quantum Energy Transitions',
        desc: 'Photon emission spectra and the Rydberg formula.',
        completed: false,
        objectives: ['Analyze h-alpha lines.', 'Calculate energy transitions.'],
        interactiveLabel: 'Spectroscopy Sim',
        interactiveType: 'simulation',
        simulationId: 'virtual-lab',
        quiz: {
          question: 'An atomic emission spectrum is caused by electrons:',
          options: ['Entering the nucleus', 'Moving to a higher energy level', 'Falling to a lower energy level', 'Spinning faster'],
          correctAnswer: 2
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Quantum Energy Transitions module?",
                  "options": [
                    "Practical analysis and simulation of Quantum Energy Transitions",
                    "Historical context of Quantum Energy Transitions",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Photon emission spectra and the Rydberg formula.\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Spectroscopy Sim' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Spectroscopy Sim' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Quantum Energy Transitions, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Quantum Energy Transitions module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },

  DNA: {
    title: 'Advanced Genomic Architecture',
    subtitle: 'Molecular Dynamics & Information Theory',
    intro: "The Advanced Genomic Architecture module provides a rigorous exploration of DNA at the molecular level. This course covers structural polymorphism (B-DNA, A-DNA, Z-DNA), the thermodynamics of base stacking interactions, and the complex mechanisms of epigenetic regulation. Students will gain deep insight into how DNA's physical properties and chemical modifications dictate biological function and information storage.",
    category: "Science",
    difficulty: "Intermediate",
    duration: "20 min",
    iconName: "Dna",
    color: "indigo",
    sections: [
      {
        title: "Structural Polymorphism",
        content: "DNA is not a static structure. It exhibits polymorphism, including the canonical B-DNA, the dehydrated A-DNA, and the left-handed Z-DNA. These structures are dictated by hydration levels, salt concentration, and sequence-specific effects.",
        icon: "Dna",
        color: "text-rose-400"
      },
      {
        title: "Thermodynamics of Stacking",
        content: "The stability of the DNA duplex is primarily driven by hydrophobic stacking interactions between adjacent base pairs, rather than just hydrogen bonding. These interactions are highly sequence-dependent.",
        icon: "Activity",
        color: "text-blue-400"
      },
      {
        title: "Epigenetic Regulation",
        content: "DNA function is modulated by chemical modifications such as cytosine methylation. These modifications do not change the sequence but profoundly alter gene expression patterns.",
        icon: "Shield",
        color: "text-emerald-400"
      }
    ],
    math: {
      title: "Gibbs Free Energy of Duplex Formation",
      intro: "The stability of DNA duplex formation is governed by the thermodynamic equation:",
      formula: "ΔG°total = ΔH° - TΔS°",
      variables: [
        { symbol: "ΔG°", definition: "Gibbs free energy (stability)" },
        { symbol: "ΔH°", definition: "Enthalpy (stacking/H-bonds)" },
        { symbol: "ΔS°", definition: "Entropy (conformational)" },
        { symbol: "T", definition: "Temperature" }
      ]
    },
    conclusion: {
      title: "Molecular Dynamics",
      content: "DNA is a dynamic molecule whose physical properties are essential for its biological role. Understanding these dynamics is crucial for fields ranging from synthetic biology to personalized medicine.",
      highlight: "Sequence-Dependent Stability",
      highlightNote: "Thermodynamic landscape of DNA"
    },
    modules: [
      { 
        title: 'Polymorphism Visualization', 
        desc: 'Identifying structural variations (B-DNA, A-DNA, Z-DNA).', 
        completed: true,
        objectives: ['Differentiate B-DNA, A-DNA, and Z-DNA.', 'Understand the role of hydration.'],
        interactiveLabel: 'Z-DNA 3D View',
        interactiveType: '3d-viewer',
        quiz: {
          question: 'Which form of DNA is left-handed?',
          options: ['B-DNA', 'A-DNA', 'Z-DNA', 'C-DNA'],
          correctAnswer: 2
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Polymorphism Visualization module?",
                  "options": [
                    "Practical analysis and simulation of Polymorphism Visualization",
                    "Historical context of Polymorphism Visualization",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Identifying structural variations (B-DNA, A-DNA, Z...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Z-DNA 3D View' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Z-DNA 3D View' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Polymorphism Visualization, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Polymorphism Visualization module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      { 
        title: 'Thermodynamic Laboratory', 
        desc: 'Simulating duplex stability and melting temperature kinetics.', 
        completed: false,
        objectives: ['Understand stacking interactions.', 'Relate GC content to melting temperature.'],
        interactiveLabel: 'Melting Sim',
        interactiveType: 'simulation',
        simulationId: 'virtual-lab',
        quiz: {
          question: 'What is the primary driver of DNA duplex stability?',
          options: ['Hydrogen bonding', 'Hydrophobic stacking interactions', 'Phosphate backbone repulsion', 'Sugar-base interactions'],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Thermodynamic Laboratory module?",
                  "options": [
                    "Practical analysis and simulation of Thermodynamic Laboratory",
                    "Historical context of Thermodynamic Laboratory",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Simulating duplex stability and melting temperatur...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Melting Sim' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Melting Sim' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Thermodynamic Laboratory, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Thermodynamic Laboratory module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: 'Genomic Replication Core',
        desc: 'Enzymatic analysis of DNA polymerase processing at the replication fork.',
        completed: false,
        objectives: ['Understand DNA polymerase function.', 'Identify lagging vs leading strands.'],
        interactiveLabel: 'Replicate DNA',
        interactiveType: 'simulation',
        simulationId: 'virtual-lab',
        quiz: {
          question: 'Which enzyme is responsible for synthesizing new DNA strands?',
          options: ['Ligase', 'Helicase', 'DNA Polymerase', 'Primase'],
          correctAnswer: 2
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Genomic Replication Core module?",
                  "options": [
                    "Practical analysis and simulation of Genomic Replication Core",
                    "Historical context of Genomic Replication Core",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Enzymatic analysis of DNA polymerase processing at...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Replicate DNA' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Replicate DNA' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Genomic Replication Core, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Genomic Replication Core module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },
  SolarSystem: {
    title: 'Orbital Mechanics',
    subtitle: 'Our Cosmic neighborhood',
    intro: "The Orbital Mechanics module delves into the complex gravitational dynamics governing our solar system. Students will investigate the interactions between celestial bodies, from the fusion-powered Sun to the elliptical orbits of planets. This course emphasizes the application of Kepler's laws and Newtonian mechanics to understand planetary motion and cosmic stability.",
    category: 'Science',
    difficulty: 'Beginner',
    duration: '25 min',
    iconName: 'Orbit',
    color: 'amber',
    sections: [
      {
        title: "Gravity Well",
        content: "The Sun contains 99.86% of the Solar System's mass, creating a massive gravity well that keeps all planets, asteroids, and comets in orbit.",
        icon: "Globe",
        color: "text-yellow-400"
      },
      {
        title: "Planetary Orbits",
        content: "Planets orbit in ellipses, not perfect circles. Their speed varies depending on their distance from the Sun, moving faster at perihelion and slower at aphelion.",
        icon: "Rocket",
        color: "text-orange-400"
      }
    ],
    math: {
      title: "Kepler's Third Law",
      intro: "The relationship between orbital period and radius:",
      formula: "T² ∝ a³",
      variables: [
        { symbol: "T", definition: "Orbital period (time)" },
        { symbol: "a", definition: "Semi-major axis (distance)" }
      ]
    },
    conclusion: {
      title: "Cosmic Scale",
      content: "The Solar System is vast, yet it is just a tiny speck in the Milky Way galaxy. Understanding our local system is the first step to exploring the universe.",
      highlight: "4.6 Billion Years",
      highlightNote: "Age of the Solar System"
    },
    modules: [
      { 
        title: 'Solar Dynamics Core', 
        desc: 'Nuclear fusion kinetics and CME (Coronal Mass Ejection) simulation.', 
        completed: true,
        objectives: ['Understand nuclear fusion.', 'Identify solar layers.'],
        interactiveLabel: 'CME Simulation',
        interactiveType: 'simulation',
        simulationId: 'plasma',
        quiz: { question: 'What process powers the Sun?', options: ['Fission', 'Fusion', 'Combustion', 'Gravity'], correctAnswer: 1 },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Solar Dynamics Core module?",
                  "options": [
                    "Practical analysis and simulation of Solar Dynamics Core",
                    "Historical context of Solar Dynamics Core",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Nuclear fusion kinetics and CME (Coronal Mass Ejec...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'CME Simulation' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'CME Simulation' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Solar Dynamics Core, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Solar Dynamics Core module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: 'Planetary Mechanics',
        desc: 'Keplerian orbital analysis for inner terrestrial worlds.',
        completed: false,
        objectives: ['Identify rocky planets.', 'Understand planetary composition.'],
        interactiveLabel: 'Explore 3D Orbit',
        interactiveType: '3d-viewer',
        quiz: {
          question: 'Which of the following is NOT a terrestrial planet?',
          options: ['Mercury', 'Mars', 'Jupiter', 'Venus'],
          correctAnswer: 2
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Planetary Mechanics module?",
                  "options": [
                    "Practical analysis and simulation of Planetary Mechanics",
                    "Historical context of Planetary Mechanics",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Keplerian orbital analysis for inner terrestrial w...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Explore 3D Orbit' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Explore 3D Orbit' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Planetary Mechanics, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Planetary Mechanics module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: 'Orbital Perturbation Lab',
        desc: 'Simulating n-body gravitational interactions and orbital stability.',
        completed: false,
        objectives: ['Apply Kepler\'s laws.', 'Calculate orbital eccentricity.'],
        interactiveLabel: 'Stabilize Orbits',
        interactiveType: 'simulation',
        simulationId: 'virtual-lab',
        quiz: {
          question: 'According to Kepler\'s First Law, orbits are:',
          options: ['Perfect circles', 'Squares', 'Ellipses', 'Triangles'],
          correctAnswer: 2
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Orbital Perturbation Lab module?",
                  "options": [
                    "Practical analysis and simulation of Orbital Perturbation Lab",
                    "Historical context of Orbital Perturbation Lab",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Simulating n-body gravitational interactions and o...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Stabilize Orbits' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Stabilize Orbits' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Orbital Perturbation Lab, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Orbital Perturbation Lab module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },
  QuantumPhysics: {
    title: 'Quantum Mechanics',
    subtitle: 'The Fabric of Reality',
    intro: "The Quantum Mechanics module offers an advanced study of the probabilistic nature of reality at the subatomic scale. Students will analyze fundamental phenomena such as wave-particle duality, quantum superposition, and entanglement. This course provides a rigorous foundation for understanding the principles that underpin modern quantum technologies and materials science.",
    category: 'Science',
    difficulty: 'Advanced',
    duration: '40 min',
    iconName: 'Zap',
    color: 'cyan',
    sections: [
      {
        title: "Wave-Particle Duality",
        content: "Matter and light exhibit behaviors of both waves and particles. The double-slit experiment demonstrates this fundamental mystery.",
        icon: "Sparkles",
        color: "text-purple-400"
      },
      {
        title: "Superposition",
        content: "A quantum system can exist in multiple states simultaneously until it is measured. This is famously illustrated by Schrödinger's Cat.",
        icon: "Box",
        color: "text-pink-400"
      }
    ],
    math: {
      title: "Heisenberg Uncertainty",
      intro: "Precision is limited by nature:",
      formula: "σxσp ≥ ℏ/2",
      variables: [
        { symbol: "σx", definition: "Position uncertainty" },
        { symbol: "σp", definition: "Momentum uncertainty" }
      ]
    },
    conclusion: {
      title: "Quantum Future",
      content: "Quantum mechanics is the foundation of modern electronics, lasers, and future quantum computers.",
      highlight: "Entanglement",
      highlightNote: "Spooky action at a distance"
    },
    modules: [
      { 
        title: 'Wave-Particle Simulator', 
        desc: 'The double-slit experiment and wave function collapse visualization.', 
        completed: false,
        objectives: ['Understand the de Broglie wavelength.', 'Analyze interference patterns.'],
        interactiveLabel: 'Run Slit Sim',
        interactiveType: 'simulation',
        simulationId: 'plasma',
        quiz: { question: 'What does the double-slit experiment demonstrate?', options: ['Gravity', 'Wave-particle duality', 'Relativity', 'Thermodynamics'], correctAnswer: 1 },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Wave-Particle Simulator module?",
                  "options": [
                    "Practical analysis and simulation of Wave-Particle Simulator",
                    "Historical context of Wave-Particle Simulator",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"The double-slit experiment and wave function colla...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Run Slit Sim' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Run Slit Sim' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Wave-Particle Simulator, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Wave-Particle Simulator module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: 'Bloch Sphere Dynamics',
        desc: 'Foundations of quantum information theory and qubit state evolution.',
        completed: false,
        objectives: ['Define a qubit.', 'Visualize state vectors on Bloch sphere.'],
        interactiveLabel: '3D Bloch Sphere',
        interactiveType: '3d-viewer',
        quiz: {
          question: 'A qubit can exist in ________ states at once.',
          options: ['One', 'Two', 'Multiple', 'Zero'],
          correctAnswer: 2
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Bloch Sphere Dynamics module?",
                  "options": [
                    "Practical analysis and simulation of Bloch Sphere Dynamics",
                    "Historical context of Bloch Sphere Dynamics",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Foundations of quantum information theory and qubi...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the '3D Bloch Sphere' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like '3D Bloch Sphere' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Bloch Sphere Dynamics, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Bloch Sphere Dynamics module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: 'Quantum Tunneling Lab',
        desc: 'Analysis of wave function leakage through classically forbidden potential barriers.',
        completed: false,
        objectives: ['Understand wave function leakage.', 'Identify semiconductor impacts.'],
        interactiveLabel: 'Launch Tunnel Sim',
        interactiveType: 'simulation',
        simulationId: 'virtual-lab',
        quiz: {
          question: 'Quantum tunneling is the phenomenon where a particle:',
          options: ['Bounces off a wall', 'Passes through a forbidden energy barrier', 'Stops moving', 'Disappears'],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Quantum Tunneling Lab module?",
                  "options": [
                    "Practical analysis and simulation of Quantum Tunneling Lab",
                    "Historical context of Quantum Tunneling Lab",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Analysis of wave function leakage through classica...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Launch Tunnel Sim' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Launch Tunnel Sim' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Quantum Tunneling Lab, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Quantum Tunneling Lab module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },
  OrganicChemistry: {
    title: 'Organic Chemistry',
    subtitle: 'Carbon-Based Life',
    intro: "The Organic Chemistry module presents a detailed examination of carbon-based molecular structures and their reactivity. Students will explore the principles of hybridization, functional group identification, and the geometric arrangement of organic compounds. This course highlights the complexity of carbon bonding, which forms the basis for the diversity of life and synthetic materials.",
    category: 'Science',
    difficulty: 'Intermediate',
    duration: '30 min',
    iconName: 'FlaskConical',
    color: 'pink',
    sections: [
      {
        title: "Hybridization",
        content: "Carbon atoms mix orbitals to form new hybrid orbitals (sp, sp2, sp3), determining the geometry of molecules.",
        icon: "FlaskConical",
        color: "text-green-400"
      },
      {
        title: "Functional Groups",
        content: "Specific groups of atoms within molecules that are responsible for the characteristic chemical reactions of those molecules.",
        icon: "Beaker",
        color: "text-blue-400"
      }
    ],
    math: {
      title: "Bond Angles",
      intro: "Geometry of sp3 carbon:",
      formula: "θ ≈ 109.5°",
      variables: [
        { symbol: "θ", definition: "Tetrahedral bond angle" }
      ]
    },
    conclusion: {
      title: "Molecular Diversity",
      content: "From simple methane to complex DNA, organic chemistry explains the diversity of matter in living organisms.",
      highlight: "10 Million+",
      highlightNote: "Known organic compounds"
    },
    modules: [
      { 
        title: 'Hybridization Viewer', 
        desc: 'Symmetry and orbital mixing in carbon compounds (sp, sp2, sp3).', 
        completed: false,
        objectives: ['Identify hybridization states.', 'Determine molecular geometry.'],
        interactiveLabel: '3D Orbitals',
        interactiveType: '3d-viewer',
        quiz: { question: 'What is the geometry of an sp3 hybridized carbon?', options: ['Linear', 'Trigonal planar', 'Tetrahedral', 'Octahedral'], correctAnswer: 2 },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Hybridization Viewer module?",
                  "options": [
                    "Practical analysis and simulation of Hybridization Viewer",
                    "Historical context of Hybridization Viewer",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Symmetry and orbital mixing in carbon compounds (s...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the '3D Orbitals' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like '3D Orbitals' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Hybridization Viewer, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Hybridization Viewer module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: 'Organic Synthesis Lab',
        desc: 'Mechanism analysis of electrophilic substitution and carbocation stability.',
        completed: false,
        objectives: ['Identify structural isomers.', 'Explore stereoisomerism.'],
        interactiveLabel: 'Synthesize Molecule',
        interactiveType: 'simulation',
        simulationId: 'virtual-lab',
        quiz: {
          question: 'Isomers are molecules with the same formula but different:',
          options: ['Mass', 'Atoms', 'Arrangement of atoms', 'Charge'],
          correctAnswer: 2
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Organic Synthesis Lab module?",
                  "options": [
                    "Practical analysis and simulation of Organic Synthesis Lab",
                    "Historical context of Organic Synthesis Lab",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Mechanism analysis of electrophilic substitution a...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Synthesize Molecule' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Synthesize Molecule' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Organic Synthesis Lab, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Organic Synthesis Lab module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },

  Missile: {
    title: 'Aerospace Ballistics',
    subtitle: 'Guidance & Propulsion',
    intro: "The Aerospace Ballistics module offers a technical overview of modern missile systems, encompassing aerodynamics, propulsion, and guidance control. Students will explore the application of physics to trajectory stability, thrust generation, and inertial navigation. This course provides insight into the complex engineering required for high-speed, precision-guided aerospace vehicles.",
    category: 'Engineering',
    difficulty: 'Advanced',
    duration: '30 min',
    iconName: 'Rocket',
    color: 'red',
    sections: [
      {
        title: "Rocket Propulsion",
        content: "Newton's third law in action. High-pressure gas is expelled backwards to generate forward thrust.",
        icon: "Flame",
        color: "text-orange-400"
      },
      {
        title: "Guidance Systems",
        content: "Inertial measurement units (IMUs) and GPS work together to adjust control surfaces and steer the missile to its target.",
        icon: "Target",
        color: "text-red-400"
      }
    ],
    math: {
      title: "Thrust Equation",
      intro: "Force generation:",
      formula: "F = ṁve + (pe - p0)Ae",
      variables: [
        { symbol: "ṁ", definition: "Mass flow rate" },
        { symbol: "ve", definition: "Exhaust velocity" }
      ]
    },
    conclusion: {
      title: "Precision Engineering",
      content: "Modern missiles are marvels of control theory and aerodynamics, capable of extreme maneuvers.",
      highlight: "Mach 3+",
      highlightNote: "Supersonic Speeds"
    },
    modules: [
      { 
        title: 'Ballistic Optimization', 
        desc: 'Drag divergence and fin stability analysis in supersonic flight regimes.', 
        completed: false,
        objectives: ['Understand the four forces of flight.', 'Analyze fin stability.'],
        interactiveLabel: 'Wind Tunnel Sim',
        interactiveType: 'simulation',
        simulationId: 'aerodynamics',
        quiz: { question: 'Which component provides stability?', options: ['Nose cone', 'Fins', 'Engine', 'Warhead'], correctAnswer: 1 },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Ballistic Optimization module?",
                  "options": [
                    "Practical analysis and simulation of Ballistic Optimization",
                    "Historical context of Ballistic Optimization",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Drag divergence and fin stability analysis in supe...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Wind Tunnel Sim' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Wind Tunnel Sim' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Ballistic Optimization, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Ballistic Optimization module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: 'Thrust Vector Lab',
        desc: 'Dynamic control of nozzle gimbaling for high-alpha maneuverability.',
        completed: false,
        objectives: ['Understand nozzle deflection.', 'Analyze maneuverability.'],
        interactiveLabel: 'Thrust Vectoring',
        interactiveType: 'simulation',
        simulationId: 'plasma',
        quiz: {
          question: 'Thrust vectoring allows a missile to:',
          options: ['Go faster', 'Carry more weight', 'Manuever without aerodynamic surfaces', 'Self-destruct'],
          correctAnswer: 2
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Thrust Vector Lab module?",
                  "options": [
                    "Practical analysis and simulation of Thrust Vector Lab",
                    "Historical context of Thrust Vector Lab",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Dynamic control of nozzle gimbaling for high-alpha...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Thrust Vectoring' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Thrust Vectoring' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Thrust Vector Lab, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Thrust Vector Lab module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },
  AircraftAerodynamics: {
    title: 'Advanced Aircraft Aerodynamics',
    subtitle: 'Fluid Dynamics, CFD & Next-Gen Airframes',
    intro: "The Advanced Aircraft Aerodynamics module provides an exhaustive technical analysis of the fluid dynamics governing modern and future aerospace vehicles. Students will investigate the complex interplay between the Navier-Stokes equations, boundary layer theory, and high-fidelity Computational Fluid Dynamics (CFD). This course emphasizes the transition from classical tube-and-wing architectures to revolutionary Blended Wing Body (BWB) designs, exploring the physics of transonic flow, shockwave management, and aeroelastic stability.",
    category: 'Engineering',
    difficulty: 'Advanced',
    duration: '40 min',
    iconName: 'Rocket',
    color: 'blue',
    sections: [
      {
        title: "Navier-Stokes Foundations",
        content: "At the core of aerodynamics are the Navier-Stokes equations, which describe the motion of viscous fluid substances. Understanding the balance of mass, momentum, and energy is essential for predicting complex flow patterns around arbitrary geometries.",
        icon: "Sigma",
        color: "text-cyan-400"
      },
      {
        title: "Boundary Layer Control",
        content: "Managing the boundary layer—the thin region of fluid near the aircraft surface—is critical for efficiency. We explore laminar flow control, turbulent transition, and the use of vortex generators to delay flow separation at high angles of attack.",
        icon: "Activity",
        color: "text-blue-400"
      },
      {
        title: "Transonic & Supersonic Flow",
        content: "As aircraft approach the speed of sound, compressibility effects become dominant. We analyze the formation of shockwaves, wave drag, and the 'area rule' which dictates the cross-sectional distribution for minimum transonic drag.",
        icon: "Zap",
        color: "text-amber-400"
      },
      {
        title: "BWB & Aero-Structural Integration",
        content: "The Blended Wing Body (BWB) represents the pinnacle of aero-structural integration. By eliminating the distinct fuselage-wing junction, the BWB minimizes interference drag and maximizes internal volume while providing a superior lift-to-drag ratio.",
        icon: "Rocket",
        color: "text-indigo-400"
      }
    ],
    math: {
      title: "The Kutta-Joukowski Theorem",
      intro: "Relating lift per unit span to circulation and fluid density:",
      formula: "L' = ρ · v∞ · Γ",
      variables: [
        { symbol: "L'", definition: "Lift per unit span" },
        { symbol: "ρ", definition: "Fluid density" },
        { symbol: "v∞", definition: "Freestream velocity" },
        { symbol: "Γ", definition: "Circulation (line integral of velocity)" }
      ]
    },
    conclusion: {
      title: "The Aero-Digital Revolution",
      content: "The future of aerodynamics lies in the tight coupling of digital twins, real-time sensor feedback, and morphing wing technologies. These advancements will enable aircraft to adapt their geometry in flight for optimal efficiency across all regimes.",
      highlight: "L/D > 25",
      highlightNote: "Target Lift-to-Drag Ratio for BWB"
    },
    modules: [
      { 
        title: 'Circulation & Lift Geometry', 
        desc: 'Mathematic foundations of potential flow and boundary layer separation.', 
        completed: false,
        objectives: ['Analyze stagnation points', 'Calculate vortex strength Γ'],
        interactiveLabel: 'Launch Aero Sim',
        interactiveType: 'simulation',
        simulationId: 'aerodynamics',
        quiz: {
          question: 'What happens to circulation around an airfoil if viscous forces are neglected?',
          options: ['It remains zero (D\'Alembert\'s Paradox)', 'It increases infinitely', 'It fluctuates', 'It becomes negative'],
          correctAnswer: 0
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Circulation & Lift Geometry module?",
                  "options": [
                    "Practical analysis and simulation of Circulation & Lift Geometry",
                    "Historical context of Circulation & Lift Geometry",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Mathematic foundations of potential flow and bound...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Launch Aero Sim' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Launch Aero Sim' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Circulation & Lift Geometry, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Circulation & Lift Geometry module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      { 
        title: 'Compressibility Physics', 
        desc: 'Rankine-Hugoniot relations and oblique shockwave analysis.', 
        completed: false,
        objectives: ['Calculate pressure ratio across a shock', 'Understand expansion fans'],
        interactiveLabel: 'High-Mach Analysis',
        interactiveType: 'calculator',
        quiz: {
          question: 'What is the characteristic of an oblique shock compared to a normal shock?',
          options: ['Downstream flow is always subsonic', 'Flow remains supersonic but changes direction', 'Pressure stays constant', 'Temperature decreases'],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Compressibility Physics module?",
                  "options": [
                    "Practical analysis and simulation of Compressibility Physics",
                    "Historical context of Compressibility Physics",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Rankine-Hugoniot relations and oblique shockwave a...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'High-Mach Analysis' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'High-Mach Analysis' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Compressibility Physics, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Compressibility Physics module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: 'BWB Stability & Control',
        desc: 'Longitudinal stability in tailless flying wing configurations.',
        completed: false,
        objectives: ['Understand static margin', 'Analyze reflex airfoils'],
        interactiveLabel: 'Stability Test',
        interactiveType: 'simulation',
        simulationId: 'aerodynamics',
        quiz: {
          question: 'How is longitudinal stability achieved without a tail?',
          options: ['Adding more fuel', 'Using reflexed airfoils and wing twist', 'Increasing speed', 'Reducing weight'],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the BWB Stability & Control module?",
                  "options": [
                    "Practical analysis and simulation of BWB Stability & Control",
                    "Historical context of BWB Stability & Control",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Longitudinal stability in tailless flying wing con...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Stability Test' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Stability Test' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring BWB Stability & Control, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the BWB Stability & Control module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: 'Computational Fluid Dynamics',
        desc: 'Discretization techniques for solving Navier-Stokes equations.',
        completed: false,
        objectives: ['Understand mesh generation', 'Compare k-epsilon vs k-omega models'],
        interactiveLabel: 'Run CFD Solver',
        interactiveType: 'simulation',
        simulationId: 'virtual-lab',
        quiz: {
          question: 'What is the purpose of a boundary layer mesh in CFD?',
          options: ['To look good', 'To capture high velocity gradients near the wall', 'To slow down calculations', 'To change fluid color'],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Computational Fluid Dynamics module?",
                  "options": [
                    "Practical analysis and simulation of Computational Fluid Dynamics",
                    "Historical context of Computational Fluid Dynamics",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Discretization techniques for solving Navier-Stoke...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Run CFD Solver' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Run CFD Solver' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Computational Fluid Dynamics, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Computational Fluid Dynamics module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },
  Fractals: {
    title: 'Fractal Geometry',
    subtitle: 'The Geometry of Nature',
    intro: "The Fractal Geometry module explores the mathematical principles of infinite complexity and self-similarity. Students will analyze how recursive processes generate irregular shapes that model natural phenomena, from coastlines to clouds. This course bridges the gap between abstract mathematics and the hidden order found in chaotic systems.",
    category: 'Mathematics',
    difficulty: 'Advanced',
    duration: '30 min',
    iconName: 'Binary',
    color: 'emerald',
    sections: [
      {
        title: "Self-Similarity",
        content: "A property where a part of the object resembles the whole object. This pattern repeats at every scale.",
        icon: "Layers",
        color: "text-purple-400"
      },
      {
        title: "Recursion",
        content: "Fractals are generated by repeating a simple process over and over again in a feedback loop.",
        icon: "Activity",
        color: "text-indigo-400"
      }
    ],
    math: {
      title: "Mandelbrot Set",
      intro: "The most famous fractal equation:",
      formula: "zn+1 = zn² + c",
      variables: [
        { symbol: "z", definition: "Complex number" },
        { symbol: "c", definition: "Constant" }
      ]
    },
    conclusion: {
      title: "Infinite Detail",
      content: "Fractals bridge the gap between mathematics and art, revealing the hidden order in chaos.",
      highlight: "Infinite",
      highlightNote: "Perimeter length"
    },
    modules: [
      { 
        title: 'Fractal Topology Viewer', 
        desc: 'Recursive zoom and bifurcation analysis of complex sets.', 
        completed: false,
        objectives: ['Define fractal dimension.', 'Identify self-similar structures.'],
        interactiveLabel: 'Zoom Fractal',
        interactiveType: 'simulation',
        simulationId: 'plasma',
        quiz: { question: 'Which is a classic fractal?', options: ['Circle', 'Mandelbrot set', 'Line', 'Cube'], correctAnswer: 1 },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Fractal Topology Viewer module?",
                  "options": [
                    "Practical analysis and simulation of Fractal Topology Viewer",
                    "Historical context of Fractal Topology Viewer",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Recursive zoom and bifurcation analysis of complex...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Zoom Fractal' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Zoom Fractal' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Fractal Topology Viewer, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Fractal Topology Viewer module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: 'L-System Simulations',
        desc: 'Algorithmic growth modeling for natural structures (trees, coastlines).',
        completed: false,
        objectives: ['Identify branching patterns.', 'Model coastline paradox.'],
        interactiveLabel: 'Grow Fractal Tree',
        interactiveType: 'simulation',
        simulationId: 'virtual-lab',
        quiz: {
          question: 'The paradox that a coastline\'s length depends on the measurement scale is called:',
          options: ['Benoit\'s Law', 'The Coastline Paradox', 'Julia Effect', 'Scale Drift'],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the L-System Simulations module?",
                  "options": [
                    "Practical analysis and simulation of L-System Simulations",
                    "Historical context of L-System Simulations",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Algorithmic growth modeling for natural structures...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Grow Fractal Tree' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Grow Fractal Tree' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring L-System Simulations, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the L-System Simulations module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },
  Geometry: {
    title: 'Platonic Solids',
    subtitle: 'Sacred Geometry',
    intro: "The Platonic Solids module provides an in-depth study of the five regular, convex polyhedra and their profound mathematical symmetry. Students will explore the properties of vertices, edges, and faces, and apply Euler's formula to understand their geometric perfection. This course highlights the historical and mathematical significance of these fundamental 3D shapes.",
    category: 'Mathematics',
    difficulty: 'Beginner',
    duration: '15 min',
    iconName: 'Shapes',
    color: 'blue',
    sections: [
      {
        title: "Regular Polygons",
        content: "Each face is the same regular polygon, and the same number of polygons meet at each vertex.",
        icon: "Box",
        color: "text-blue-400"
      },
      {
        title: "Duality",
        content: "Every Platonic solid has a dual. Connecting the centers of the faces of one solid creates another Platonic solid.",
        icon: "Sparkles",
        color: "text-yellow-400"
      }
    ],
    math: {
      title: "Euler's Formula",
      intro: "For any convex polyhedron:",
      formula: "V - E + F = 2",
      variables: [
        { symbol: "V", definition: "Vertices" },
        { symbol: "E", definition: "Edges" },
        { symbol: "F", definition: "Faces" }
      ]
    },
    conclusion: {
      title: "Mathematical Perfection",
      content: "There are only five such solids possible in 3D space, a fact proved by Euclid.",
      highlight: "5 Solids",
      highlightNote: "Tetra, Hexa, Octa, Dodeca, Icosa"
    },
    modules: [
      { 
        title: 'Euler Characteristic Lab', 
        desc: 'Topological analysis of polyhedra (V - E + F = 2).', 
        completed: false,
        objectives: ['Identify all five solids.', 'Apply Euler\'s formula.'],
        interactiveLabel: '3D Solid Viewer',
        interactiveType: '3d-viewer',
        quiz: { question: 'How many faces does an Icosahedron have?', options: ['8', '12', '20', '4'], correctAnswer: 2 },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Euler Characteristic Lab module?",
                  "options": [
                    "Practical analysis and simulation of Euler Characteristic Lab",
                    "Historical context of Euler Characteristic Lab",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Topological analysis of polyhedra (V - E + F = 2).\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the '3D Solid Viewer' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like '3D Solid Viewer' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Euler Characteristic Lab, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Euler Characteristic Lab module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: 'Symmetry & Duals',
        desc: 'Geometric duality simulation and rotational symmetry groups.',
        completed: false,
        objectives: ['Calculate symmetry groups.', 'Understand dual polyhedra.'],
        interactiveLabel: 'Visualize Duals',
        interactiveType: 'simulation',
        simulationId: 'virtual-lab',
        quiz: {
          question: 'What is the dual of a Cube?',
          options: ['Dodecahedron', 'Octahedron', 'Tetrahedron', 'Icosahedron'],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Symmetry & Duals module?",
                  "options": [
                    "Practical analysis and simulation of Symmetry & Duals",
                    "Historical context of Symmetry & Duals",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Geometric duality simulation and rotational symmet...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Visualize Duals' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Visualize Duals' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Symmetry & Duals, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Symmetry & Duals module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },
  Calculus: {
    title: 'Differential & Integral Calculus',
    subtitle: 'The Mathematics of Change',
    intro: "The Calculus module explores the fundamental concepts of limits, derivatives, and integrals. Students will visualize how infinitesimal changes accumulate into total quantities and how the slope of a curve reveals its instantaneous rate of change. This course covers the core of modern analysis and its applications across physical sciences.",
    category: 'Mathematics',
    difficulty: 'Advanced',
    duration: '45 min',
    iconName: 'Function',
    color: 'emerald',
    sections: [
      {
        title: "The Derivative",
        content: "Represents the rate of change of a function at any given point, geometrically seen as the slope of the tangent line.",
        icon: "TrendingUp",
        color: "text-emerald-400"
      },
      {
        title: "The Integral",
        content: "Represents the accumulation of quantities, calculated as the area under a curve between two points.",
        icon: "AreaChart",
        color: "text-blue-400"
      }
    ],
    math: {
      title: "Fundamental Theorem",
      intro: "Connecting differentiation and integration:",
      formula: "\\int_a^b f(x) dx = F(b) - F(a)",
      variables: [
        { symbol: "f(x)", definition: "The integrand" },
        { symbol: "F(x)", definition: "The antiderivative" },
        { symbol: "[a, b]", definition: "Integration interval" }
      ]
    },
    conclusion: {
      title: "Infinite Precision",
      content: "Calculus provides the tools to describe the universe in motion, from planetary orbits to quantum states.",
      highlight: "dx → 0",
      highlightNote: "Infinitesimal Approach"
    },
    modules: [
      { 
        title: 'Differentiation Lab', 
        desc: 'Interactive visualization of slopes and tangent lines.', 
        completed: false,
        objectives: ['Calculate derivatives.', 'Geometric interpretation.'],
        interactiveLabel: 'Explore Derivatives',
        interactiveType: 'simulation',
        simulationId: 'calculus-sim',
        quiz: { question: 'What is the derivative of x²?', options: ['2x', 'x', 'x/2', '1'], correctAnswer: 0 },
        vivaQuestions: [
          {
            "question": "What is the primary thematic focus of the Differentiation Lab?",
            "options": [
              "Practical analysis and simulation of derivatives",
              "Historical origins of calculus",
              "Basic arithmetic operations",
              "Reviewing unassociated theories"
            ],
            "correctAnswer": 0,
            "explanation": "The module focuses on practical visualization and calculation of derivatives."
          },
          {
            "question": "What does the slope of a tangent line represent in calculus?",
            "options": [
              "Instantaneous rate of change",
              "Total area under curve",
              "Average value of function",
              "The root of the equation"
            ],
            "correctAnswer": 0,
            "explanation": "Geometrically, the derivative at a point is exactly the slope of the tangent line at that point."
          }
        ]
      },
      {
        title: 'Integral Area Lab',
        desc: 'Accumulating area under common curves using Riemann sums.',
        completed: false,
        objectives: ['Calculate integrals.', 'Visualize area summation.'],
        interactiveLabel: 'Explore Integrals',
        interactiveType: 'simulation',
        simulationId: 'calculus-sim',
        quiz: { question: 'The integral represents what area?', options: ['Area under curve', 'Total perimeter', 'Volume', 'Gradient'], correctAnswer: 0 },
        vivaQuestions: [
          {
            "question": "What does the integral visualize in this lab?",
            "options": [
              "Area accumulation",
              "Rate of change",
              "Point coordinates",
              "Function roots"
            ],
            "correctAnswer": 0,
            "explanation": "Integration is presented as the accumulation of area under a curve."
          },
          {
            "question": "How does increasing the number of rectangles affect a Riemann sum?",
            "options": [
                "Increases precision of the area estimate",
                "Decreases precision",
                "Changes the function itself",
                "Has no effect on result"
            ],
            "correctAnswer": 0,
            "explanation": "As the width of rectangles approaches zero (dx), the sum approaches the exact value of the integral."
          }
        ]
      }
    ]
  },
  AncientRome: {
    title: 'Roman Architecture',
    subtitle: 'Engineering the Empire',
    intro: "The Roman Architecture module offers a technical analysis of the engineering marvels that defined the Roman Empire. Students will investigate the structural innovations of the arch, the development of revolutionary concrete, and the load distribution principles that enabled massive, enduring constructions. This course examines how Roman engineering prowess shaped the ancient world.",
    category: 'History',
    difficulty: 'Intermediate',
    duration: '25 min',
    iconName: 'Landmark',
    color: 'yellow',
    sections: [
      {
        title: "The Arch",
        content: "The arch allowed Romans to build larger, stronger structures with less material. It distributes weight outwards to the supports.",
        icon: "Scale",
        color: "text-amber-400"
      },
      {
        title: "Concrete",
        content: "Opus caementicium, or Roman concrete, was a revolutionary material that could set underwater and last for millennia.",
        icon: "Layers",
        color: "text-stone-400"
      }
    ],
    math: {
      title: "Load Distribution",
      intro: "Force vectors in an arch:",
      formula: "Fy = Fg / 2",
      variables: [
        { symbol: "Fy", definition: "Vertical reaction" },
        { symbol: "Fg", definition: "Gravitational load" }
      ]
    },
    conclusion: {
      title: "Enduring Legacy",
      content: "Many Roman structures are still standing today, a testament to their engineering prowess.",
      highlight: "80 AD",
      highlightNote: "Colosseum Completion"
    },
    modules: [
      { 
        title: 'Arch Structural Analysis', 
        desc: 'Analyzing keystone stability and vector load distribution.', 
        completed: false,
        objectives: ['Understand weight distribution.', 'Identify the keystone.'],
        interactiveLabel: 'Analyze Load',
        interactiveType: 'simulation',
        simulationId: 'virtual-lab',
        quiz: { question: 'What is the central stone of an arch?', options: ['Voussoir', 'Impost', 'Keystone', 'Pier'], correctAnswer: 2 },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Arch Structural Analysis module?",
                  "options": [
                    "Practical analysis and simulation of Arch Structural Analysis",
                    "Historical context of Arch Structural Analysis",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Analyzing keystone stability and vector load distr...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Analyze Load' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Analyze Load' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Arch Structural Analysis, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Arch Structural Analysis module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: 'Concrete Chemistry', 
        desc: 'Molecular analysis of pozzolanic reaction and seawater durability.', 
        completed: false,
        objectives: ['Understand pozzolana chemistry.', 'Compare with modern concrete.'],
        interactiveLabel: '3D Sample View',
        interactiveType: '3d-viewer',
        quiz: {
          question: 'What ingredient gave Roman concrete its extreme durability?',
          options: ['Steel rebar', 'Volcanic ash', 'Crushed glass', 'Pine resin'],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Concrete Chemistry module?",
                  "options": [
                    "Practical analysis and simulation of Concrete Chemistry",
                    "Historical context of Concrete Chemistry",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Molecular analysis of pozzolanic reaction and seaw...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the '3D Sample View' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like '3D Sample View' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Concrete Chemistry, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Concrete Chemistry module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },
  HumanHeart: {
    title: 'The Cardiac System',
    subtitle: 'Engine of Life',
    intro: "The Cardiac System module offers a detailed examination of the structure and physiological function of the human heart. Students will investigate the mechanics of the four-chambered pump, the electrical conduction system that coordinates contraction, and the principles of hemodynamics. This course provides a deep understanding of the vital organ responsible for maintaining circulatory homeostasis.",
    category: 'Anatomy',
    difficulty: 'Intermediate',
    duration: '20 min',
    iconName: 'Heart',
    color: 'red',
    sections: [
      {
        title: "Four Chambers",
        content: "The heart has two atria (receiving chambers) and two ventricles (pumping chambers), separated by valves to ensure one-way flow.",
        icon: "Activity",
        color: "text-red-400"
      },
      {
        title: "Electrical System",
        content: "The SA node acts as a natural pacemaker, generating electrical impulses that coordinate heart muscle contraction.",
        icon: "Zap",
        color: "text-yellow-400"
      }
    ],
    math: {
      title: "Cardiac Output",
      intro: "Volume of blood pumped:",
      formula: "CO = HR × SV",
      variables: [
        { symbol: "HR", definition: "Heart Rate" },
        { symbol: "SV", definition: "Stroke Volume" }
      ]
    },
    conclusion: {
      title: "Vital Function",
      content: "The heart beats over 100,000 times a day, pumping thousands of gallons of blood without rest.",
      highlight: "60-100 BPM",
      highlightNote: "Resting Heart Rate"
    },
    modules: [
      { 
        title: 'Hemodynamics Lab', 
        desc: 'Pulsatile flow analysis and ventricular pressure transients.', 
        completed: false,
        objectives: ['Identify chambers.', 'Understand blood flow.'],
        interactiveLabel: 'Trace Flow 3D',
        interactiveType: '3d-viewer',
        quiz: { question: 'Which chamber pumps to the body?', options: ['Right Atrium', 'Right Ventricle', 'Left Atrium', 'Left Ventricle'], correctAnswer: 3 },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Hemodynamics Lab module?",
                  "options": [
                    "Practical analysis and simulation of Hemodynamics Lab",
                    "Historical context of Hemodynamics Lab",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Pulsatile flow analysis and ventricular pressure t...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Trace Flow 3D' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Trace Flow 3D' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Hemodynamics Lab, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Hemodynamics Lab module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: 'Electrical Conduction',
        desc: 'High-fidelity simulation of SA/AV nodal depolarization and ECG wave formation.',
        completed: false,
        objectives: ['Identify SA and AV nodes.', 'Understand depolarization waves.'],
        interactiveLabel: 'Start ECG Sim',
        interactiveType: 'simulation',
        simulationId: 'plasma',
        quiz: {
          question: 'Where does the heartbeat electrical signal start?',
          options: ['AV Node', 'SA Node', 'Bundle of His', 'Purkinje Fibers'],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Electrical Conduction module?",
                  "options": [
                    "Practical analysis and simulation of Electrical Conduction",
                    "Historical context of Electrical Conduction",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"High-fidelity simulation of SA/AV nodal depolariza...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Start ECG Sim' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Start ECG Sim' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Electrical Conduction, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Electrical Conduction module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },

  BlackHole: {
    title: 'Extreme Gravity: Black Holes',
    subtitle: 'Singularities & Spacetime Curvature',
    intro: "A rigorous mathematical exploration of Schwarzschild and Kerr black holes. This module analyzes the stress-energy tensor, the Penrose process, and the information paradox. Students will differentiate between stellar-mass, intermediate, and supermassive black holes, focusing on the relativistic effects near the event horizon.",
    category: 'Astrophysics',
    difficulty: 'Advanced',
    duration: '55 min',
    iconName: 'Orbit',
    color: 'purple',
    sections: [
      {
        title: "Schwarzschild Metric",
        content: "Understanding the geometry of empty spacetime around a non-rotating, uncharged massive sphere. We explore how gravity warps time (t-coordinate) towards infinity at the horizon.",
        icon: "Sigma",
        color: "text-indigo-400"
      },
      {
        title: "Relativistic Accretion",
        content: "Analysis of the magneto-hydrodynamics (MHD) of plasma spiraling into the horizon, converting gravitational potential energy into x-ray luminosity with >10% efficiency.",
        icon: "Zap",
        color: "text-violet-400"
      }
    ],
    math: {
      title: "Schwarzschild Radius",
      intro: "Determining the event horizon radius for a non-rotating mass:",
      formula: "R_s = \\frac{2GM}{c^2}",
      variables: [
        { symbol: "G", definition: "Gravitational constant" },
        { symbol: "M", definition: "Mass of the singularity" },
        { symbol: "c", definition: "Speed of light in vacuum" }
      ]
    },
    conclusion: {
      title: "Information & Entropy",
      content: "Hawking radiation suggests black holes are not completely black, leading to modern theories on holographic duality and quantum gravity.",
      highlight: "Entropy ∝ Area",
      highlightNote: "Bekenstein-Hawking Entropy"
    },
    modules: [
      { 
        title: 'Schwarzschild Metric 3D', 
        desc: 'Escape velocity and photon spheres in Schwarzschild spacetime.', 
        completed: false,
        objectives: ['Calculate Rs for various masses', 'Understand time dilation at 1.5Rs'],
        interactiveLabel: 'Rs Spacetime View',
        interactiveType: '3d-viewer',
        quiz: { question: 'What is the radius where light can orbit a black hole in a circle?', options: ['Rs', '1.5 Rs', '2 Rs', '3 Rs'], correctAnswer: 1 },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Schwarzschild Metric 3D module?",
                  "options": [
                    "Practical analysis and simulation of Schwarzschild Metric 3D",
                    "Historical context of Schwarzschild Metric 3D",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Escape velocity and photon spheres in Schwarzschil...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Rs Spacetime View' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Rs Spacetime View' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Schwarzschild Metric 3D, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Schwarzschild Metric 3D module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: 'Accretion Disk Simulator',
        desc: 'Relativistic fluid dynamics and X-ray luminosity gradients.',
        completed: false,
        objectives: ['Calculate differential gravity across an object', 'Analyze material failure points'],
        interactiveLabel: 'Run Accretion Sim',
        interactiveType: 'simulation',
        simulationId: 'plasma',
        quiz: {
          question: 'Tidal forces are stronger for:',
          options: ['Larger black holes', 'Smaller black holes', 'Rotating black holes', 'Charged black holes'],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Accretion Disk Simulator module?",
                  "options": [
                    "Practical analysis and simulation of Accretion Disk Simulator",
                    "Historical context of Accretion Disk Simulator",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Relativistic fluid dynamics and X-ray luminosity g...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Run Accretion Sim' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Run Accretion Sim' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Accretion Disk Simulator, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Accretion Disk Simulator module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },
  Cell: {
    title: 'Cellular Biology',
    subtitle: 'The Unit of Life',
    intro: 'Explore the microscopic world of cells. The cell is the basic structural, functional, and biological unit of all known organisms.',
    category: 'Biology',
    difficulty: 'Intermediate',
    duration: '25 min',
    iconName: 'Bug',
    color: 'green',
    sections: [
      {
        title: "Organelles",
        content: "Specialized structures within the cell that perform specific functions, like the nucleus (DNA storage) and mitochondria (energy).",
        icon: "Box",
        color: "text-green-400"
      },
      {
        title: "Membrane",
        content: "A semi-permeable barrier that controls what enters and exits the cell, maintaining homeostasis.",
        icon: "Shield",
        color: "text-blue-400"
      }
    ],
    math: {
      title: "Surface Area to Volume",
      intro: "Limiting cell size:",
      formula: "SA:V ∝ 1/r",
      variables: [
        { symbol: "r", definition: "Radius of cell" }
      ]
    },
    conclusion: {
      title: "Life's Foundation",
      content: "All living things are composed of cells. Understanding cell biology is crucial for medicine and genetics.",
      highlight: "37 Trillion",
      highlightNote: "Cells in Human Body"
    },
    modules: [
      { 
        title: 'Organelle Diagnostics', 
        desc: 'Nanoscale visualization of cytoplasm architecture and metabolic organelles.', 
        completed: false,
        objectives: ['Identify nucleus.', 'Understand DNA role.'],
        interactiveLabel: '3D Cell Viewer',
        interactiveType: '3d-viewer',
        quiz: { question: 'Function of nucleus?', options: ['Energy', 'Protein', 'Genetics', 'Waste'], correctAnswer: 2 },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Organelle Diagnostics module?",
                  "options": [
                    "Practical analysis and simulation of Organelle Diagnostics",
                    "Historical context of Organelle Diagnostics",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Nanoscale visualization of cytoplasm architecture ...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the '3D Cell Viewer' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like '3D Cell Viewer' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Organelle Diagnostics, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Organelle Diagnostics module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: 'Cellular Bioenergetics',
        desc: 'Simulation of ATP synthesis and oxidative phosphorylation kinetics.',
        completed: false,
        objectives: ['Identify mitochondria.', 'Understand ATP production.'],
        interactiveLabel: 'Launch ATP Sim',
        interactiveType: 'simulation',
        simulationId: 'virtual-lab',
        quiz: {
          question: 'What is the main product of the mitochondria?',
          options: ['Glucose', 'ATP', 'Proteins', 'Lipids'],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Cellular Bioenergetics module?",
                  "options": [
                    "Practical analysis and simulation of Cellular Bioenergetics",
                    "Historical context of Cellular Bioenergetics",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Simulation of ATP synthesis and oxidative phosphor...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Launch ATP Sim' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Launch ATP Sim' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Cellular Bioenergetics, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Cellular Bioenergetics module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },
  AnimalCell: {
    title: 'Animal Cell',
    subtitle: 'Eukaryotic Complexity',
    intro: 'A comprehensive analysis of eukaryotic animal cells. Unlike plant cells, they lack a cell wall and chloroplasts.',
    category: 'Biology',
    difficulty: 'Intermediate',
    duration: '20 min',
    iconName: 'Bug',
    color: 'green',
    sections: [
      {
        title: "Mitochondria",
        content: "The powerhouse of the cell, generating ATP through cellular respiration.",
        icon: "Zap",
        color: "text-yellow-400"
      },
      {
        title: "Golgi Apparatus",
        content: "Modifies, sorts, and packages proteins for secretion. It is the cell's post office.",
        icon: "Box",
        color: "text-orange-400"
      }
    ],
    math: {
      title: "ATP Production",
      intro: "Energy currency:",
      formula: "C₆H₁₂O₆ → 38 ATP",
      variables: [
        { symbol: "ATP", definition: "Adenosine Triphosphate" }
      ]
    },
    conclusion: {
      title: "Complex Life",
      content: "Animal cells differentiate into tissues and organs, allowing for complex multicellular life forms.",
      highlight: "Eukaryotic",
      highlightNote: "True Nucleus"
    },
    modules: [
      { 
        title: 'Membrane Dynamics Lab', 
        desc: 'Fluid mosaic model and stochastic diffusion kinetics.', 
        completed: false,
        objectives: ['Understand bilayer.', 'Analyze transport.'],
        interactiveLabel: 'Launch Diffusion Sim',
        interactiveType: 'simulation',
        simulationId: 'virtual-lab',
        quiz: { question: 'Structural stability component?', options: ['Proteins', 'Cholesterol', 'Carbohydrates', 'Nucleic acids'], correctAnswer: 1 },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Membrane Dynamics Lab module?",
                  "options": [
                    "Practical analysis and simulation of Membrane Dynamics Lab",
                    "Historical context of Membrane Dynamics Lab",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Fluid mosaic model and stochastic diffusion kineti...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Launch Diffusion Sim' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Launch Diffusion Sim' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Membrane Dynamics Lab, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Membrane Dynamics Lab module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: 'Ribosomal Synthesis',
        desc: 'Translation logistics and protein folding pathways.',
        completed: false,
        objectives: ['Identify ribosome locations.', 'Understand translation basics.'],
        interactiveLabel: 'View Translation',
        interactiveType: '3d-viewer',
        quiz: {
          question: 'Where are proteins synthesized in the cell?',
          options: ['Nucleus', 'Mitochondria', 'Ribosomes', 'Lysosomes'],
          correctAnswer: 2
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Ribosomal Synthesis module?",
                  "options": [
                    "Practical analysis and simulation of Ribosomal Synthesis",
                    "Historical context of Ribosomal Synthesis",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Translation logistics and protein folding pathways...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'View Translation' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'View Translation' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Ribosomal Synthesis, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Ribosomal Synthesis module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },
  Engine: {
    title: 'Combustion Engine',
    subtitle: 'Mechanical Power',
    intro: 'Analyze the mechanics of a 4-stroke internal combustion engine. This technology powers most of the world\'s vehicles.',
    category: 'Engineering',
    difficulty: 'Intermediate',
    duration: '30 min',
    iconName: 'Cog',
    color: 'zinc',
    sections: [
      {
        title: "4-Stroke Cycle",
        content: "Intake, Compression, Power, Exhaust. This cycle converts chemical energy into mechanical motion.",
        icon: "Activity",
        color: "text-blue-400"
      },
      {
        title: "Crankshaft",
        content: "Converts the reciprocating (up and down) motion of the pistons into rotational motion to drive the wheels.",
        icon: "Zap",
        color: "text-stone-400"
      }
    ],
    math: {
      title: "Compression Ratio",
      intro: "Efficiency metric:",
      formula: "CR = (Vd + Vc) / Vc",
      variables: [
        { symbol: "Vd", definition: "Displacement volume" },
        { symbol: "Vc", definition: "Clearance volume" }
      ]
    },
    conclusion: {
      title: "Modern Mobility",
      content: "Despite the rise of EVs, the internal combustion engine remains a marvel of mechanical engineering.",
      highlight: "30-40%",
      highlightNote: "Thermal Efficiency"
    },
    modules: [
      { 
        title: 'The 4-Stroke Dynamics', 
        desc: 'Thermodynamic cycle analysis (Otto cycle) and piston kinematics.', 
        completed: false,
        objectives: ['Understand strokes.', 'Identify valves.'],
        interactiveLabel: 'Engine Animation',
        interactiveType: 'simulation',
        simulationId: 'virtual-lab',
        quiz: { question: 'Ignition stroke?', options: ['Intake', 'Compression', 'Power', 'Exhaust'], correctAnswer: 2 },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the The 4-Stroke Dynamics module?",
                  "options": [
                    "Practical analysis and simulation of The 4-Stroke Dynamics",
                    "Historical context of The 4-Stroke Dynamics",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Thermodynamic cycle analysis (Otto cycle) and pist...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Engine Animation' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Engine Animation' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring The 4-Stroke Dynamics, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the The 4-Stroke Dynamics module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: 'Valvetrain Timing Hub',
        desc: 'Dynamic coordination of cams, lifters, and valve clearance profiles.',
        completed: false,
        objectives: ['Understand timing belts.', 'Analyze valve overlap.'],
        interactiveLabel: 'Modify Timing',
        interactiveType: 'calculator',
        quiz: {
          question: 'What component controls the opening and closing of valves?',
          options: ['Piston', 'Crankshaft', 'Camshaft', 'Flywheel'],
          correctAnswer: 2
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Valvetrain Timing Hub module?",
                  "options": [
                    "Practical analysis and simulation of Valvetrain Timing Hub",
                    "Historical context of Valvetrain Timing Hub",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Dynamic coordination of cams, lifters, and valve c...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Modify Timing' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Modify Timing' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Valvetrain Timing Hub, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Valvetrain Timing Hub module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },
  Microscope: {
    title: 'Microscopy',
    subtitle: 'Scientific Instrumentation',
    intro: 'Learn the principles of optical microscopy. Microscopes allow us to explore the invisible world of cells and bacteria.',
    category: 'Equipment',
    difficulty: 'Beginner',
    duration: '15 min',
    iconName: 'Wrench',
    color: 'slate',
    sections: [
      {
        title: "Magnification",
        content: "The process of enlarging the appearance of an object. Total magnification is the product of the objective and eyepiece lenses.",
        icon: "Eye",
        color: "text-cyan-400"
      },
      {
        title: "Resolution",
        content: "The ability to distinguish two close points as separate. It is limited by the wavelength of light.",
        icon: "Target",
        color: "text-indigo-400"
      }
    ],
    math: {
      title: "Abbe Limit",
      intro: "Diffraction limit:",
      formula: "d = λ / (2 NA)",
      variables: [
        { symbol: "λ", definition: "Wavelength" },
        { symbol: "NA", definition: "Numerical Aperture" }
      ]
    },
    conclusion: {
      title: "Discovery Tool",
      content: "From Pasteur to modern pathology, the microscope is the primary tool of biological discovery.",
      highlight: "200 nm",
      highlightNote: "Optical Limit"
    },
    modules: [
      { 
        title: 'Ray Optics Simulator', 
        desc: 'Refractive index analysis and numerical aperture (NA) optimization.', 
        completed: false,
        objectives: ['Understand magnification.', 'Define resolution.'],
        interactiveLabel: 'Focus Beam',
        interactiveType: 'simulation',
        simulationId: 'virtual-lab',
        quiz: { question: 'What determines detail?', options: ['Magnification', 'Resolution', 'Brightness', 'Weight'], correctAnswer: 1 },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Ray Optics Simulator module?",
                  "options": [
                    "Practical analysis and simulation of Ray Optics Simulator",
                    "Historical context of Ray Optics Simulator",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Refractive index analysis and numerical aperture (...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Focus Beam' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Focus Beam' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Ray Optics Simulator, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Ray Optics Simulator module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: 'Phase Contrast Viewer',
        desc: 'Interferometry and sample staining for high-contrast cellular imaging.',
        completed: false,
        objectives: ['Understand thin sectioning.', 'Identify dyes for contrast.'],
        interactiveLabel: 'Stain Sample',
        interactiveType: '3d-viewer',
        quiz: {
          question: 'Why are cells often stained before viewing?',
          options: ['To kill them', 'To preserve them', 'To increase contrast', 'To change their size'],
          correctAnswer: 2
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Phase Contrast Viewer module?",
                  "options": [
                    "Practical analysis and simulation of Phase Contrast Viewer",
                    "Historical context of Phase Contrast Viewer",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Interferometry and sample staining for high-contra...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Stain Sample' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Stain Sample' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Phase Contrast Viewer, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Phase Contrast Viewer module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },
  Drone: {
    title: 'Advanced Aerial Robotics',
    subtitle: 'Flight Dynamics & Control Theory',
    intro: "The Advanced Aerial Robotics module provides a rigorous exploration of quadcopter dynamics, control theory, and navigation. This course covers the physics of flight, PID control algorithms for stabilization, and the principles of inertial navigation. Students will gain deep insight into how drones achieve autonomous flight and precision maneuvering in complex environments.",
    category: 'Equipment',
    difficulty: 'Intermediate',
    duration: '20 min',
    iconName: 'Wrench',
    color: 'slate',
    sections: [
      {
        title: "Flight Dynamics",
        content: "Quadcopter flight is governed by the differential control of rotor speeds. By manipulating the torque and thrust of each motor, the drone achieves pitch, roll, and yaw through complex Euler angle transformations.",
        icon: "Rocket",
        color: "text-emerald-400"
      },
      {
        title: "Control Theory (PID)",
        content: "Stability is maintained by PID (Proportional-Integral-Derivative) control loops. These algorithms continuously calculate the error between the desired state and the actual state, applying corrective thrust at high frequencies.",
        icon: "Cpu",
        color: "text-blue-400"
      },
      {
        title: "Navigation & SLAM",
        content: "Autonomous navigation relies on SLAM (Simultaneous Localization and Mapping) and sensor fusion, integrating data from IMUs, GPS, and optical flow sensors to map environments in real-time.",
        icon: "Target",
        color: "text-rose-400"
      }
    ],
    math: {
      title: "PID Control Equation",
      intro: "The corrective output of a PID controller is defined by:",
      formula: "u(t) = Kpe(t) + Ki∫e(t)dt + Kdde/dt",
      variables: [
        { symbol: "u(t)", definition: "Control output" },
        { symbol: "e(t)", definition: "Error signal" },
        { symbol: "Kp, Ki, Kd", definition: "Proportional, Integral, Derivative gains" }
      ]
    },
    conclusion: {
      title: "Autonomous Systems",
      content: "Drones are the testbed for modern autonomous systems, integrating advanced robotics, AI, and sensor fusion to operate in dynamic, unstructured environments.",
      highlight: "1000 Hz",
      highlightNote: "Typical PID loop frequency"
    },
    modules: [
      { 
        title: 'PID Control Laboratory', 
        desc: 'Real-time tuning of P, I, and D parameters for vertical stability and gust rejection.', 
        completed: true,
        objectives: ['Understand PID gain tuning.', 'Analyze attitude stabilization.'],
        interactiveLabel: 'Tune Gains',
        interactiveType: 'simulation',
        simulationId: 'aerodynamics',
        quiz: {
          question: 'What does the Derivative (D) term in PID control do?',
          options: ['Eliminates steady-state error', 'Predicts future error to dampen oscillations', 'Corrects current error', 'Increases overall speed'],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the PID Control Laboratory module?",
                  "options": [
                    "Practical analysis and simulation of PID Control Laboratory",
                    "Historical context of PID Control Laboratory",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Real-time tuning of P, I, and D parameters for ver...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Tune Gains' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Tune Gains' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring PID Control Laboratory, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the PID Control Laboratory module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      { 
        title: 'SLAM & Path Planning', 
        desc: 'Autonomous obstacle avoidance and path discretization in 3D space.', 
        completed: false,
        objectives: ['Understand sensor noise.', 'Apply Kalman filtering principles.'],
        interactiveLabel: 'Run Path Solver',
        interactiveType: 'calculator',
        quiz: {
          question: 'What is the primary purpose of a Kalman filter in drone navigation?',
          options: ['Increase motor speed', 'Estimate state from noisy sensor data', 'Reduce battery consumption', 'Improve camera resolution'],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the SLAM & Path Planning module?",
                  "options": [
                    "Practical analysis and simulation of SLAM & Path Planning",
                    "Historical context of SLAM & Path Planning",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Autonomous obstacle avoidance and path discretizat...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Run Path Solver' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Run Path Solver' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring SLAM & Path Planning, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the SLAM & Path Planning module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },
  Pyramid: {
    title: 'The Great Pyramid',
    subtitle: 'Ancient Engineering',
    intro: 'Analyze the construction of the Great Pyramid of Giza. Built 4,500 years ago, it remains a testament to human ingenuity.',
    category: 'History',
    difficulty: 'Intermediate',
    duration: '20 min',
    iconName: 'Landmark',
    color: 'yellow',
    sections: [
      {
        title: "Construction",
        content: "Built with over 2 million limestone blocks, each weighing tons. The precision of the joints is remarkable.",
        icon: "Box",
        color: "text-yellow-400"
      },
      {
        title: "Alignment",
        content: "The pyramid is aligned to true north with an accuracy of 3/60th of a degree, better than many modern buildings.",
        icon: "Globe",
        color: "text-orange-400"
      }
    ],
    math: {
      title: "Golden Ratio",
      intro: "Geometric proportions:",
      formula: "φ ≈ 1.618",
      variables: [
        { symbol: "φ", definition: "Phi" }
      ]
    },
    conclusion: {
      title: "World Wonder",
      content: "It is the only surviving member of the Seven Wonders of the Ancient World.",
      highlight: "146.6 m",
      highlightNote: "Original Height"
    },
    modules: [
      { 
        title: 'Internal Architecture', 
        desc: 'Chambers.', 
        completed: false,
        objectives: ['Identify chambers.', 'Grand Gallery.'],
        interactiveLabel: 'Reveal Internal Chambers',
        quiz: { question: 'Highest chamber?', options: ['Queen\'s', 'King\'s', 'Subterranean', 'Gallery'], correctAnswer: 1 },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Internal Architecture module?",
                  "options": [
                    "Practical analysis and simulation of Internal Architecture",
                    "Historical context of Internal Architecture",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Chambers.\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Reveal Internal Chambers' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Reveal Internal Chambers' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Internal Architecture, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Internal Architecture module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: 'Alignment and Precision',
        desc: 'Celestial navigation.',
        completed: false,
        objectives: ['Analyze cardinal alignment.', 'Identify star tracking shafts.'],
        interactiveLabel: 'Align with North Star',
        quiz: {
          question: 'The Pyramids are aligned with extreme precision to:',
          options: ['Magnetic North', 'True North', 'The Moon', 'The Sun'],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Alignment and Precision module?",
                  "options": [
                    "Practical analysis and simulation of Alignment and Precision",
                    "Historical context of Alignment and Precision",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Celestial navigation.\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Align with North Star' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Align with North Star' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Alignment and Precision, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Alignment and Precision module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: 'Load-Relieving Chambers',
        desc: 'Structural safety.',
        completed: false,
        objectives: ['Understand granite beam spanning.', 'Analyze weight diversion.'],
        interactiveLabel: 'Display Load Vectors',
        quiz: {
          question: 'What protects the King\'s Chamber from the weight above it?',
          options: ['Wooden beams', 'Relieving chambers', 'Solid gold pillars', 'Sand filling'],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Load-Relieving Chambers module?",
                  "options": [
                    "Practical analysis and simulation of Load-Relieving Chambers",
                    "Historical context of Load-Relieving Chambers",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Structural safety.\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Display Load Vectors' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Display Load Vectors' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Load-Relieving Chambers, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Load-Relieving Chambers module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },
  Display: {
    title: 'LCD Technology',
    subtitle: 'Liquid Crystal Display Engineering',
    intro: "The LCD Technology module provides an exhaustive technical analysis of liquid crystal behavior and active-matrix addressing. Students will explore the molecular physics of nematic liquid crystals, the role of cross-polarizers in light modulation, and the integration of Thin-Film Transistors (TFT) for precise pixel control. This course emphasizes the transition from passive to active matrix displays and the latest advancements in high-dynamic-range (HDR) backlighting.",
    category: 'Engineering',
    difficulty: 'Intermediate',
    duration: '20 min',
    iconName: 'Monitor',
    color: 'blue',
    sections: [
      {
        title: "Nematic Phase Physics",
        content: "Liquid crystals exist in a state between solid and liquid. In the nematic phase, molecules have long-range directional order but no positional order. Applying an electric field realigns these molecules, changing the optical properties of the layer.",
        icon: "Activity",
        color: "text-blue-400"
      },
      {
        title: "TFT Active Matrix",
        content: "Each pixel is controlled by its own Thin-Film Transistor, allowing for faster response times and higher contrast compared to passive matrix displays. This 'Active Matrix' technology is what enables modern high-resolution screens.",
        icon: "Cpu",
        color: "text-amber-400"
      }
    ],
    math: {
      title: "Malus's Law",
      intro: "Intensity of light passing through a polarizer:",
      formula: "I = I₀ cos²(θ)",
      variables: [
        { symbol: "I", definition: "Transmitted intensity" },
        { symbol: "I0", definition: "Initial intensity" },
        { symbol: "θ", definition: "Angle between polarizers" }
      ]
    },
    conclusion: {
      title: "Photonic Modulation",
      content: "LCDs are non-emissive displays; they act as light valves. The efficiency of the backlight and the precision of the liquid crystal shutter determine the overall display quality.",
      highlight: "99.9% Polarized",
      highlightNote: "Efficiency of modern polarizers"
    },
    modules: [
      { 
        title: 'Nematic Phase Viewer', 
        desc: 'Light modulation via molecular rotation and cross-polarizers.', 
        completed: false,
        objectives: ['Understand linear polarization.', 'Analyze the effect of LC rotation.'],
        interactiveLabel: 'Polarizer Sim',
        interactiveType: 'simulation',
        simulationId: 'virtual-lab',
        quiz: { 
          question: 'What happens when two polarizers are aligned at 90 degrees to each other?', 
          options: ['Maximum light passes', 'No light passes', 'Light color changes', 'Light intensity doubles'], 
          correctAnswer: 1 
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Nematic Phase Viewer module?",
                  "options": [
                    "Practical analysis and simulation of Nematic Phase Viewer",
                    "Historical context of Nematic Phase Viewer",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Light modulation via molecular rotation and cross-...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Polarizer Sim' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Polarizer Sim' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Nematic Phase Viewer, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Nematic Phase Viewer module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      { 
        title: 'TFT Matrix Dynamics', 
        desc: 'Transistor-level pixel control and active matrix refresh logic.', 
        completed: false,
        objectives: ['Identify source, gate, and drain in a TFT.', 'Understand the storage capacitor role.'],
        interactiveLabel: '3D TFT View',
        interactiveType: '3d-viewer',
        quiz: { 
          question: 'What is the primary advantage of Active Matrix (TFT) over Passive Matrix?', 
          options: ['Lower cost', 'Higher resolution and faster response', 'Simpler manufacturing', 'No need for backlight'], 
          correctAnswer: 1 
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the TFT Matrix Dynamics module?",
                  "options": [
                    "Practical analysis and simulation of TFT Matrix Dynamics",
                    "Historical context of TFT Matrix Dynamics",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Transistor-level pixel control and active matrix r...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the '3D TFT View' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like '3D TFT View' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring TFT Matrix Dynamics, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the TFT Matrix Dynamics module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },
  // Adding missing topics
  Globe: {
    title: 'Earth Dynamics',
    subtitle: 'Our Living Planet',
    intro: 'Explore the complex systems that make Earth a unique and habitable planet. From plate tectonics to atmospheric circulation, understand the forces shaping our world.',
    category: 'Geography',
    difficulty: 'Beginner',
    duration: '20 min',
    iconName: 'Globe',
    color: 'blue',
    sections: [
      {
        title: "Plate Tectonics",
        content: "The Earth's crust is divided into several large plates that move slowly over the mantle, causing earthquakes, volcanoes, and mountain building.",
        icon: "Globe",
        color: "text-blue-400"
      },
      {
        title: "Atmospheric Layers",
        content: "The atmosphere is composed of several layers, each with distinct properties. The troposphere is where weather occurs, while the stratosphere contains the ozone layer.",
        icon: "Layers",
        color: "text-cyan-400"
      }
    ],
    math: {
      title: "Coriolis Effect",
      intro: "Deflection of moving objects:",
      formula: "Fc = 2m(v × ω)",
      variables: [
        { symbol: "Fc", definition: "Coriolis force" },
        { symbol: "m", definition: "Mass" },
        { symbol: "v", definition: "Velocity" },
        { symbol: "ω", definition: "Angular velocity" }
      ]
    },
    conclusion: {
      title: "Interconnected Systems",
      content: "Earth is a system of interconnected parts. Changes in one part can have profound effects on the entire planet.",
      highlight: "Dynamic Equilibrium",
      highlightNote: "Earth's constant state of change"
    },
    modules: [
      { 
        title: 'Tectonic Dynamics', 
        desc: 'Simulating subduction zones and mantle convection currents.', 
        completed: false,
        objectives: ['Identify Earth\'s internal layers.', 'Understand plate boundaries.'],
        interactiveLabel: 'Earthquake Sim',
        interactiveType: 'simulation',
        simulationId: 'plasma',
        quiz: { question: 'Which layer is the thinnest?', options: ['Crust', 'Mantle', 'Outer Core', 'Inner Core'], correctAnswer: 0 },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Tectonic Dynamics module?",
                  "options": [
                    "Practical analysis and simulation of Tectonic Dynamics",
                    "Historical context of Tectonic Dynamics",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Simulating subduction zones and mantle convection ...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Earthquake Sim' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Earthquake Sim' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Tectonic Dynamics, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Tectonic Dynamics module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: 'Global Circulation',
        desc: 'Analysis of Coriolis deflection and Hadley cell heat transport.',
        completed: false,
        objectives: ['Analyze global winds.', 'Understand oceanic currents.'],
        interactiveLabel: 'Weather 3D',
        interactiveType: '3d-viewer',
        quiz: {
          question: 'The Coriolis effect causes winds to deflect to the _______ in the Northern Hemisphere.',
          options: ['Left', 'Right', 'Up', 'Down'],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Global Circulation module?",
                  "options": [
                    "Practical analysis and simulation of Global Circulation",
                    "Historical context of Global Circulation",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Analysis of Coriolis deflection and Hadley cell he...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Weather 3D' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Weather 3D' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Global Circulation, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Global Circulation module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },
  CrystalLattice: {
    title: 'Crystallography',
    subtitle: 'Atomic Order',
    intro: 'Investigate the highly ordered arrangement of atoms in crystalline solids. Learn about unit cells, lattice systems, and how atomic structure determines material properties.',
    category: 'Science',
    difficulty: 'Advanced',
    duration: '25 min',
    iconName: 'Shapes',
    color: 'cyan',
    sections: [
      {
        title: "Unit Cells",
        content: "The smallest repeating unit of a crystal lattice that shows the full symmetry of the crystal structure.",
        icon: "Grid",
        color: "text-purple-400"
      },
      {
        title: "Bravais Lattices",
        content: "There are 14 unique ways to arrange points in 3D space such that each point has identical surroundings.",
        icon: "Layers",
        color: "text-pink-400"
      }
    ],
    math: {
      title: "Bragg's Law",
      intro: "X-ray diffraction condition:",
      formula: "nλ = 2d sin(θ)",
      variables: [
        { symbol: "n", definition: "Order of reflection" },
        { symbol: "λ", definition: "Wavelength" },
        { symbol: "d", definition: "Interplanar spacing" },
        { symbol: "θ", definition: "Diffraction angle" }
      ]
    },
    conclusion: {
      title: "Material Science",
      content: "Crystallography is essential for understanding the properties of metals, semiconductors, and pharmaceuticals.",
      highlight: "Symmetry",
      highlightNote: "The hallmark of crystals"
    },
    modules: [
      { 
        title: 'Bravais Lattice Viewer', 
        desc: '3D navigation through Miller indices and atomic stacking sequences.', 
        completed: false,
        objectives: ['Identify the 7 crystal systems.', 'Calculate atomic packing factor.'],
        interactiveLabel: '3D Lattice View',
        interactiveType: '3d-viewer',
        quiz: { question: 'How many crystal systems are there?', options: ['5', '7', '14', '32'], correctAnswer: 1 },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Bravais Lattice Viewer module?",
                  "options": [
                    "Practical analysis and simulation of Bravais Lattice Viewer",
                    "Historical context of Bravais Lattice Viewer",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"3D navigation through Miller indices and atomic st...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the '3D Lattice View' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like '3D Lattice View' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Bravais Lattice Viewer, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Bravais Lattice Viewer module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: 'X-Ray Diffraction Lab',
        desc: 'Simulation of Bragg scattering and lattice plane interference patterns.',
        completed: false,
        objectives: ['Identify (hkl) notation.', 'Visualize lattice planes.'],
        interactiveLabel: 'Bragg Diffraction',
        interactiveType: 'simulation',
        simulationId: 'plasma',
        quiz: {
          question: 'Miller indices are used to describe:',
          options: ['Atom size', 'Crystal planes and directions', 'Inter-atomic bonding', 'Temperature'],
          correctAnswer: 1
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the X-Ray Diffraction Lab module?",
                  "options": [
                    "Practical analysis and simulation of X-Ray Diffraction Lab",
                    "Historical context of X-Ray Diffraction Lab",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Simulation of Bragg scattering and lattice plane i...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Bragg Diffraction' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Bragg Diffraction' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring X-Ray Diffraction Lab, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the X-Ray Diffraction Lab module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },
  FingerprintSensor: {
    title: 'Biometric Security',
    subtitle: 'Fingerprint Recognition',
    intro: 'Explore the technology behind fingerprint sensors. Learn about capacitive, optical, and ultrasonic sensing methods and how they convert unique ridges into digital data.',
    sections: [
      {
        title: "Capacitive Sensing",
        content: "Uses tiny capacitors to measure the electrical difference between the ridges and valleys of a fingerprint.",
        icon: "Zap",
        color: "text-yellow-400"
      },
      {
        title: "Minutiae Extraction",
        content: "Algorithms identify unique points like ridge endings and bifurcations to create a digital template.",
        icon: "Target",
        color: "text-red-400"
      }
    ],
    math: {
      title: "False Acceptance Rate",
      intro: "Security metric:",
      formula: "FAR = (False Positives) / (Total Attempts)",
      variables: [
        { symbol: "FAR", definition: "Probability of unauthorized access" }
      ]
    },
    conclusion: {
      title: "Identity Verification",
      content: "Biometrics provide a convenient and secure way to verify identity, but they also raise important privacy concerns.",
      highlight: "Unique Ridges",
      highlightNote: "No two fingerprints are identical"
    },
    modules: [
      { 
        title: 'Biometric Algorithm Lab', 
        desc: 'Simulation of capacitive and ultrasonic minutiae extraction.', 
        completed: false,
        objectives: ['Compare different sensor types.', 'Understand image capture.'],
        interactiveLabel: 'Extract Minutiae',
        interactiveType: 'simulation',
        simulationId: 'virtual-lab',
        quiz: { question: 'Which sensor uses sound waves?', options: ['Optical', 'Capacitive', 'Ultrasonic', 'Thermal'], correctAnswer: 2 },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Biometric Algorithm Lab module?",
                  "options": [
                    "Practical analysis and simulation of Biometric Algorithm Lab",
                    "Historical context of Biometric Algorithm Lab",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Simulation of capacitive and ultrasonic minutiae e...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Extract Minutiae' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Extract Minutiae' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Biometric Algorithm Lab, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Biometric Algorithm Lab module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      {
        title: 'Ridge Topology View',
        desc: '3D analysis of whorl, loop, and arch bifurcations.',
        completed: false,
        objectives: ['Differentiate global patterns.', 'Identify minutiae points.'],
        interactiveLabel: '3D Mesh View',
        interactiveType: '3d-viewer',
        quiz: {
          question: 'Which of the following is NOT a standard fingerprint pattern?',
          options: ['Loop', 'Whorl', 'Arch', 'Square'],
          correctAnswer: 3
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Ridge Topology View module?",
                  "options": [
                    "Practical analysis and simulation of Ridge Topology View",
                    "Historical context of Ridge Topology View",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"3D analysis of whorl, loop, and arch bifurcations.\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the '3D Mesh View' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like '3D Mesh View' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Ridge Topology View, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Ridge Topology View module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  },

  Plasma: {
    title: 'Plasma Physics',
    subtitle: 'The Fourth State of Matter',
    intro: 'Explore the fascinating world of plasma, the fourth state of matter. Learn how ionization creates plasma and how it behaves in electromagnetic fields.',
    sections: [
      {
        title: "Ionization Processes",
        content: "Plasma is created when a gas is ionized, stripping electrons from atoms. We explore the energy required for this transition and the resulting conductive properties.",
        icon: "Zap",
        color: "text-purple-400"
      },
      {
        title: "Plasma Dynamics",
        content: "Charged particles in plasma respond strongly to electromagnetic fields. This behavior is fundamental to plasma containment in fusion reactors and the operation of plasma displays.",
        icon: "Activity",
        color: "text-blue-400"
      }
    ],
    modules: [
      { 
        title: 'Ionization Laboratory', 
        desc: 'Stochastic simulation of gas-to-plasma phase transitions.', 
        completed: false,
        objectives: ['Define plasma.', 'Understand ionization energy.'],
        interactiveLabel: 'Run Ionizer',
        interactiveType: 'simulation',
        simulationId: 'plasma',
        quiz: {
          question: 'What is the fourth state of matter?',
          options: ['Solid', 'Liquid', 'Gas', 'Plasma'],
          correctAnswer: 3
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Ionization Laboratory module?",
                  "options": [
                    "Practical analysis and simulation of Ionization Laboratory",
                    "Historical context of Ionization Laboratory",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Stochastic simulation of gas-to-plasma phase trans...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Run Ionizer' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Run Ionizer' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Ionization Laboratory, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Ionization Laboratory module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    },
      { 
        title: 'Magnetohydrodynamics', 
        desc: 'Lorenz force and magnetic bottle containment simulator.', 
        completed: false,
        objectives: ['Analyze particle motion in EM fields.', 'Understand plasma containment.'],
        interactiveLabel: 'Bottle Simulator',
        interactiveType: 'simulation',
        simulationId: 'virtual-lab',
        quiz: {
          question: 'What force acts on a charged particle moving in a magnetic field?',
          options: ['Lorentz Force', 'Gravity', 'Strong Force', 'Friction'],
          correctAnswer: 0
        },
          vivaQuestions: [
                {
                  "question": "What is the primary thematic focus of the Magnetohydrodynamics module?",
                  "options": [
                    "Practical analysis and simulation of Magnetohydrodynamics",
                    "Historical context of Magnetohydrodynamics",
                    "General overview of introductory scientific concepts",
                    "Reviewing unassociated classical theories"
                  ],
                  "correctAnswer": 0,
                  "explanation": "The module primarily focuses on practical application and critical analysis through its related interactive components."
                },
                {
                  "question": "Which outcome best aligns with the goal described as: \"Lorenz force and magnetic bottle containment simul...\"?",
                  "options": [
                    "Mastering the precise mechanisms and properties stated within the module.",
                    "Standardized testing methodologies.",
                    "Abstract philosophy disconnected from scientific practice.",
                    "Basic linear algebra and calculus computations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "The description specifically introduces complex mechanics and parameters that the learner must understand."
                },
                {
                  "question": "How best can a student utilize the 'Bottle Simulator' tool for learning?",
                  "options": [
                    "By treating it as an experimental sandbox to observe causal relationships.",
                    "By ignoring it to focus solely on the written text.",
                    "By passively watching the animations without interacting.",
                    "By using it as a simple visual calculator."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive elements like 'Bottle Simulator' empower students to observe cause and effect dynamically, reinforcing theoretical knowledge."
                },
                {
                  "question": "In exploring Magnetohydrodynamics, why is an interactive approach highly valuable?",
                  "options": [
                    "It allows for safe, dynamic exploration of complex, microscopic, or macroscopic scenarios.",
                    "It simplifies the concepts to an elementary level.",
                    "It provides the final answers without requiring the student to perform calculations.",
                    "It focuses solely on the entertainment value rather than education."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Interactive simulations provide a safe, accessible way to experiment with advanced or otherwise inaccessible physical concepts."
                },
                {
                  "question": "What critical analytical skill is primarily developed through the Magnetohydrodynamics module?",
                  "options": [
                    "Hypothesis testing and parameter analysis via the interactive elements.",
                    "Rote memorization and reading comprehension.",
                    "Speed-reading technical documentation.",
                    "Execution of basic arithmetic operations."
                  ],
                  "correctAnswer": 0,
                  "explanation": "Active engagement with the module's parameters and simulations fosters a deep capability for hypothesis testing and analysis."
                }
              ]
    }
    ]
  }
};
