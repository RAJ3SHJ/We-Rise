
import { Mentor, Course, CourseLevel, CourseStatus } from '../types';

export const MOCK_MENTORS: Mentor[] = [
  { id: '1', name: 'Priya Sharma', role: 'Principal PO @ FinTech Hub', expertise: ['Stakeholder Management', 'Visioning'], avatar: 'https://i.pravatar.cc/150?u=priya' },
  { id: '2', name: 'Arjun Mehta', role: 'Senior PM @ SaaS Collective', expertise: ['Technical Backlogs', 'Jira Mastery'], avatar: 'https://i.pravatar.cc/150?u=arjun' },
  { id: '3', name: 'Ananya Iyer', role: 'Product Strategy Lead', expertise: ['Market Analysis', 'Growth Hacking'], avatar: 'https://i.pravatar.cc/150?u=ananya' }
];

export const DEFAULT_COURSES: Course[] = [
  {
    id: 'sql-1',
    title: 'SQL Tutorial for Beginners',
    source: 'YouTube',
    url: 'https://youtu.be/v8i2NgiM5pE?si=ZXHct0Cg3ZjPNfgp',
    level: CourseLevel.BASIC,
    category: 'SQL',
    durationHours: 4,
    status: CourseStatus.NOT_STARTED,
    progress: 0,
    description: 'A comprehensive SQL tutorial for beginners covering all the basics.'
  },
  {
    id: 'sql-2',
    title: 'SQL for Data Science',
    source: 'YouTube',
    url: 'https://www.youtube.com/watch?v=DX8I5SmB6jo&t=1909s',
    level: CourseLevel.INTERMEDIATE,
    category: 'SQL',
    durationHours: 6,
    status: CourseStatus.NOT_STARTED,
    progress: 0,
    description: 'Learn SQL specifically for data science applications.'
  },
  {
    id: 'sql-3',
    title: 'Advanced SQL Queries',
    source: 'YouTube',
    url: 'https://www.youtube.com/watch?v=BxAj3bl00-o',
    level: CourseLevel.ADVANCED,
    category: 'SQL',
    durationHours: 3,
    status: CourseStatus.NOT_STARTED,
    progress: 0,
    description: 'Master complex SQL queries and optimization.'
  },
  {
    id: 'sql-4',
    title: 'SQL Database Design',
    source: 'YouTube',
    url: 'https://www.youtube.com/watch?v=n17RCiV5xpA',
    level: CourseLevel.INTERMEDIATE,
    category: 'SQL',
    durationHours: 5,
    status: CourseStatus.NOT_STARTED,
    progress: 0,
    description: 'Principles of relational database design and normalization.'
  },
  {
    id: 'sql-5',
    title: 'SQL Performance Tuning',
    source: 'YouTube',
    url: 'https://www.youtube.com/watch?v=tvBp81WVrCA',
    level: CourseLevel.ADVANCED,
    category: 'SQL',
    durationHours: 2,
    status: CourseStatus.NOT_STARTED,
    progress: 0,
    description: 'Learn how to make your SQL queries run faster.'
  },
  {
    id: 'sql-6',
    title: 'SQL for Business Analysts',
    source: 'YouTube',
    url: 'https://www.youtube.com/watch?v=OdnxoJitdAg',
    level: CourseLevel.BASIC,
    category: 'SQL',
    durationHours: 3,
    status: CourseStatus.NOT_STARTED,
    progress: 0,
    description: 'SQL skills tailored for business analysis and reporting.'
  },
  {
    id: 'api-1',
    title: 'What is an API?',
    source: 'YouTube',
    url: 'https://www.youtube.com/watch?v=bg3ryd2BHZk',
    level: CourseLevel.BASIC,
    category: 'APIs',
    durationHours: 1,
    status: CourseStatus.NOT_STARTED,
    progress: 0,
    description: 'A simple explanation of what APIs are and how they work.'
  },
  {
    id: 'api-2',
    title: 'REST API Tutorial',
    source: 'YouTube',
    url: 'https://www.youtube.com/watch?v=gXl_kcat_SU',
    level: CourseLevel.BASIC,
    category: 'APIs',
    durationHours: 2,
    status: CourseStatus.NOT_STARTED,
    progress: 0,
    description: 'Introduction to RESTful APIs and best practices.'
  },
  {
    id: 'api-3',
    title: 'API Design Best Practices',
    source: 'YouTube',
    url: 'https://www.youtube.com/watch?v=zb-WLrNCcT0',
    level: CourseLevel.INTERMEDIATE,
    category: 'APIs',
    durationHours: 3,
    status: CourseStatus.NOT_STARTED,
    progress: 0,
    description: 'Learn how to design robust and scalable APIs.'
  },
  {
    id: 'api-4',
    title: 'Postman for API Testing',
    source: 'YouTube',
    url: 'https://www.youtube.com/watch?v=4vLxWqE94l4',
    level: CourseLevel.BASIC,
    category: 'APIs',
    durationHours: 2,
    status: CourseStatus.NOT_STARTED,
    progress: 0,
    description: 'How to use Postman for testing and documenting APIs.'
  },
  {
    id: 'api-5',
    title: 'API Security Fundamentals',
    source: 'YouTube',
    url: 'https://www.youtube.com/watch?v=pBASqUbZgkY',
    level: CourseLevel.ADVANCED,
    category: 'APIs',
    durationHours: 4,
    status: CourseStatus.NOT_STARTED,
    progress: 0,
    description: 'Essential security concepts for protecting your APIs.'
  }
];
