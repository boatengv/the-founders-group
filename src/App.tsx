import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import './site.css';
import { GROUP, ventureById } from './data';
import { useRoute } from './router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { VenturePage, Ventures } from './pages/Ventures';
import { Admin, Apply, Founders, Investors } from './pages/Other';
import { Stories, StoryPage } from './pages/Stories';
import { storyById } from './stories';

function App() {
  const route = useRoute();
  const [section, id] = route.path;

  useEffect(() => {
    const v = section === 'ventures' && id ? ventureById(id) : undefined;
    const story = section === 'stories' && id ? storyById(id) : undefined;
    const names: Record<string, string> = {
      ventures: 'Ventures',
      stories: 'The Dispatch',
      founders: 'Founders',
      apply: 'Apply',
      investors: 'For investors',
      admin: 'Admin',
    };
    const page = story ? story.title : v ? v.name : section ? names[section] : '';
    document.title = page ? page + ' · ' + GROUP.name : GROUP.name;
  }, [section, id]);

  let page;
  if (!section) page = <Home />;
  else if (section === 'ventures' && id) page = <VenturePage id={id} />;
  else if (section === 'ventures') page = <Ventures />;
  else if (section === 'stories' && id) page = <StoryPage id={id} />;
  else if (section === 'stories') page = <Stories desk={route.query.get('v') || undefined} />;
  else if (section === 'founders') page = <Founders />;
  else if (section === 'apply') page = <Apply />;
  else if (section === 'investors') page = <Investors preselect={route.query.get('v') || undefined} />;
  else if (section === 'admin') page = <Admin />;
  else page = <Home />;

  const key = (route.path.join('/') || 'home') + (section === 'stories' && !id ? '?' + route.query.toString() : '');

  return (
    <Layout current={section || ''}>
      <AnimatePresence mode='wait'>
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {page}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
