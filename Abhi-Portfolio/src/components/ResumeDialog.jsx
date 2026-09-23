'use client';

import { Download, ExternalLink, FileText } from 'lucide-react';
import Image from 'next/image';
import { portfolio } from '@/data/portfolio';
import { asset } from '@/lib/asset';
import Dialog from './ui/Dialog';
import { LinkButton } from './ui/Button';

const { personal } = portfolio;

export default function ResumeDialog({ open, onClose }) {
  const { preview, summary, previewWidth, previewHeight } = personal.resume;
  const url = asset(personal.resume.url);
  const fileName = `${personal.name.replace(/\s+/g, '_')}_Resume.pdf`;
  return (
    <Dialog open={open} onClose={onClose} labelledBy="resume-title">
      <div className="p-6 pb-0 md:p-7 md:pb-0">
        <h2 id="resume-title" className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight">
          Resume <FileText className="size-5 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
        </h2>
        <p className="mt-2 text-[15px] text-muted-foreground">{summary}</p>
        {preview && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="mt-5 block overflow-hidden rounded-2xl bg-white">
            <Image
              src={asset(preview)}
              alt={`First page of ${personal.name}'s résumé. Opens the PDF in a new tab.`}
              width={previewWidth}
              height={previewHeight}
              className="max-h-[52dvh] w-full object-contain object-top"
            />
          </a>
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border p-5 md:px-7">
        <LinkButton href={url} download={fileName} variant="primary" size="md">
          <Download className="size-4" strokeWidth={1.75} aria-hidden="true" /> Download PDF
        </LinkButton>
        <LinkButton href={url} external variant="ghost" size="md" className="!text-foreground">
          Open in new tab <ExternalLink className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </LinkButton>
      </div>
    </Dialog>
  );
}
