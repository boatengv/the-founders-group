import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Venture } from '../data';
import { monthLabel, ventureById } from '../data';
import type { Story } from '../stories';
import { STORIES, desksWithStories, storiesFor, storyById } from '../stories';
import { href } from '../router';
import { Reveal, StaggerGrid } from '../components/Motion';
import { SCENE_COLORS } from '../components/Scene';
import '../stories.css';

const tint = (v: Venture) => ({ '--glow': SCENE_COLORS[v.id] || '#8a8f98' }) as CSSProperties;

// A story's picture: its own image, else its business's, else a title card.
function StoryImage({ story, venture, large }: { story: Story; venture: Venture; large?: boolean }) {
  const sources = [story.image, venture.image].filter((x): x is string => !!x);
  const [n, setN] = useState(0);
  useEffect(() => setN(0), [story.id]);
  const src = sources[n];
  return (
    <div className={'story-img' + (large ? ' story-img-lg' : '')} style={tint(venture)} aria-hidden='true'>
      {src ? (
        <img src={src} alt='' loading={large ? undefined : 'lazy'} onError={() => setN(n + 1)} />
      ) : (
        <span className='story-img-name'>{venture.name}</span>
      )}
    </div>
  );
}

export function StoryCard({ story }: { story: Story }) {
  const v = ventureById(story.ventureId);
  if (!v) return null;
  return (
    <a className='scard' href={href('/stories/' + story.id)}>
      <div className='scard-pic'>
        <StoryImage story={story} venture={v} />
        {story.stats && story.stats[0] ? (
          <span className='scard-stat' style={tint(v)}>
            <b>{story.stats[0].value}</b> {story.stats[0].label}
          </span>
        ) : null}
      </div>
      <div className='scard-body'>
        <p className='scard-meta'>
          <span className='scard-desk' style={tint(v)}>
            <i aria-hidden='true' />
            {v.name}
          </span>
          <span>{monthLabel(story.month)}</span>
        </p>
        <h3>{story.title}</h3>
        {story.summary ? <p className='scard-summary'>{story.summary}</p> : null}
        <span className='scard-read'>
          Read the story <ArrowRight size={14} />
        </span>
      </div>
    </a>
  );
}

// Every story, newest first, with a desk per business to narrow it down.
export function Stories({ desk }: { desk?: string }) {
  const desks = desksWithStories();
  const current = desk && desks.some(d => d.id === desk) ? desk : 'all';
  const shown = current === 'all' ? STORIES : storiesFor(current);
  return (
    <>
      <section className='page-head'>
        <p className='eyebrow'>The Dispatch</p>
        <h1>Stories from the group</h1>
        <p className='lede'>Launches, wins and milestones from every business in the group, newest first.</p>
      </section>

      <nav className='chips' aria-label='Filter stories by business'>
        <a className='chip' aria-current={current === 'all' ? 'page' : undefined} href={href('/stories')}>
          All <small>{STORIES.length}</small>
        </a>
        {desks.map(v => (
          <a
            key={v.id}
            className='chip'
            aria-current={current === v.id ? 'page' : undefined}
            href={href('/stories?v=' + v.id)}
          >
            {v.name} <small>{storiesFor(v.id).length}</small>
          </a>
        ))}
      </nav>

      <StaggerGrid key={current} className='sgrid'>
        {shown.map(s => (
          <StoryCard key={s.id} story={s} />
        ))}
      </StaggerGrid>
    </>
  );
}

export function StoryPage({ id }: { id: string }) {
  const story = storyById(id);
  const v = story ? ventureById(story.ventureId) : undefined;
  if (!story || !v) {
    return (
      <section className='page-head'>
        <h1>Story not found</h1>
        <p className='lede'>
          That story is not in the Dispatch. <a href={href('/stories')}>See all stories</a>.
        </p>
      </section>
    );
  }

  const i = STORIES.findIndex(s => s.id === story.id);
  const newer = STORIES[i - 1];
  const older = STORIES[i + 1];
  const more = storiesFor(v.id).filter(s => s.id !== story.id);
  const hasBody = !!(story.body && story.body.length);

  return (
    <>
      <a className='back' href={href('/stories')}>
        <ArrowLeft size={16} /> The Dispatch
      </a>

      <article className='story-page'>
        <Reveal className='story-head'>
          <p className='scard-meta'>
            <a className='scard-desk' style={tint(v)} href={href('/stories?v=' + v.id)}>
              <i aria-hidden='true' />
              {v.name}
            </a>
            <span>{monthLabel(story.month)}</span>
          </p>
          <h1>{story.title}</h1>
          {story.summary ? <p className='lede'>{story.summary}</p> : null}
        </Reveal>

        {story.stats && story.stats.length ? (
          <StaggerGrid className='story-stats'>
            {story.stats.map((st, n) => (
              <div key={n} className={'story-stat' + (n === 0 ? ' lead-stat' : '')} style={tint(v)}>
                <b>{st.value}</b>
                <span>{st.label}</span>
              </div>
            ))}
          </StaggerGrid>
        ) : null}

        <Reveal delay={0.08}>
          <StoryImage story={story} venture={v} large />
        </Reveal>

        <div className='story-main'>
          <div className='prose story-body'>
            {hasBody
              ? story.body!.map((p, n) => (
                  <div key={n} className='story-para'>
                    <p>{p}</p>
                    {story.quote && n === (story.quoteAfter ? Math.min(story.quoteAfter, story.body!.length) - 1 : Math.floor((story.body!.length - 1) / 2)) ? (
                      <blockquote className='story-quote' style={tint(v)}>
                        <p>{story.quote}</p>
                      </blockquote>
                    ) : null}
                  </div>
                ))
              : null}
            {!hasBody && story.quote ? (
              <blockquote className='story-quote' style={tint(v)}>
                <p>{story.quote}</p>
              </blockquote>
            ) : null}
            {!hasBody && !story.summary ? (
              <p className='muted'>The full write-up for this story is on its way.</p>
            ) : null}
            <div className='story-actions'>
              {story.link ? (
                <a className='btn btn-accent' href={story.link} target='_blank' rel='noopener noreferrer'>
                  See it live <ArrowUpRight size={16} />
                </a>
              ) : null}
              <a className='btn btn-ghost' href={href('/ventures/' + v.id)}>
                About {v.name} <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <aside className='story-side'>
            <p className='eyebrow'>More from {v.name}</p>
            {more.length ? (
              <ol className='story-more'>
                {more.slice(0, 5).map(s => (
                  <li key={s.id}>
                    <a href={href('/stories/' + s.id)}>
                      <span>{monthLabel(s.month)}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            ) : (
              <p className='muted'>This is the first story from {v.name}.</p>
            )}
            {more.length > 5 ? (
              <a className='link-arrow' href={href('/stories?v=' + v.id)}>
                All {v.name} stories <ArrowRight size={16} />
              </a>
            ) : null}
          </aside>
        </div>

        <nav className='story-pager' aria-label='More stories'>
          {older ? (
            <a href={href('/stories/' + older.id)}>
              <small>
                <ArrowLeft size={14} /> Older
              </small>
              {older.title}
            </a>
          ) : (
            <span />
          )}
          {newer ? (
            <a className='newer' href={href('/stories/' + newer.id)}>
              <small>
                Newer <ArrowRight size={14} />
              </small>
              {newer.title}
            </a>
          ) : null}
        </nav>
      </article>
    </>
  );
}
