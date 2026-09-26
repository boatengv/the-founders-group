import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Founder, Stage, Venture } from '../data';
import { domainOf, ventureById } from '../data';

function colorVar(color: string): CSSProperties {
  return { ['--v' as string]: color } as CSSProperties;
}

// Shows the venture's uploaded image; until one exists, draws a poster in the
// venture's colour with a browser bar showing its address.
export function Cover({ venture, large }: { venture: Venture; large?: boolean }) {
  const [failed, setFailed] = useState(false);
  const first = venture.links[0];
  return (
    <div className={'cover' + (large ? ' cover-lg' : '')} style={colorVar(venture.color)}>
      {!failed ? (
        <img src={venture.image} alt={venture.name} loading='lazy' onError={() => setFailed(true)} />
      ) : (
        <div className='cover-art' aria-hidden='true'>
          <div className='cover-bar'>
            <i />
            <i />
            <i />
            <span>{first ? domainOf(first.url) : 'coming soon'}</span>
          </div>
          <div className='cover-name'>{venture.name}</div>
        </div>
      )}
    </div>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function Avatar({ founder, size }: { founder: Founder; size?: 'sm' | 'lg' }) {
  const [failed, setFailed] = useState(false);
  const v = ventureById(founder.ventures[0]);
  return (
    <div className={'avatar avatar-' + (size || 'md')} style={colorVar(v ? v.color : '#7a7a7a')}>
      {!failed ? (
        <img src={founder.photo} alt={founder.name} loading='lazy' onError={() => setFailed(true)} />
      ) : (
        <span aria-hidden='true'>{initials(founder.name)}</span>
      )}
    </div>
  );
}

export function StageChip({ stage }: { stage: Stage }) {
  return <span className={'stage stage-' + stage.toLowerCase()}>{stage}</span>;
}

export function VentureDot({ venture }: { venture: Venture }) {
  return (
    <span className='vdot' style={colorVar(venture.color)}>
      <i aria-hidden='true' />
      {venture.name}
    </span>
  );
}
