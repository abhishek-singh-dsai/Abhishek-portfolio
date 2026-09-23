import { portfolio } from '@/data/portfolio';
import { GitHubIcon, InstagramIcon, LinkedInIcon, MailIcon, MediumIcon, XIcon } from '@/components/icons';

const p = portfolio.personal;

/** Social profiles that actually exist; empty URLs in the data file are skipped. */
export const socials = [
  { label: 'GitHub', href: p.github, Icon: GitHubIcon },
  { label: 'LinkedIn', href: p.linkedin, Icon: LinkedInIcon },
  { label: 'Medium', href: p.medium, Icon: MediumIcon },
  { label: 'X', href: p.x, Icon: XIcon },
  { label: 'Instagram', href: p.instagram, Icon: InstagramIcon },
  { label: 'Email', href: p.email ? `mailto:${p.email}` : '', Icon: MailIcon },
].filter((s) => s.href);
