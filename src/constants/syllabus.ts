import { Atom, Dna, Orbit, Zap, FlaskConical, Heart, Wrench, Car, Factory, Binary, Shapes, Landmark, Library, Cpu, Brain, CircleDot, Globe, Cog, Bug } from 'lucide-react';

export const SYLLABUS_DATA = {
  Atom: {
    id: 'Atom',
    title: 'Quantum Atomic Structure',
    description: 'Explore the fundamental building blocks of matter through a quantum mechanical lens.',
    aiOverview: 'The Quantum Atomic Structure module provides a comprehensive analysis of subatomic realms. By utilizing high-fidelity holographic projections, students can visualize the probabilistic nature of electron clouds, moving beyond the simplified Bohr model. This course emphasizes the role of quantum numbers and the Pauli exclusion principle in determining atomic behavior and chemical reactivity, providing a deep understanding of the fundamental building blocks of matter.',
    category: 'Science',
    difficulty: 'Beginner',
    duration: '15 min',
    icon: 'Atom',
    color: 'cyan',
    modules: [
      { 
        title: 'The Nucleus', 
        desc: 'Protons, neutrons, and strong nuclear forces.', 
        completed: true,
        objectives: ['Identify the components of an atomic nucleus.', 'Understand the role of the strong nuclear force.'],
        interactiveLabel: 'Highlight Nucleus Core',
        quiz: {
          question: 'Which force holds the protons and neutrons together in the nucleus?',
          options: ['Electromagnetic Force', 'Gravity', 'Strong Nuclear Force', 'Weak Nuclear Force'],
          correctAnswer: 2
        }
      },
      { 
        title: 'Electron Shells', 
        desc: 'Probability clouds and quantum numbers.', 
        completed: false,
        objectives: ['Visualize electron probability clouds.', 'Define principal quantum numbers.'],
        interactiveLabel: 'Simulate Electron Orbitals',
        quiz: {
          question: 'What does the principal quantum number (n) indicate?',
          options: ['Spin direction', 'Energy level and distance from nucleus', 'Orbital shape', 'Magnetic orientation'],
          correctAnswer: 1
        }
      },
      { 
        title: 'Valence Electrons', 
        desc: 'Chemical bonding and reactivity.', 
        completed: false,
        objectives: ['Determine valence electrons from atomic structure.', 'Predict chemical reactivity.'],
        interactiveLabel: 'Show Valence Shell',
        quiz: {
          question: 'Which electrons are primarily involved in chemical bonding?',
          options: ['Core electrons', 'Valence electrons', 'Free electrons', 'Neutrons'],
          correctAnswer: 1
        }
      },
      { 
        title: 'Isotopes & Decay', 
        desc: 'Radioactivity and half-life.', 
        completed: false,
        objectives: ['Define isotopes.', 'Understand radioactive decay processes.'],
        interactiveLabel: 'Trigger Isotope Decay',
        quiz: {
          question: 'Isotopes of an element have the same number of protons but a different number of:',
          options: ['Electrons', 'Neutrons', 'Positrons', 'Quarks'],
          correctAnswer: 1
        }
      },
    ]
  },
  AircraftAerodynamics: {
    id: 'AircraftAerodynamics',
    title: 'Advanced Aircraft Aerodynamics',
    description: 'Master the fluid dynamics of modern aerospace vehicles and blended wing body designs.',
    aiOverview: 'The Advanced Aircraft Aerodynamics module provides an exhaustive technical analysis of the fluid dynamics governing modern and future aerospace vehicles. Students will investigate the complex interplay between the Navier-Stokes equations, boundary layer theory, and high-fidelity Computational Fluid Dynamics (CFD). This course emphasizes the transition from classical tube-and-wing architectures to revolutionary Blended Wing Body (BWB) designs, exploring the physics of transonic flow, shockwave management, and aeroelastic stability.',
    category: 'Engineering',
    difficulty: 'Advanced',
    duration: '40 min',
    icon: 'Rocket',
    color: 'blue',
    modules: [
      { 
        title: 'Circulation & Lift', 
        desc: 'The Kutta condition and vortex theory.', 
        completed: false,
        objectives: ['Understand the origin of circulation.', 'Apply the Kutta-Joukowski theorem.'],
        interactiveLabel: 'Visualize Wing Circulation',
        quiz: {
          question: 'What condition must be satisfied at the trailing edge of an airfoil for steady flow?',
          options: ['Bernoulli condition', 'Kutta condition', 'Reynolds condition', 'Mach condition'],
          correctAnswer: 1
        }
      },
      { 
        title: 'Compressibility Effects', 
        desc: 'Shockwaves and wave drag.', 
        completed: false,
        objectives: ['Identify the critical Mach number.', 'Analyze shockwave formation.'],
        interactiveLabel: 'Simulate Supersonic Flow',
        quiz: {
          question: 'What happens to the drag coefficient as an aircraft exceeds its critical Mach number?',
          options: ['It decreases rapidly', 'It remains constant', 'It increases sharply (Drag Divergence)', 'It fluctuates randomly'],
          correctAnswer: 2
        }
      },
      { 
        title: 'BWB Stability & Control', 
        desc: 'Pitching moments and reflex airfoils.', 
        completed: false,
        objectives: ['Understand longitudinal stability in tailless designs.', 'Analyze the role of reflexed trailing edges.'],
        interactiveLabel: 'Test BWB Stability',
        quiz: {
          question: 'How do BWB aircraft typically achieve longitudinal stability without a tail?',
          options: ['Using massive weights in the nose', 'Using reflexed airfoils and wing twist', 'By flying only at low speeds', 'By using oversized engines'],
          correctAnswer: 1
        }
      },
      { 
        title: 'CFD Analysis', 
        desc: 'Grid generation and turbulence modeling.', 
        completed: false,
        objectives: ['Understand the discretization of flow fields.', 'Compare RANS vs. LES models.'],
        interactiveLabel: 'Run CFD Simulation',
        quiz: {
          question: 'In CFD, what does RANS stand for?',
          options: ['Rapid Analysis of Navier-Stokes', 'Reynolds-Averaged Navier-Stokes', 'Randomized Airflow Numerical Simulation', 'Relative Aerodynamic Nodal System'],
          correctAnswer: 1
        }
      }
    ]
  },
  Plasma: {
    id: 'Plasma',
    title: 'Plasma Physics & Holography',
    description: 'Explore the fourth state of matter and its applications in plasma displays and energy.',
    aiOverview: 'The Plasma module explores the fourth state of matter: plasma. Students will investigate the ionization processes that create plasma, the behavior of charged particles in electromagnetic fields, and the practical applications of plasma in energy generation, lighting, and advanced display technologies like plasma balls.',
    category: 'Science',
    difficulty: 'Intermediate',
    duration: '25 min',
    icon: 'Zap',
    color: 'purple',
    modules: [
      { 
        title: 'Ionization Processes', 
        desc: 'Creating plasma from gas.', 
        completed: false,
        objectives: ['Define plasma.', 'Understand ionization energy.'],
        interactiveLabel: 'Ionize Gas',
        quiz: {
          question: 'What is the fourth state of matter?',
          options: ['Solid', 'Liquid', 'Gas', 'Plasma'],
          correctAnswer: 3
        }
      },
      { 
        title: 'Plasma Dynamics', 
        desc: 'Charged particles in fields.', 
        completed: false,
        objectives: ['Analyze particle motion in EM fields.', 'Understand plasma containment.'],
        interactiveLabel: 'Apply Magnetic Field',
        quiz: {
          question: 'What force acts on a charged particle moving in a magnetic field?',
          options: ['Lorentz Force', 'Gravity', 'Strong Force', 'Friction'],
          correctAnswer: 0
        }
      }
    ]
  }
};
