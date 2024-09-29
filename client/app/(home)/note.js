const data = [
    {
      type: 'group',
      name: 'ElectroStatics',
      items: [
        {
          type: 'group',
          name: 'Potential',
          items: [
            {
              type: 'notebook',
              name: 'Electric Potential Overview',
              transcript: 'Introduction to electric potential concepts...',
            },
            {
              type: 'group',
              name: 'Potential Energy',
              items: [
                {
                  type: 'notebook',
                  name: 'Gravitational vs Electric Potential Energy',
                  transcript: 'Comparison between gravitational and electric potential energy...',
                },
                {
                  type: 'notebook',
                  name: 'Electrostatic Potential Energy',
                  transcript: 'How electrostatic potential energy is calculated and its applications...',
                },
              ],
            },
          ],
        },
        {
          type: 'notebook',
          name: 'Coulomb’s Law',
          transcript: 'Fundamentals of Coulomb’s Law in electrostatics...',
        },
        {
          type: 'notebook',
          name: 'Electric Fields',
          transcript: 'Understanding electric fields and their properties...',
        },
        {
          type: 'group',
          name: 'Capacitance',
          items: [
            {
              type: 'notebook',
              name: 'Capacitors and Electric Fields',
              transcript: 'The basics of capacitors and their role in electric fields...',
            },
            {
              type: 'notebook',
              name: 'Energy Stored in Capacitors',
              transcript: 'Understanding how energy is stored in capacitors...',
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'Magnetism',
      items: [
        {
          type: 'group',
          name: 'Magnetic Fields',
          items: [
            {
              type: 'notebook',
              name: 'Magnetic Field Theory',
              transcript: 'Detailed explanation of magnetic fields...',
            },
            {
              type: 'notebook',
              name: 'Biot-Savart Law',
              transcript: 'The Biot-Savart law and its significance in magnetism...',
            },
          ],
        },
        {
          type: 'notebook',
          name: 'Electromagnetic Induction',
          transcript: 'Basics of electromagnetic induction...',
        },
        {
          type: 'notebook',
          name: 'Magnetic Flux',
          transcript: 'Understanding the concept of magnetic flux...',
        },
      ],
    },
    {
      type: 'group',
      name: 'Current Electricity',
      items: [
        {
          type: 'notebook',
          name: 'Ohm’s Law',
          transcript: 'Understanding Ohm’s Law and its applications...',
        },
        {
          type: 'group',
          name: 'Circuits',
          items: [
            {
              type: 'notebook',
              name: 'Series Circuits',
              transcript: 'Introduction to series circuits...',
            },
            {
              type: 'notebook',
              name: 'Parallel Circuits',
              transcript: 'Introduction to parallel circuits...',
            },
            {
              type: 'notebook',
              name: 'Kirchhoff’s Laws',
              transcript: 'Understanding Kirchhoff’s Current and Voltage Laws...',
            },
          ],
        },
        {
          type: 'group',
          name: 'Resistivity and Conductivity',
          items: [
            {
              type: 'notebook',
              name: 'Resistivity',
              transcript: 'What is resistivity and how it relates to materials...',
            },
            {
              type: 'notebook',
              name: 'Conductors vs Insulators',
              transcript: 'Difference between conductors and insulators...',
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'Waves and Optics',
      items: [
        {
          type: 'notebook',
          name: 'Wave Properties',
          transcript: 'Introduction to wave properties such as frequency, wavelength, and amplitude...',
        },
        {
          type: 'notebook',
          name: 'Optical Phenomena',
          transcript: 'Various optical phenomena such as reflection, refraction, and diffraction...',
        },
        {
          type: 'group',
          name: 'Wave Interference',
          items: [
            {
              type: 'notebook',
              name: 'Constructive and Destructive Interference',
              transcript: 'How waves interfere with each other...',
            },
            {
              type: 'notebook',
              name: 'Young’s Double Slit Experiment',
              transcript: 'The famous experiment showing wave interference...',
            },
          ],
        },
        {
          type: 'notebook',
          name: 'Doppler Effect',
          transcript: 'Explaining the Doppler Effect and its real-world applications...',
        },
      ],
    },
    {
      type: 'group',
      name: 'Quantum Mechanics',
      items: [
        {
          type: 'notebook',
          name: 'Photoelectric Effect',
          transcript: 'An overview of the photoelectric effect...',
        },
        {
          type: 'notebook',
          name: 'Wave-Particle Duality',
          transcript: 'Understanding the wave-particle duality of light...',
        },
        {
          type: 'group',
          name: 'Quantum Theories',
          items: [
            {
              type: 'notebook',
              name: 'Heisenberg’s Uncertainty Principle',
              transcript: 'Explaining the uncertainty principle...',
            },
            {
              type: 'notebook',
              name: 'Schrodinger’s Equation',
              transcript: 'An introduction to Schrodinger’s equation...',
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'Thermodynamics',
      items: [
        {
          type: 'notebook',
          name: 'Laws of Thermodynamics',
          transcript: 'Overview of the first, second, and third laws of thermodynamics...',
        },
        {
          type: 'notebook',
          name: 'Heat Transfer Mechanisms',
          transcript: 'Conduction, convection, and radiation explained...',
        },
        {
          type: 'group',
          name: 'Entropy',
          items: [
            {
              type: 'notebook',
              name: 'Understanding Entropy',
              transcript: 'What is entropy and its role in thermodynamics...',
            },
            {
              type: 'notebook',
              name: 'Entropy and the Second Law of Thermodynamics',
              transcript: 'How entropy relates to the second law of thermodynamics...',
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'Modern Physics',
      items: [
        {
          type: 'notebook',
          name: 'Relativity Theory',
          transcript: 'Introduction to Einstein’s Theory of Relativity...',
        },
        {
          type: 'notebook',
          name: 'Nuclear Physics',
          transcript: 'Basics of nuclear physics and reactions...',
        },
        {
          type: 'group',
          name: 'Particle Physics',
          items: [
            {
              type: 'notebook',
              name: 'Standard Model of Particle Physics',
              transcript: 'Overview of the Standard Model of Particle Physics...',
            },
            {
              type: 'notebook',
              name: 'Higgs Boson',
              transcript: 'Explaining the significance of the Higgs Boson...',
            },
          ],
        },
      ],
    },
  ];
  
// const data = [ 'apple', 'banana', 'orange' ];   
  
  export default data;