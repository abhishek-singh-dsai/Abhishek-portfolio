import { portfolio } from '@/data/portfolio';

const hasExperience = portfolio.experience.length > 0;

export const experienceHeading = hasExperience ? 'Experience' : 'Education & credentials';

/** Navigation targets, in page order. */
export const sections = [
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: hasExperience ? 'Experience' : 'Background' },
  { id: 'skills', label: 'Skills' },
  { id: 'creative', label: 'Creative' },
  { id: 'contact', label: 'Contact' },
];
