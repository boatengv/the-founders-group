import { useEffect, useState } from 'react';
import { ArrowUpRight, Handshake, LineChart, Target, Wrench } from 'lucide-react';
import { api, auth } from '@appdeploy/client';
import type { Founder } from '../data';
import { FOUNDERS, PERKS, VENTURES, founderById, ventureById } from '../data';
import { Section } from '../components/Layout';
import { FounderCard } from '../components/Cards';
import { ApplyForm, IntroForm } from '../components/Forms';
import { StageChip, VentureDot } from '../components/Visuals';
import { Reveal, StaggerGrid } from '../components/Motion';

const PERK_ICONS = [Handshake, Target, Wrench, LineChart];

export function Founders() {
  return (
    <>
      <section className='page-head'>
        <p className='eyebrow'>Founders</p>
        <h1>The people behind the ventures</h1>
        <p className='lede'>Every member is building a real business. These are the founding members.</p>
      </section>
      <StaggerGrid className='fgrid fgrid-lg'>
        {FOUNDERS.map(f => (
          <FounderCard key={f.id} founder={f} />
        ))}
      </StaggerGrid>
    </>
  );
}

export function Apply() {
  return (
    <>
      <section className='page-head'>
        <p className='eyebrow'>Membership by application</p>
        <h1>Join the group</h1>
        <p className='lede'>
          We keep the group small so every member gets real attention. If you are building something real, tell us about it.
        </p>
      </section>

      <Section eyebrow='Membership' title='What members get'>
        <StaggerGrid className='perks'>
          {PERKS.map((p, i) => {
            const Icon = PERK_ICONS[i % PERK_ICONS.length];
            return (
              <div className='perk' key={p.title}>
                <Icon size={22} aria-hidden='true' />
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            );
          })}
        </StaggerGrid>
      </Section>

      <div className='split'>
        <Section eyebrow='Who we look for' title='The bar'>
          <ul className='checks'>
            <li>You are building a real business: a live product, paying customers or a firm launch date.</li>
            <li>You will show up: regular check-ins, honest feedback and intros for other members.</li>
            <li>You share your moments, the wins and the numbers, so the group can help.</li>
          </ul>
          <h3 className='mini-h'>How it works</h3>
          <ol className='steps'>
            <li>
              <strong>Apply.</strong> Takes about five minutes.
            </li>
            <li>
              <strong>Meet.</strong> A short call with two members.
            </li>
            <li>
              <strong>Decide.</strong> The group decides together and replies to every applicant.
            </li>
          </ol>
        </Section>
        <section className='section form-card' id='apply-form'>
          <h2>Apply</h2>
          <ApplyForm />
        </section>
      </div>
    </>
  );
}

