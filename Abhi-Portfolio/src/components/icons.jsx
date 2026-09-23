import { siGithub, siMedium, siX, siInstagram } from 'simple-icons';
import { Mail } from 'lucide-react';

function Brand({ icon, className = 'size-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}

// simple-icons no longer ships LinkedIn, so this is a plain "in" mark.
export function LinkedInIcon({ className = 'size-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.83v1.5h.05c.53-.95 1.84-1.95 3.79-1.95 4.05 0 4.83 2.5 4.83 5.75v5.7h-4v-5.05c0-1.2-.02-2.75-1.7-2.75-1.7 0-1.95 1.3-1.95 2.66v5.14h-4.85v-11Z" />
    </svg>
  );
}

export const GitHubIcon = (props) => <Brand icon={siGithub} {...props} />;
export const MediumIcon = (props) => <Brand icon={siMedium} {...props} />;
export const XIcon = (props) => <Brand icon={siX} {...props} />;
export const InstagramIcon = (props) => <Brand icon={siInstagram} {...props} />;
export const MailIcon = (props) => <Mail strokeWidth={1.5} {...props} />;
