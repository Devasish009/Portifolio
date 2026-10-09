const PROJECTS = {
      exploremate: {
        num: '02', cat: 'Mobile / AI / Travel Tech',
        title: 'ExploreMate – AI-Powered Travel Companion',
        about: [
          'ExploreMate is an AI-powered mobile application designed to make travel more accessible, exciting, and independent — especially for solo travelers.',
          'Unlike traditional travel apps that focus solely on booking and navigation, ExploreMate integrates advanced AI-driven features with personalization and gamification to create an immersive, interactive travel experience.',
          'The app combines smart search, AI-based assistance, real-time language translation, and intelligent trip scheduling to help users plan and manage trips efficiently while discovering unique, locally-authentic experiences.'
        ],
        previewTitle: 'ExploreMate — AI Travel Assistant',
        preview: `<span style="color:#ff3a2f">// ExploreMate — AI Travel Companion</span>
<br><br><span style="color:#febc2e">🗺️ ExploreMate</span> &nbsp;<span style="color:#28c840">READY</span>
<br><span style="color:rgba(244,238,236,.3)">Destinations: <span style="color:#f4eeec">500+</span> &nbsp;| Users: <span style="color:#f4eeec">12k+</span></span>
<br><br><span style="color:#888">AI</span> hidden-gem-finder() &nbsp;<span style="color:#28c840">✓ active</span>
<br><span style="color:#888">MOOD</span> food-explorer(mood, weather) &nbsp;<span style="color:#28c840">✓ ready</span>
<br><span style="color:#888">GAME</span> city-explorer(missions) &nbsp;<span style="color:#febc2e">⚡ engaging</span>
<br><br><span style="color:rgba(244,238,236,.3)">Audio tours: <span style="color:#f4eeec">342</span></span>
<br><span style="color:rgba(244,238,236,.3)">Translations: <span style="color:#28c840">real-time ✓</span></span>
<br><span style="color:rgba(244,238,236,.3)">Leaderboard: <span style="color:#f4eeec">live</span></span>`,
        features: [
          'Smart Search & Personalization — AI-driven destination and activity recommendations tailored to user preferences',
          'Hidden Gem Finder — discover underrated, locally popular places and hidden attractions off the beaten path',
          'Mood-Based Food Explorer — intelligent food recommendations based on user mood, weather conditions, and time of day, with cultural stories attached',
          'Gamified City Explorer — turn city exploration into an engaging game with missions, rewards, achievements, and leaderboards',
          'AI Audio Tour Guide — personalized audio storytelling featuring historical insights, cultural narratives, and food-related stories',
          'Real-Time Language Translation — instant translation for menus, signs, and conversations',
          'Intelligent Trip Scheduling — AI-optimized itineraries that balance activities, travel time, and rest periods',
          'Cross-Platform Compatibility — seamless experience on both Android and iOS devices'
        ],
        stack: ['Flutter', 'Dart', 'AI/ML', 'Node.js', 'Express.js', 'Firebase', 'PostgreSQL', 'Google Maps API'],
        github: 'https://github.com/Devasish009/exploremate'
      },
      aegisx: {
        num: '01', cat: 'Security / Backend',
        title: 'AegisX – Mini SIEM & Intrusion Detection System',
        about: [
          'AegisX is a web-based Security Information and Event Management (SIEM) platform designed for real-time threat monitoring, log correlation, and automated incident response.',
          'Built with an attacker mindset, it continuously tracks authentication attempts, API patterns, and anomalous behaviour — detecting threats before they escalate and responding automatically.',
          '<strong>Note:</strong> Due to security concerns, as this is a real official application, a live deployment is not hosted.'
        ],
        previewTitle: 'AegisX — Live Threat Dashboard',
        preview: `<span style="color:#ff3a2f">// AegisX — Live Threat Dashboard</span>
<br><span style="color:#888">GET</span>  /api/logs/stream &nbsp;&nbsp;&nbsp;<span style="color:#28c840">● LIVE</span>
<br><span style="color:#888">POST</span> /api/auth/block-ip &nbsp;<span style="color:#febc2e">⚠ FLAGGED</span>
<br><br><span style="color:rgba(244,238,236,.3)">Events correlated: <span style="color:#f4eeec">1,247</span></span>
<br><span style="color:rgba(244,238,236,.3)">IPs blocked: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#ff3a2f">23</span></span>
<br><span style="color:rgba(244,238,236,.3)">Alerts fired: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#febc2e">8</span></span>
<br><br><span style="color:#555">WebSocket: <span style="color:#28c840">CONNECTED</span></span>`,
        features: [
          'Real-time log aggregation & event correlation engine tracking auth attempts and suspicious API access patterns',
          'Brute-force detection with threshold-based anomaly analysis and automatic alerting',
          'Automated IP blocking — flagged IPs banned via Express middleware in under 50ms',
          'WebSocket-powered live dashboard — threat feeds update without page refresh',
          'JWT-secured admin endpoints with role-based access control (RBAC)'
        ],
        stack: ['Node.js', 'Express.js', 'PostgreSQL', 'JWT', 'WebSockets'],
        github: 'https://github.com/Devasish009/aegisx-siem'
      },
      thunder_app: {
        num: '06', cat: 'Mobile / Event Tech',
        title: 'Thunder Thursday – Student & Performance App',
        about: [
          'Thunder Thursday is a feature-rich mobile application built for college cultural event management, registration, and live voting.',
          'It offers students a dynamic platform to register for events (such as Solo Dance, Group Music, etc.), view event guidelines, receive real-time notifications, and vote for their favorite performances.',
          'The app incorporates native mobile experiences such as a video splash screen, interactive event gallery, and live push notifications using Firebase Cloud Messaging.'
        ],
        previewTitle: 'Thunder Thursday — Student App',
        demo: 'https://thunder-thursday.vercel.app',
        preview: `<span style="color:#ff3a2f">// Thunder Thursday — Event App Live</span>
<br><br><span style="color:#febc2e">⚡ Thunder Thursday</span> &nbsp;<span style="color:#28c840">ONLINE</span>
<br><span style="color:rgba(244,238,236,.3)">Active Users: <span style="color:#f4eeec">340+</span> &nbsp;| Votes: <span style="color:#f4eeec">890+</span></span>
<br><br><span style="color:#888">POST</span> /api/vote &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#28c840">200 OK</span>
<br><span style="color:#888">GET</span>  /api/leaderboard &nbsp;<span style="color:#28c840">● STREAMING</span>
<br><br><span style="color:rgba(244,238,236,.3)">Push FCM: <span style="color:#28c840">active ✓</span></span>
<br><span style="color:rgba(244,238,236,.3)">Video Splash: <span style="color:#28c840">initialized ✓</span></span>`,
        features: [
          'User registration and secure login with Firebase Authentication & verification logic',
          'Interactive event registration forms supporting comprehensive field configurations',
          'Live voting system with real-time Firestore synchronization for casting and viewing scores',
          'Native-like carousels and sliders for event banner highlights',
          'Local notifications and FCM push notification alerts for live updates and schedule changes',
          'Custom video player for playing event promotional and intro reels'
        ],
        stack: ['Flutter', 'Dart', 'Firebase Auth', 'Cloud Firestore', 'Firebase Messaging', 'Shared Preferences'],
        github: 'https://github.com/Devasish009/thunder-thursday-app'
      },
      thunder_admin: {
        num: '07', cat: 'Mobile / Admin Portal',
        title: 'Thunder Thursday – Event Admin Console',
        about: [
          'Thunder Thursday Admin Console is a dedicated management app that empowers college coordinators and event administrators to supervise and control the entire event flow in real time.',
          'Administrators can view and manage event registrations, coordinate participant performances, run live voting sessions, send bulk email/push notifications, and export comprehensive registration reports to Excel format.',
          'The console connects directly to Cloud Firestore to manipulate live event state, toggle voting permissions, and track live statistics.',
          '<strong>Note:</strong> Due to security concerns, as this is a real official application, a live deployment is not hosted.'
        ],
        previewTitle: 'Thunder Thursday — Admin Panel',
        screenshots: ['assets/thunder_admin_1.jpg'],
        preview: `<span style="color:#ff3a2f">// Thunder Thursday — Admin Console</span>
<br><br><span style="color:#febc2e">🛡️ Admin Console</span> &nbsp;<span style="color:#28c840">CONNECTED</span>
<br><span style="color:rgba(244,238,236,.3)">Registrations: <span style="color:#f4eeec">120+</span> &nbsp;| Toggled Votes: <span style="color:#28c840">YES</span></span>
<br><br><span style="color:#888">EXEC</span> export-to-excel() &nbsp;&nbsp;<span style="color:#28c840">✓ SUCCESS</span>
<br><span style="color:#888">POST</span> send-bulk-fcm() &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#28c840">✓ SENT (340)</span>
<br><br><span style="color:rgba(244,238,236,.3)">Mailer SMTP: <span style="color:#28c840">connected ✓</span></span>
<br><span style="color:rgba(244,238,236,.3)">Firestore Control: <span style="color:#28c840">active ✓</span></span>`,
        features: [
          'Role-based admin access control with secure Firebase authentication',
          'Real-time registration dashboard to approve, reject, or filter participant applications',
          'Live performance coordinator tool to toggle performance status (active, completed, next up)',
          'Bulk notification center to dispatch push alerts (FCM) and email announcements (Mailer)',
          'Detailed reporting system to export registration details into Excel files directly from the device',
          'Feedback and query management section to handle student concerns during the event'
        ],
        stack: ['Flutter', 'Dart', 'Cloud Firestore', 'Firebase Messaging', 'Mailer', 'Excel API', 'Share Plus'],
        github: 'https://github.com/Devasish009/thunder_thursday_admin'
      },
      shieldx: {
        num: '03', cat: 'Web / Security',
        title: 'ShieldX – Cybersecurity Tools E-Commerce Showcase',
        about: [
          'ShieldX is a clean, responsive e-commerce showcase platform for cybersecurity tools and products, built with OWASP-aligned architecture.',
          'Designed to establish trust for security-conscious users, it features a structured product layout, intuitive navigation, and a security-hardened Express.js backend.'
        ],
        previewTitle: 'ShieldX — Security Store',
        preview: `<span style="color:#ff3a2f">// ShieldX — Security Tools Store</span>
<br><br><span style="color:#f4eeec">ShieldX</span> <span style="color:rgba(244,238,236,.3)">v1.0</span>
<br><span style="color:rgba(244,238,236,.3)">Products: <span style="color:#f4eeec">12</span> &nbsp;| Categories: <span style="color:#f4eeec">3</span></span>
<br><br><span style="color:#888">GET</span> /products &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#28c840">200 OK</span>
<br><br><span style="color:rgba(244,238,236,.3)">OWASP headers: <span style="color:#28c840">configured ✓</span></span>
<br><span style="color:rgba(244,238,236,.3)">CSP enabled: &nbsp;&nbsp;&nbsp;<span style="color:#28c840">yes ✓</span></span>`,
        features: [
          'Fully responsive UI built with semantic HTML5 and modern CSS — mobile-first design approach',
          'Clean product grid layout with category sections: Firewall, Pentest tools, SIEM products',
          'Structured navigation with smooth UX and user-friendly interface design',
          'Node.js + Express.js backend with OWASP security headers — CSP, X-Frame-Options, HSTS configured',
          'Input sanitisation, rate limiting, and secure error handling throughout'
        ],
        stack: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'Express.js'],
        github: 'https://github.com/Devasish009/ShieldX'
      },
      skyroute: {
        num: '05', cat: 'Desktop / Java',
        title: 'SkyRoute – Bus Ticket Booking System',
        about: [
          'SkyRoute is a full-featured desktop application built with Java Swing for booking bus tickets. It provides a complete end-to-end booking experience — from searching routes and selecting seats to confirming tickets and managing bookings.',
          'The system supports two roles: Users can search buses, view seat availability in a cinema-style interactive layout, book tickets with passenger details, and manage their bookings. Admins have a dedicated dashboard to manage buses, routes, bookings, and users.',
          'Built with clean MVC architecture, DAO pattern for data access, secure SHA-256 password hashing, and JDBC transactions to ensure booking integrity — SkyRoute demonstrates real-world software engineering principles in a polished desktop application.'
        ],
        previewTitle: 'SkyRoute — Booking Terminal',
        preview: `<span style="color:#ff3a2f">// SkyRoute — Bus Booking System</span>
<br><br><span style="color:#febc2e">🚌 SkyRoute v1.0</span> &nbsp;<span style="color:#28c840">RUNNING</span>
<br><span style="color:rgba(244,238,236,.3)">Routes: <span style="color:#f4eeec">15</span> &nbsp;| Buses: <span style="color:#f4eeec">24</span> &nbsp;| Users: <span style="color:#f4eeec">156</span></span>
<br><br><span style="color:#888">SELECT</span> * FROM routes WHERE departure = 'Kakinada'
<br><span style="color:#28c840">→ 3 routes found</span>
<br><br><span style="color:rgba(244,238,236,.3)">Seats available: <span style="color:#28c840">32/40</span></span>
<br><span style="color:rgba(244,238,236,.3)">Booking ref: <span style="color:#f4eeec">SKY-2025-A7X9</span></span>
<br><span style="color:rgba(244,238,236,.3)">Payment: <span style="color:#28c840">confirmed ✓</span></span>
<br><span style="color:rgba(244,238,236,.3)">SHA-256 auth: <span style="color:#28c840">secure ✓</span></span>`,
        features: [
          'User registration and login with SHA-256 password hashing and input validation',
          'Dashboard with real-time stats — total bookings, upcoming trips, and spending overview',
          'Bus search by city and date with route filtering and fare display',
          'Interactive cinema-style seat selection — visually pick available seats from the bus layout',
          'Complete booking flow with passenger details, payment method, and booking reference generation',
          'View, manage, and cancel bookings with JDBC transaction-safe cancellation',
          'Admin panel — manage buses (add/edit/delete), routes (auto seat generation), view all bookings, and user management (activate/deactivate, role changes)',
          'Clean MVC architecture with DAO pattern, custom exceptions, and utility classes'
        ],
        stack: ['Java', 'Java Swing', 'JDBC', 'MySQL', 'SHA-256', 'MVC Architecture'],
        github: 'https://github.com/Devasish009/SkyRoute'
      },
      questai: {
        num: '04', cat: 'AI / Web',
        title: 'QuestAI – AI-Powered Q&A Forum',
        about: [
          'QuestAI is a web-based Q&A platform that leverages artificial intelligence to provide instant, accurate answers to user questions while fostering a vibrant community-driven knowledge ecosystem.',
          'The platform combines a modern React frontend with immersive Three.js visual effects, a robust Node.js backend, and AI-powered answer generation — creating an intelligent forum where users can ask questions, receive AI-generated responses, and engage with community-voted answers.',
          'With secure authentication, profile management, and a voting system to surface the best responses, QuestAI transforms traditional Q&A forums into a smart, interactive learning experience.'
        ],
        previewTitle: 'QuestAI — AI Forum Live',
        preview: `<span style="color:#ff3a2f">// QuestAI — AI-Powered Q&A Forum</span>
<br><br><span style="color:#febc2e">🤖 QuestAI</span> &nbsp;<span style="color:#28c840">ONLINE</span>
<br><span style="color:rgba(244,238,236,.3)">Questions: <span style="color:#f4eeec">1,482</span> &nbsp;| Answers: <span style="color:#f4eeec">3,217</span></span>
<br><br><span style="color:#888">POST</span> /api/ask &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#28c840">200 OK</span>
<br><span style="color:#888">GET</span>  /api/answers &nbsp;&nbsp;<span style="color:#28c840">● AI GENERATING</span>
<br><br><span style="color:rgba(244,238,236,.3)">AI model: <span style="color:#28c840">ready ✓</span></span>
<br><span style="color:rgba(244,238,236,.3)">Community votes: <span style="color:#f4eeec">8,941</span></span>
<br><span style="color:rgba(244,238,236,.3)">Auth: <span style="color:#28c840">JWT secured ✓</span></span>
<br><span style="color:rgba(244,238,236,.3)">Three.js scene: <span style="color:#28c840">rendered ✓</span></span>`,
        features: [
          'AI-driven answer generation — users ask questions and receive intelligent, context-aware responses powered by AI',
          'Community voting system — upvote and downvote answers to surface the most helpful responses',
          'Secure user authentication with JWT — registration, login, and protected routes',
          'User profile management — track questions asked, answers given, and reputation score',
          'Immersive Three.js visual effects — interactive 3D elements enhance the frontend experience',
          'Modern React frontend with Tailwind CSS — responsive, clean UI with smooth animations',
          'RESTful API backend built with Node.js and Express.js — scalable and well-structured',
          'PostgreSQL database for reliable data persistence — questions, answers, users, and votes'
        ],
        stack: ['React', 'Tailwind CSS', 'Three.js', 'Node.js', 'Express.js', 'PostgreSQL'],
        demo: 'https://quest-ai-iota.vercel.app/',
        github: 'https://github.com/Devasish009/QuestAI'
      }
    };

    
