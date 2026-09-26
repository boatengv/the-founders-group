import { useState } from 'react';
import type { FormEvent } from 'react';
import { api } from '@appdeploy/client';
import { VENTURES } from '../data';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function errText(e: unknown, fallback: string): string {
  const err = e as { response?: { data?: { error?: string; message?: string } }; data?: { error?: string } };
  return (err && err.response && err.response.data && (err.response.data.error || err.response.data.message)) ||
    (err && err.data && err.data.error) ||
    fallback;
}

type Status = { kind: 'idle' | 'sending' | 'sent' | 'error'; message?: string };

export function ApplyForm() {
  const [f, setF] = useState({ name: '', email: '', venture: '', website: '', building: '', proof: '', trap: '' });
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!f.name.trim() || !f.venture.trim() || !f.building.trim()) {
      setStatus({ kind: 'error', message: 'Add your name, your venture and what you are building.' });
      return;
    }
    if (!EMAIL_RE.test(f.email.trim())) {
      setStatus({ kind: 'error', message: 'Enter a valid email address so we can reply.' });
      return;
    }
    setStatus({ kind: 'sending' });
    try {
      await api.post('/api/applications', f);
      setStatus({ kind: 'sent' });
    } catch (err) {
      setStatus({ kind: 'error', message: errText(err, 'Your application did not send. Try again.') });
    }
  }

  if (status.kind === 'sent') {
    return (
      <div className='form-done' role='status'>
        <h3>Application received</h3>
        <p>Thanks, {f.name.trim().split(' ')[0]}. Current members read every application, and we will reply to {f.email.trim()}.</p>
      </div>
    );
  }

  return (
    <form className='form' onSubmit={submit} noValidate>
      <div className='form-row'>
        <label>
          Your name
          <input id='ap-name' value={f.name} onChange={set('name')} maxLength={100} autoComplete='name' />
        </label>
        <label>
          Email
          <input id='ap-email' type='email' value={f.email} onChange={set('email')} maxLength={200} autoComplete='email' />
        </label>
      </div>
      <div className='form-row'>
        <label>
          Venture name
          <input id='ap-venture' value={f.venture} onChange={set('venture')} maxLength={100} />
        </label>
        <label>
          Website (optional)
          <input id='ap-website' value={f.website} onChange={set('website')} maxLength={200} placeholder='https://' />
        </label>
      </div>
      <label>
        What are you building?
        <textarea id='ap-building' value={f.building} onChange={set('building')} maxLength={600} rows={4} />
      </label>
      <label>
        Your biggest moment so far (optional)
        <textarea
          id='ap-proof'
          value={f.proof}
          onChange={set('proof')}
          maxLength={400}
          rows={3}
          placeholder='First paying customer, launch day, a number you are proud of'
        />
      </label>
      <label className='trap' aria-hidden='true'>
        Leave this empty
        <input tabIndex={-1} autoComplete='off' value={f.trap} onChange={set('trap')} />
      </label>
      {status.kind === 'error' ? (
        <p className='form-error' role='alert'>
          {status.message}
        </p>
      ) : null}
      <button type='submit' className='btn btn-accent' disabled={status.kind === 'sending'}>
        {status.kind === 'sending' ? 'Sending...' : 'Send application'}
      </button>
    </form>
  );
}

export function IntroForm({ preselect }: { preselect?: string }) {
  const [f, setF] = useState({ name: '', email: '', firm: '', message: '', trap: '' });
  const [picked, setPicked] = useState<string[]>(preselect && VENTURES.some(v => v.id === preselect) ? [preselect] : []);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  function toggle(id: string) {
    setPicked(picked.includes(id) ? picked.filter(p => p !== id) : picked.concat([id]));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!f.name.trim()) {
      setStatus({ kind: 'error', message: 'Add your name.' });
      return;
    }
    if (!EMAIL_RE.test(f.email.trim())) {
      setStatus({ kind: 'error', message: 'Enter a valid email address so we can reply.' });
      return;
    }
    setStatus({ kind: 'sending' });
    try {
      await api.post('/api/intros', { ...f, ventures: picked });
      setStatus({ kind: 'sent' });
    } catch (err) {
      setStatus({ kind: 'error', message: errText(err, 'Your request did not send. Try again.') });
    }
  }

  if (status.kind === 'sent') {
    return (
      <div className='form-done' role='status'>
        <h3>Intro requested</h3>
        <p>Thanks. We will pass your note to the founders and reply to {f.email.trim()}.</p>
      </div>
    );
  }

  return (
    <form className='form' onSubmit={submit} noValidate>
      <div className='form-row'>
        <label>
          Your name
          <input id='in-name' value={f.name} onChange={set('name')} maxLength={100} autoComplete='name' />
        </label>
        <label>
          Email
          <input id='in-email' type='email' value={f.email} onChange={set('email')} maxLength={200} autoComplete='email' />
        </label>
      </div>
      <label>
        Firm or fund (optional)
        <input id='in-firm' value={f.firm} onChange={set('firm')} maxLength={120} />
      </label>
      <fieldset className='picks'>
        <legend>Ventures you are interested in</legend>
        {VENTURES.filter(v => v.stage !== 'Stealth').map(v => (
          <label key={v.id} className='pick'>
            <input id={'in-v-' + v.id} type='checkbox' checked={picked.includes(v.id)} onChange={() => toggle(v.id)} />
            {v.name}
          </label>
        ))}
      </fieldset>
      <label>
        Message (optional)
        <textarea id='in-message' value={f.message} onChange={set('message')} maxLength={1000} rows={4} />
      </label>
      <label className='trap' aria-hidden='true'>
        Leave this empty
        <input tabIndex={-1} autoComplete='off' value={f.trap} onChange={set('trap')} />
      </label>
      {status.kind === 'error' ? (
        <p className='form-error' role='alert'>
          {status.message}
        </p>
      ) : null}
      <button type='submit' className='btn btn-accent' disabled={status.kind === 'sending'}>
        {status.kind === 'sending' ? 'Sending...' : 'Request an intro'}
      </button>
    </form>
  );
}
