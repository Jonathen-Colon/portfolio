export interface ResumeRow {
  title: string;
  org: string;
  year: string;
  tag?: string;
}

export interface Resume {
  work: ResumeRow[];
  education: ResumeRow[];
  skills: string[];
}

export const resume: Resume = {
  work: [
    { title: 'Independent', org: 'Self', year: '2018–now', tag: 'current' },
    { title: 'Desktop Support Specialist', org: 'People Incorporated', year: '2023–now', tag: 'current' },
    { title: 'Advanced Repair Agent', org: 'Geek Squad', year: '2020–2024'},
    { title: 'Expo/Food Runner', org: 'The Tipsy Seagull', year: '2014-2020' },
  ],
  education: [{ title: 'Associates degree in Computer Science', org: 'Bristol Community College', year: '2019' }],
  skills: [
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'HTML5',
    'CSS',
    'Tailwind CSS',
    'UI Design',
    'Figma',
    'PostgreSQL',
    'Microsoft SQL Server',
    'Git',
    'Linux',
    'Windows',
    'macOS',
    'Active Directory',
    'DNS',
    'Networking',
    'Desktop Support',
    'Hardware Repair',
    'Technical Troubleshooting',
    'Godot',
    'Unity',
    'Aseprite',
    'C/C++',
  ],
};
