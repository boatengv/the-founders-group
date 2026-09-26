import type { Founder, Moment, Venture } from '../data';
import { founderById, monthLabel, ventureById } from '../data';
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

export function MomentCard({ moment }: { moment: Moment }) {
  const v = ventureById(moment.ventureId);
  return (
    <a className='moment' href={href('/ventures/' + moment.ventureId)}>
      <span className='moment-date'>{monthLabel(moment.month)}</span>
      <p className='moment-title'>{moment.title}</p>
      {v ? <VentureDot venture={v} /> : null}
    </a>
  );
}

export function FounderCard({ founder }: { founder: Founder }) {
  const first = founder.ventures[0];
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
