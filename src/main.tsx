import '@fontsource/inter/variable.css'
import './index.css'

import { Route } from 'react-router-dom'

import { App, Layout, Router } from '@/components'
import { Home } from '@/pages/Home'
import { ProvideAuth } from './utils'

import { createRoot } from 'react-dom/client';
import { Settings } from './pages/Settings'
import { ProvideState } from './utils/AppState'
import { User } from './pages/User'
import { Users } from './pages/Users'

import { Organization } from './pages/Organization'
import { Organizations } from './pages/Organizations'
import { Help } from './pages/Help'
import { RequestHelp } from './pages/RequestHelp'
const container = document.getElementById('root');
const root = createRoot(container); root.render(

  <ProvideAuth>
    <ProvideState>
      <App>
        <Router>
          <Route path="/" element={<Home />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
          <Route path="/settings/*" element={<Settings />} >
            

          </Route>
          <Route path="/users" element={<Users />} >
           

          </Route>
          <Route path="/users/:userId" element={<User />} />

          <Route path="/organization" element={<Organizations />} > </Route>
          <Route path="/organization/:orgId" element={<Organization />} />


          <Route path="/help" element={<Help />} />
          <Route path="/request" element={<RequestHelp />} />

          <Route path="*" element={<Layout title="Not Found">
            <p>There's nothing here: 404!</p>
          </Layout>} />
        </Router>
      </App>
    </ProvideState>
  </ProvideAuth>
);