
// // src/App.tsx - Updated with authentication
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import Layout from './components/Layout';
// import Dashboard from './components/Dashboard';
// import Profile from './pages/Profile';
// import History from './pages/History';
// import Settings from './pages/Settings';
// import ProtectedRoute from './components/ProtectedRoute';

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route path="/" element={
//             <ProtectedRoute>
//               <Layout>
//                 <AnimatePresence mode="wait">
//                   <Routes>
//                     <Route 
//                       path="/" 
//                       element={
//                         <motion.div
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           exit={{ opacity: 0, y: -20 }}
//                           transition={{ duration: 0.3 }}
//                         >
//                           <Dashboard />
//                         </motion.div>
//                       } 
//                     />
//                     <Route 
//                       path="/profile" 
//                       element={
//                         <motion.div
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           exit={{ opacity: 0, y: -20 }}
//                           transition={{ duration: 0.3 }}
//                         >
//                           <Profile />
//                         </motion.div>
//                       } 
//                     />
//                     <Route 
//                       path="/history" 
//                       element={
//                         <motion.div
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           exit={{ opacity: 0, y: -20 }}
//                           transition={{ duration: 0.3 }}
//                         >
//                           <History />
//                         </motion.div>
//                       } 
//                     />
//                     <Route 
//                       path="/settings" 
//                       element={
//                         <motion.div
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           exit={{ opacity: 0, y: -20 }}
//                           transition={{ duration: 0.3 }}
//                         >
//                           <Settings />
//                         </motion.div>
//                       } 
//                     />
//                   </Routes>
//                 </AnimatePresence>
//               </Layout>
//             </ProtectedRoute>
//           } />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Profile from './pages/Profile';
import History from './pages/History';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
