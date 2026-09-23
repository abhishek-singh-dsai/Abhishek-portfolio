'use client';

import { useRef, useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { portfolio } from '@/data/portfolio';
import GrainBackground from './GrainBackground';
import { useToast } from '@/lib/toast';
import { Button } from './ui/Button';
import { Eyebrow, Reveal } from './ui/Reveal';

const { personal, contact } = portfolio;
const firstName = personal.name.split(' ')[0];

// Optional form backend. Works with Formspree (endpoint only) or Web3Forms (endpoint + access key).
// Without an endpoint the form falls back to opening the visitor's email app.
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || '';
const ACCESS_KEY = process.env.NEXT_PUBLIC_CONTACT_ACCESS_KEY || '';
// Neither a backend nor an email is configured yet: the form explains that instead of failing silently.
const CONFIGURED = Boolean(ENDPOINT || personal.email);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const empty = { name: '', country: '', topic: contact.topics[0], email: '', message: '', company: '' };

/** Input that sizes itself to its content so it sits inside the sentence. */
function InlineField({ id, value, placeholder, invalid, multiline, onChange, inputRef, ...rest }) {
  const Field = multiline ? 'textarea' : 'input';
  return (
    <span className="relative inline-block max-w-full align-baseline">
      <span aria-hidden="true" className={`invisible px-1.5 ${multiline ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'}`}>
        {value || placeholder}
        {multiline && value.endsWith('\n') ? ' ' : ''}
      </span>
      <Field
        id={id}
        ref={inputRef}
        value={value}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={multiline}
        {...(multiline ? { rows: 1 } : { type: rest.type || 'text' })}
        {...rest}
        className={`inline-field absolute inset-0 w-full resize-none overflow-hidden bg-transparent px-1.5 font-[inherit] text-foreground outline-none placeholder:text-muted-foreground/50 ${multiline ? 'text-left' : 'text-center'}`}
      />
    </span>
  );
}

export default function Contact() {
  const toast = useToast();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);

  const set = (key) => (v) => {
    setForm((f) => ({ ...f, [key]: v }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: false }));
  };

  const validate = () => {
    const checks = [
      ['name', !form.name.trim(), `Add your name so ${firstName} knows who is writing.`],
      ['email', !form.email.trim(), `Add your email so ${firstName} can reply.`],
      ['email', form.email.trim() && !EMAIL_RE.test(form.email.trim()), 'That email address does not look right.'],
      ['message', form.message.trim().length < 10, 'Write a short message, at least a sentence.'],
    ];
    const failed = checks.filter(([, bad]) => bad);
    setErrors(Object.fromEntries(failed.map(([k]) => [k, true])));
    if (failed.length) {
      toast(failed[0][2], 'error');
      ({ name: nameRef, email: emailRef, message: messageRef })[failed[0][0]].current?.focus();
      return false;
    }
    return true;
  };

  const subject = `${form.topic} enquiry from ${form.name.trim()}`;
  const body = () =>
    `Hey ${firstName}!\n\nMy name is ${form.name.trim()}${form.country.trim() ? ` and I am from ${form.country.trim()}` : ''}. ` +
    `Let's connect about: ${form.topic}.\n\n${form.message.trim()}\n\nReply to: ${form.email.trim()}`;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending' || !validate()) return;

    if (form.company) {
      // Honeypot filled: almost certainly a bot. Pretend it worked.
      setStatus('sent');
      return;
    }

    if (!CONFIGURED) {
      toast('The contact form is not set up yet. Add an email in src/data/portfolio.js.', 'error', 6000);
      return;
    }

    if (!ENDPOINT) {
      window.location.href = `mailto:${personal.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body())}`;
      toast('Opening your email app. Send the message from there.', 'info');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...(ACCESS_KEY ? { access_key: ACCESS_KEY } : {}),
          subject,
          name: form.name.trim(),
          email: form.email.trim(),
          country: form.country.trim(),
          topic: form.topic,
          message: form.message.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error(data.message || `HTTP ${res.status}`);
      setStatus('sent');
      toast(`Message sent. ${firstName} will reply to ${form.email.trim()}.`, 'success', 6000);
    } catch {
      setStatus('idle');
      toast(personal.email ? `Could not send right now. Please email ${personal.email} directly.` : 'Could not send right now. Please try again later.', 'error', 7000);
    }
  };

  const reset = () => {
    setForm(empty);
    setStatus('idle');
  };

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden py-28 md:py-40" aria-labelledby="contact-title">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[120%] -translate-y-1/2 opacity-50 [mask-image:radial-gradient(70%_70%_at_50%_50%,black_30%,transparent_95%)]"
      >
        <GrainBackground shape="blob" stars={false} />
      </div>

      <div className="relative mx-auto w-full max-w-4xl px-5 md:px-8">
        <Reveal>
          <Eyebrow>
            <span id="contact-title">Contact</span>
          </Eyebrow>
        </Reveal>

        <Reveal>
          {status === 'sent' ? (
            <div className="mt-8" role="status">
              <p className="font-display text-[1.55rem] font-semibold leading-[1.5] tracking-tight md:text-[2.1rem]">
                Thanks{form.name ? `, ${form.name.trim().split(' ')[0]}` : ''}! <span aria-hidden="true">🙌</span> Your message is on its way.{' '}
                <span className="text-muted-foreground">{firstName} will reply to {form.email.trim()}.</span>
              </p>
              <Button variant="outline" size="md" className="mt-8" onClick={reset}>
                Send another message
              </Button>
            </div>
          ) : (
            <form className="mt-8" noValidate onSubmit={onSubmit} aria-describedby="contact-help">
              <div className="font-display text-[1.55rem] font-semibold leading-[1.75] tracking-tight text-foreground/90 md:text-[2.1rem] md:leading-[1.8]">
                Hey, {firstName}! <span aria-hidden="true">👋</span> My name is{' '}
                <InlineField id="c-name" inputRef={nameRef} value={form.name} onChange={set('name')} placeholder="Your Name" aria-label="Your name" maxLength={60} autoComplete="name" invalid={errors.name} required />{' '}
                and I am from{' '}
                <InlineField id="c-country" value={form.country} onChange={set('country')} placeholder="Country" aria-label="Your country (optional)" maxLength={40} autoComplete="country-name" />
                , Let&apos;s connect about{' '}
                <span role="radiogroup" aria-label="What to connect about" className="mx-1 inline-flex flex-wrap gap-2 align-middle">
                  {contact.topics.map((t) => (
                    <label key={t} className="cursor-pointer">
                      <input
                        type="radio"
                        name="topic"
                        value={t}
                        checked={form.topic === t}
                        onChange={() => set('topic')(t)}
                        className="peer sr-only"
                      />
                      <span className="inline-flex h-9 items-center rounded-full border border-border bg-foreground/[0.04] px-4 font-sans text-sm font-medium tracking-normal text-muted-foreground transition-colors hover:text-foreground peer-checked:border-transparent peer-checked:bg-gradient-to-r peer-checked:from-g2 peer-checked:to-g3 peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-ring/50">
                        {t}
                      </span>
                    </label>
                  ))}
                </span>
                . We can talk in more detail at{' '}
                <InlineField id="c-email" inputRef={emailRef} type="email" value={form.email} onChange={set('email')} placeholder="your email" aria-label="Your email" maxLength={120} autoComplete="email" inputMode="email" invalid={errors.email} required />{' '}
                In short,{' '}
                <InlineField id="c-message" inputRef={messageRef} multiline value={form.message} onChange={set('message')} placeholder="Type your message" aria-label="Your message" maxLength={2000} invalid={errors.message} required />
              </div>

              {/* Honeypot for bots; hidden from people and assistive tech. */}
              <div aria-hidden="true" className="absolute left-[-9999px] size-px overflow-hidden">
                <label>
                  Company
                  <input tabIndex={-1} autoComplete="off" value={form.company} onChange={(e) => set('company')(e.target.value)} />
                </label>
              </div>

              <Button type="submit" variant="orbit" size="lg" className="mt-12 gap-2.5 px-7 font-semibold" disabled={status === 'sending'}>
                {status === 'sending' ? (
                  <>
                    Sending <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Send message <Send className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  </>
                )}
              </Button>
              <p id="contact-help" className="mt-5 text-xs leading-relaxed text-muted-foreground">
                {!CONFIGURED
                  ? 'Contact form not configured yet (add an email or a form endpoint).'
                  : ENDPOINT
                    ? 'Sends straight to my inbox.'
                    : 'Opens your email app. You send the message there.'}
                {personal.email && (
                  <>
                    <br />
                    Or email{' '}
                    <a href={`mailto:${personal.email}`} className="break-all underline underline-offset-4 hover:text-foreground">
                      {personal.email}
                    </a>
                    .
                  </>
                )}
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