export function Investors({ preselect }: { preselect?: string }) {
  useEffect(() => {
    if (preselect) {
      const el = document.getElementById('intro');
      if (el) el.scrollIntoView();
    }
  }, [preselect]);

  return (
    <>
      <section className='page-head'>
        <p className='eyebrow'>For investors</p>
        <h1>The portfolio at a glance</h1>
        <p className='lede'>Founder-led ventures, most already live. Pick the ones you want to meet and we will make the introduction.</p>
      </section>

      <Reveal className='table-wrap'>
        <table className='ptable'>
          <thead>
            <tr>
              <th scope='col'>Venture</th>
              <th scope='col'>Sector</th>
              <th scope='col'>Stage</th>
              <th scope='col'>Founders</th>
              <th scope='col'>Live</th>
            </tr>
          </thead>
          <tbody>
            {VENTURES.map(v => (
              <tr key={v.id}>
                <td>
                  <a href={'#/ventures/' + v.id}>
                    <VentureDot venture={v} />
                  </a>
                </td>
                <td>{v.sector}</td>
                <td>
                  <StageChip stage={v.stage} />
                </td>
                <td>
                  {v.founders
                    .map(id => founderById(id))
                    .filter((f): f is Founder => !!f)
                    .map(f => f.name)
                    .join(', ')}
                </td>
                <td>
                  {v.links.length ? (
                    <a href={v.links[0].url} target='_blank' rel='noopener noreferrer' className='table-link'>
                      Visit <ArrowUpRight size={14} />
                    </a>
                  ) : (
                    <span className='muted'>Soon</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      <section className='section form-card' id='intro'>
        <h2>Request an intro</h2>
        <p className='muted'>Tell us who you are and which ventures interest you. We reply to every request.</p>
        <IntroForm preselect={preselect} />
      </section>
    </>
  );
}

type Application = {
  id: string;
  name: string;
  email: string;
  venture: string;
  website: string;
  building: string;
  proof: string;
  createdAt: string;
};
type Intro = {
  id: string;
  name: string;
  email: string;
  firm: string;
  ventures: string[];
  message: string;
  createdAt: string;
};

function when(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function Admin() {
  const [state, setState] = useState<'checking' | 'signin' | 'denied' | 'ready' | 'error'>('checking');
  const [apps, setApps] = useState<Application[]>([]);
  const [intros, setIntros] = useState<Intro[]>([]);
  const [msg, setMsg] = useState('');

  async function load() {
    setState('checking');
    try {
      const r = await api.get('/api/admin/inbox');
      setApps(r.data.applications || []);
      setIntros(r.data.intros || []);
      setState('ready');
    } catch (e) {
      const s = (e as { response?: { status?: number }; status?: number });
      const code = (s.response && s.response.status) || s.status;
      setState(code === 403 ? 'denied' : code === 401 ? 'signin' : 'error');
    }
  }

  useEffect(() => {
    if (auth.isSignedIn()) void load();
    else setState('signin');
  }, []);

  async function signIn() {
    setMsg('');
    try {
      await auth.signIn();
      await load();
    } catch (e) {
      const code = (e as { code?: string }).code;
      setMsg(code === 'popup_blocked' ? 'Your browser blocked the sign-in window. Allow pop-ups and try again.' : 'Sign-in was cancelled.');
    }
  }

  async function signOut() {
    await auth.signOut();
    setApps([]);
    setIntros([]);
    setState('signin');
  }

  return (
    <>
      <section className='page-head'>
        <p className='eyebrow'>Admin</p>
        <h1>Inbox</h1>
        <p className='lede'>Applications and investor intro requests. Only group admins can see this.</p>
      </section>

      {state === 'checking' ? <p className='muted'>Loading...</p> : null}

      {state === 'signin' ? (
        <div className='form-card'>
          <p>Sign in with an admin account to see the inbox.</p>
          <button type='button' className='btn btn-accent' onClick={signIn}>
            Sign in
          </button>
          {msg ? <p className='form-error'>{msg}</p> : null}
        </div>
      ) : null}

      {state === 'denied' ? (
        <div className='form-card'>
          <p>This account is not a group admin.</p>
          <button type='button' className='btn btn-ghost' onClick={signOut}>
            Sign out
          </button>
        </div>
      ) : null}

      {state === 'error' ? (
        <div className='form-card'>
          <p>The inbox did not load.</p>
          <button type='button' className='btn btn-ghost' onClick={() => void load()}>
            Try again
          </button>
        </div>
      ) : null}

      {state === 'ready' ? (
        <>
          <Section eyebrow={apps.length + ' received'} title='Applications'>
            {apps.length ? (
              <div className='inbox'>
                {apps.map(a => (
                  <article key={a.id} className='inbox-item'>
                    <header>
                      <h3>
                        {a.name} · {a.venture}
                      </h3>
                      <span className='moment-date'>{when(a.createdAt)}</span>
                    </header>
                    <p className='muted'>
                      {a.email}
                      {a.website ? ' · ' + a.website : ''}
                    </p>
                    <p>{a.building}</p>
                    {a.proof ? <p className='muted'>Moment: {a.proof}</p> : null}
                  </article>
                ))}
              </div>
            ) : (
              <p className='muted'>No applications yet.</p>
            )}
          </Section>
          <Section eyebrow={intros.length + ' received'} title='Intro requests'>
            {intros.length ? (
              <div className='inbox'>
                {intros.map(i => (
                  <article key={i.id} className='inbox-item'>
                    <header>
                      <h3>
                        {i.name}
                        {i.firm ? ' · ' + i.firm : ''}
                      </h3>
                      <span className='moment-date'>{when(i.createdAt)}</span>
                    </header>
                    <p className='muted'>{i.email}</p>
                    {i.ventures.length ? (
                      <p>
                        Interested in:{' '}
                        {i.ventures
                          .map(id => {
                            const v = ventureById(id);
                            return v ? v.name : id;
                          })
                          .join(', ')}
                      </p>
                    ) : null}
                    {i.message ? <p>{i.message}</p> : null}
                  </article>
                ))}
              </div>
            ) : (
              <p className='muted'>No intro requests yet.</p>
            )}
          </Section>
          <button type='button' className='btn btn-ghost' onClick={signOut}>
            Sign out
          </button>
        </>
      ) : null}
    </>
  );
}
