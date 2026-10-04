import type { Founder, Venture } from '../data';
import { founderById, ventureById } from '../data';
import { href } from '../router';
import { Avatar, Cover, StageChip, VentureDot } from './Visuals';

export function VentureCard({ venture }: { venture: Venture }) {
  const names = venture.founders
    .map(id => founderById(id))
    .filter((f): f is Founder => !!f)
    .map(f => f.name)
    .join(' & ');
  return (
    <a className='vcard' href={href('/ventures/' + venture.id)}>
      <Cover venture={venture} />
      <div className='vcard-body'>
        <div className='vcard-top'>
          <h3>{venture.name}</h3>
          <StageChip stage={venture.stage} />
        </div>
        <p className='vcard-pitch'>{venture.pitch}</p>
        <p className='vcard-meta'>
          {venture.sector} · {names}
        </p>
      </div>
    </a>
  );
}

export function FounderCard({
  founder,
  compact,
  onVenture,
}: {
  founder: Founder;
  compact?: boolean;
  onVenture?: (id: string) => void;
}) {
  const first = founder.ventures[0];
  if (compact) {
    // One company reads as a single line; more than one becomes a small
    // numbered index, each entry able to tune whatever is listening.
    const many = founder.ventures.length > 1;
    return (
      <a
        className='fcard fcard-compact'
        href={href('/ventures/' + first)}
        aria-label={founder.name + ': ' + founder.roles.join('; ')}
      >
        <Avatar founder={founder} />
        <div className='fcard-text'>
          <h3>{founder.name}</h3>
          {many ? (
            <ol className='fcard-index' aria-hidden='true'>
              {founder.ventures.map((id, i) => (
                <li key={id} onMouseEnter={onVenture ? () => onVenture(id) : undefined}>
                  <b>{String(i + 1).padStart(2, '0')}</b>
                  {ventureById(id)?.name || id}
                </li>
              ))}
            </ol>
          ) : (
            <p className='fcard-role'>
              <span>{founder.roles[0]}</span>
            </p>
          )}
        </div>
      </a>
    );
  }
  return (
    <a className='fcard' href={href('/ventures/' + first)}>
      <Avatar founder={founder} size='lg' />
      <div className='fcard-text'>
        <h3>{founder.name}</h3>
        {founder.roles.map(r => (
          <p key={r} className='fcard-role'>
            {r}
          </p>
        ))}
        <span className='badge'>Founding member</span>
      </div>
    </a>
  );
}
