'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Github, Linkedin, Mail, ExternalLink, Menu, X, Moon, Sun, Code, Play } from 'lucide-react';
import './portfolio.css';

// ==================== CONSTANTS ====================
const NAVIGATION_ITEMS = ['home', 'about', 'skills', 'projects', 'playground', 'linkedin', 'contact'] as const;

const SKILLS_DATA = [
  { category: 'Languages', items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'PHP', 'SQL'] },
  { category: 'Frontend', items: ['React', 'Next.js', 'Vue.js', 'Tailwind CSS'] },
  { category: 'Backend', items: ['Node.js', 'PHP', 'PostgreSQL', 'REST APIs', 'ASP.NET'] },
  { category: 'Tools', items: ['Git', 'AWS', 'CI/CD', 'Agile', 'Junit', 'Playwright'] }
] as const;

const PROJECTS_DATA = [
  {
    title: 'TaskFlow – Personal Task Management App',
    description: 'TaskFlow is a responsive task management web application built with React.js, allowing users to organize tasks with color-coded labels and persistent local storage.',
    tech: ['React.js', 'JavaScript', 'CSS', 'Browser Local Storage', 'React Hooks'],
    link: 'https://taskflow2-taskmanager.netlify.app/',
    extendedInfo: 'Features include drag-and-drop task prioritization, category filtering, and a clean, intuitive interface designed for productivity. The app demonstrates proficiency in React state management and modern web development practices.'
  }
] as const;

const CODE_EXAMPLES = [
  {
    id: 'react-hook',
    title: 'Custom React Hook',
    language: 'javascript',
    code: `// Custom hook for API calls with loading state
import { useState, useEffect } from 'react';

function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// Usage
function App() {
  const { data, loading } = useApi('/api/users');
  return loading ? 'Loading...' : data;
}`
  },
  {
    id: 'python-algo',
    title: 'Binary Search Algorithm',
    language: 'python',
    code: `def binary_search(arr, target):
    """
    Efficient O(log n) search algorithm
    """
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# Example usage
numbers = [1, 3, 5, 7, 9, 11, 13]
result = binary_search(numbers, 7)
print(f"Found at index: {result}")  # Output: 3`
  },
  {
    id: 'typescript',
    title: 'TypeScript Interface',
    language: 'typescript',
    code: `interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

class UserManager {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
  }

  getUserById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getAdmins(): User[] {
    return this.users.filter(u => u.role === 'admin');
  }
}

const manager = new UserManager();
manager.addUser({
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  role: 'admin'
});`
  }
];

// ==================== TYPES ====================
type Section = typeof NAVIGATION_ITEMS[number];
type Theme = 'light' | 'dark';

// ==================== COMPONENTS ====================
const SectionTransition = React.memo(({ variant = 'light' }: { variant?: 'light' | 'dark' }) => {
  const primaryColor = variant === 'light' ? '#7A1E35' : '#932841';
  const secondaryColor = variant === 'light' ? '#932841' : '#A86373';
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="section-transition scroll-animate scroll-animate-fast">
      <div className="transition-wave-container">
        <svg className="transition-wave transition-wave-1" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,50 Q300,10 600,50 T1200,50 L1200,120 L0,120 Z" fill={primaryColor} />
        </svg>
        <svg className="transition-wave transition-wave-2" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,70 Q300,30 600,70 T1200,70 L1200,120 L0,120 Z" fill={secondaryColor} />
        </svg>
      </div>
      {!isMobile && (
        <div className="transition-particles">
          {[...Array(6)].map((_, i) => <div key={i} className="transition-particle" />)}
        </div>
      )}
      <div className="transition-gradient-overlay" />
    </div>
  );
});

SectionTransition.displayName = 'SectionTransition';

const CustomCursor = React.memo(({ x, y, isHovering }: { x: number; y: number; isHovering: boolean }) => (
  <>
    <style dangerouslySetInnerHTML={{__html: `* { cursor: none !important; }`}} />
    <div 
      className="custom-cursor"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: isHovering ? 'translate(-50%, -50%) scale(1.2)' : 'translate(-50%, -50%) scale(1)',
      }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M5 5L12.57 23.47L15.29 15.29L23.47 12.57L5 5Z" fill="none" stroke="#A89F91" strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M5 5L12.57 23.47L15.29 15.29L23.47 12.57L5 5Z" fill="#7A1E35" stroke="#932841" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  </>
));

CustomCursor.displayName = 'CustomCursor';

const CodePlayground = React.memo(() => {
  const [selectedExample, setSelectedExample] = useState(CODE_EXAMPLES[0]);
  const [output, setOutput] = useState('Click "Run Code" to see the output');
  const [hasRun, setHasRun] = useState(false);

  const runCode = () => {
    setHasRun(true);
    
    // Simulate different outputs based on the code example
    if (selectedExample.id === 'react-hook') {
      setOutput(`✓ Code compiled successfully!

Output:
──────────────────────
Custom hook initialized
Fetching data from: /api/users
Loading: true
Data received: { users: [...] }
Loading: false

Result: Component rendered with user data
──────────────────────

The useApi hook is working perfectly! It manages
loading states and fetches data efficiently.`);
    } else if (selectedExample.id === 'python-algo') {
      setOutput(`✓ Code executed successfully!

Output:
──────────────────────
Testing binary_search function...

Array: [1, 3, 5, 7, 9, 11, 13]
Searching for: 7

Found at index: 3 ✓
──────────────────────

Time Complexity: O(log n)
Space Complexity: O(1)
Algorithm: Efficient and working correctly!`);
    } else if (selectedExample.id === 'typescript') {
      setOutput(`✓ TypeScript compiled successfully!

Output:
──────────────────────
UserManager initialized
Adding user: Alice

User added successfully:
{
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  role: "admin"
}

Total users: 1
Admin users: 1
──────────────────────

Type safety: ✓ Ensured
Interfaces: ✓ Implemented correctly`);
    }
  };

  return (
    <div className="code-playground scroll-animate">
      <div className="playground-header">
        <Code size={24} />
        <h3>Code Playground</h3>
      </div>
      
      <div className="playground-tabs">
        {CODE_EXAMPLES.map(example => (
          <button
            key={example.id}
            className={`playground-tab ${selectedExample.id === example.id ? 'active' : ''}`}
            onClick={() => {
              setSelectedExample(example);
              setHasRun(false);
              setOutput('Click "Run Code" to see the output');
            }}
          >
            {example.title}
          </button>
        ))}
      </div>

      <div className="playground-content">
        <div className="code-editor">
          <div className="editor-header">
            <span className="language-badge">{selectedExample.language}</span>
            <button className="run-button" onClick={runCode}>
              <Play size={16} /> Run Code
            </button>
          </div>
          <pre><code>{selectedExample.code}</code></pre>
        </div>
        
        <div className="code-output">
          <div className="output-header">Output</div>
          <pre className={hasRun ? 'output-active' : ''}>{output}</pre>
        </div>
      </div>
    </div>
  );
});

CodePlayground.displayName = 'CodePlayground';

// ==================== CUSTOM HOOKS ====================
const useScrollAnimation = () => {
  useEffect(() => {
    let rafId: number;
    let ticking = false;
    
    const handleScrollAnimation = () => {
      const scrollElements = document.querySelectorAll('.scroll-animate');
      const windowHeight = window.innerHeight;
      const isScrolledToBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100;
      
      scrollElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isInViewport = (rect.top <= windowHeight * 0.9 && rect.bottom >= windowHeight * 0.1) || isScrolledToBottom;
        el.classList.toggle('scroll-visible', isInViewport);
      });
      
      ticking = false;
    };

    const requestScrollTick = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(handleScrollAnimation);
        ticking = true;
      }
    };

    handleScrollAnimation();
    window.addEventListener('scroll', requestScrollTick, { passive: true });
    const timer = setTimeout(handleScrollAnimation, 100);
    
    return () => {
      window.removeEventListener('scroll', requestScrollTick);
      clearTimeout(timer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
};

const useCustomCursor = () => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const hideCursor = () => {
      document.body.style.cursor = 'none';
    };
    
    hideCursor();
    
    let rafId: number;
    let currentX = 0;
    let currentY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      currentX = e.clientX;
      currentY = e.clientY;
      
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          setCursorPos({ x: currentX, y: currentY });
          rafId = 0;
        });
      }
      hideCursor();
    };

    const handleMouseOver = (e: MouseEvent) => {
      hideCursor();
      const target = e.target as HTMLElement;
      setIsHovering(!!(target.closest('button') || target.closest('a')));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return { cursorPos, isHovering };
};

const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Set dark as default
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('portfolio-theme', 'dark');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
  }, [theme]);

  return { theme, toggleTheme };
};

// ==================== MAIN COMPONENT ====================
export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [scrollY, setScrollY] = useState(0);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  
  const { cursorPos, isHovering } = useCustomCursor();
  const { theme, toggleTheme } = useTheme();
  
  useScrollAnimation();

  // Handle scroll - optimized with RAF
  useEffect(() => {
    let rafId: number;
    let ticking = false;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setScrolled(currentScrollY > 50);
      
      const current = NAVIGATION_ITEMS.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
      
      ticking = false;
    };

    const requestScrollTick = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestScrollTick, { passive: true });
    return () => {
      window.removeEventListener('scroll', requestScrollTick);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToSection = useCallback((id: string) => {
    if (id === 'linkedin') {
      handleExternalLink('https://www.linkedin.com/in/mechelle-joe-anand-5406722b3/', 'LinkedIn');
      setIsMenuOpen(false);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  }, []);

  const handleExternalLink = useCallback((url: string, linkName: string) => {
    if (window.confirm(`You are about to leave this site and visit ${linkName}. Continue?`)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  const getTransform = useCallback((delay: number) => {
    const adjustedScroll = Math.max(0, scrollY - delay);
    return Math.min(adjustedScroll * 1.5, 800);
  }, [scrollY]);

  return (
    <>
      <CustomCursor {...cursorPos} isHovering={isHovering} />

      <div className="portfolio-container">
        {/* Navigation */}
        <nav className={`portfolio-nav ${scrolled ? 'scrolled' : ''}`}>
          <div className="nav-content">
            <div className="nav-inner">
              <button onClick={() => scrollToSection('home')} className="nav-logo">
                {scrolled ? 'MECHELLE JOE ANAND' : 'PORTFOLIO'}
              </button>
              
              <div className="nav-desktop">
                {NAVIGATION_ITEMS.map((item) => (
                  <button 
                    key={item} 
                    onClick={() => scrollToSection(item)} 
                    className={`nav-link ${activeSection === item ? 'active' : ''}`}
                    {...(item === 'linkedin' ? { 'data-external': 'true' } : {})}
                  >
                    {item}<span className="nav-link-underline" />
                  </button>
                ))}
                
                <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
              </div>

              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="nav-mobile-toggle">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {isMenuOpen && (
              <div className="nav-mobile">
                {NAVIGATION_ITEMS.filter(item => item !== 'contact').map((item) => (
                  <button key={item} onClick={() => scrollToSection(item)} className="nav-mobile-link">
                    {item}
                  </button>
                ))}
                <button onClick={toggleTheme} className="nav-mobile-link theme-toggle-mobile">
                  {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className="hero-section">
          <div className="hero-bg">
            <div className="hero-orb hero-orb-1"></div>
            <div className="hero-orb hero-orb-2"></div>
          </div>
          
          <div className="hero-content">
            {[
              { text: 'MECHELLE JOE ANAND', className: 'hero-title', delay: 0 },
              { text: 'SOFTWARE DEVELOPER', className: 'hero-subtitle', delay: 50 },
              { text: 'Crafting clean solutions through modern technology and timeless design principles', className: 'hero-description', delay: 100 }
            ].map(({ text, className, delay }) => (
              <div 
                key={delay}
                className="hero-text-wrapper"
                style={{ transform: `translateY(-${getTransform(delay)}px)` }}
              >
                {className === 'hero-title' ? <h1 className={className}>{text}</h1> : <p className={className}>{text}</p>}
              </div>
            ))}
            
            <div className="hero-cta" style={{ transform: `translateY(-${getTransform(150)}px)` }}>
              <button onClick={() => scrollToSection('projects')} className="hero-button">
                View My Implementations<span className="hero-button-arrow">→</span>
              </button>
            </div>
          </div>
        </section>

        <SectionTransition variant="light" />

        {/* About Section */}
        <section id="about" className="about-section scroll-animate">
          <div className="section-container">
            <h2 className="section-title scroll-animate">About Me</h2>
            <div className="about-grid">
              <div className="about-left-column">
                <div className="profile-image-container">
                  <div className="profile-image-wrapper scroll-animate">
                    <img src="/profile2.jpg" alt="Mechelle Joe Anand" className="profile-image" />
                    <div className="profile-image-overlay"></div>
                  </div>
                </div>
                
                <p className="scroll-animate" id="para1">As a Software Developer driven by curiosity and a relentless pursuit of excellence, I approach every project as both a craft and a challenge. I see software development as a disciplined art, where elegant architecture meets innovative solutions to solve real-world problems.</p>
                <p className="scroll-animate">I combine deep technical expertise with a keen sense of design, ensuring that every system I build is robust, maintainable, and straightforward. To me, great software is timeless: it is resilient, scalable, and thoughtfully constructed, yet adaptable to the ever-evolving demands of technology.</p>
                <p className="scroll-animate">I am passionate about creating solutions that are both powerful and meaningful, blending classical principles of structure and logic with the possibilities of modern innovation. <span className="deco">Every line of code I write reflects this vision — a commitment to quality, creativity, and enduring impact.</span></p>
              </div>

              <div className="education-card scroll-animate">
                <h3 className="education-title education-section-heading">Education</h3>
                <p className="education-degree">Diploma in Software Support</p>
                <p className="education-details">Mohawk College • Jan 2024 - Dec 2025</p>
                <p className="education-coursework">Software Development • IT Support • System Administration</p>

                <br />

                <h3 className="education-title education-section-heading">Certifications</h3>
                {[
                  { title: 'Data Analysis with Python', org: 'IBM • 2024', url: 'https://courses.cognitiveclass.ai/certificates/7d8f399f612c44319827ac136953558e' },
                  { title: 'Applied Machine Learning', org: 'LinkedIn • 2025', url: 'https://www.linkedin.com/learning/certificates/d05d6ca5b54fe68a3747875fdafe48a0e32f0cadc0884060cdd439fca115eb83' },
                  { title: 'Node.js Essential Training', org: 'LinkedIn • 2026', url: 'https://www.linkedin.com/learning/certificates/32238d03e4671bd6cf1ed4d7ca0f30b9b0b495f01bfb486a20c6234c3c2ae545' },
                  { title: 'Java: Testing with JUnit', org: 'LinkedIn • 2026', url: 'https://www.linkedin.com/learning/certificates/7344773a0767a04b5af51394dd71e77fc2353a10d92b81beae0113c414fe7f8a' }
                ].map((cert) => (
                  <React.Fragment key={cert.title}>
                    <p className="education-degree">{cert.title}</p>
                    <p className="education-details">{cert.org}</p>
                    <button onClick={() => handleExternalLink(cert.url, `${cert.org.split('•')[0].trim()} Credential`)} className="education-link">
                      View Credential<span className="button-arrow">→</span>
                    </button>
                  </React.Fragment>
                ))}

                <br />
                <button onClick={() => handleExternalLink('https://www.linkedin.com/in/mechelle-joe-anand-5406722b3/details/certifications/', 'LinkedIn Certifications Page')} className="more-link">
                  View more certifications on LinkedIn
                </button>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition variant="dark" />

        {/* Skills Section */}
        <section id="skills" className="skills-section scroll-animate">
          <div className="skills-bg">
            {[1, 2, 3].map(i => <div key={i} className={`skills-wave skills-wave-${i}`} />)}
          </div>
          <div className="section-container-wide">
            <h2 className="section-title scroll-animate">Technical Expertise</h2>
            <div className="skills-grid">
              {SKILLS_DATA.map((skillSet) => (
                <div key={skillSet.category} className="skill-card scroll-animate">
                  <h3 className="skill-category">{skillSet.category}</h3>
                  <ul className="skill-list">
                    {skillSet.items.map((skill) => <li key={skill} className="skill-item">{skill}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SectionTransition variant="light" />

        {/* Projects Section */}
        <section id="projects" className="projects-section scroll-animate">
          <div className="section-container-wide">
            <h2 className="section-title scroll-animate">Technical Achievements</h2>
            <div className="projects-container">
              {PROJECTS_DATA.map((project, index) => (
                <article 
                  key={project.title} 
                  className={`project-card scroll-animate ${expandedProject === index ? 'expanded' : ''}`}
                  onMouseEnter={() => setExpandedProject(index)}
                  onMouseLeave={() => setExpandedProject(null)}
                >
                  <div className="project-header">
                    <h3 className="project-title">{project.title}</h3>
                    <button onClick={() => handleExternalLink(project.link, project.title)} className="project-link">
                      View Project<ExternalLink size={16} className="project-link-icon" />
                    </button>
                  </div>
                  <p className="project-description">{project.description}</p>
                  
                  <div className={`project-extended-info ${expandedProject === index ? 'visible' : ''}`}>
                    <p>{project.extendedInfo}</p>
                  </div>
                  
                  <div className="project-tech">
                    {project.tech.map((tech) => <span key={tech} className="tech-badge">{tech}</span>)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SectionTransition variant="dark" />

        {/* Code Playground Section */}
        <section id="playground" className="playground-section">
          <div className="section-container-wide">
            <h2 className="section-title scroll-animate">Code Playground</h2>
            <CodePlayground />
          </div>
        </section>

        <SectionTransition variant="light" />

        {/* Footer */}
        <footer className="footer scroll-animate" id="contact">
          <div className="footer-orb footer-orb-1"></div>
          <div className="footer-orb footer-orb-2"></div>
          <div className="footer-content">
            <div className="footer-grid">
              <div className="scroll-animate">
                <h3 className="footer-heading">QUICK LINKS</h3>
                <nav>
                  <ul className="footer-links">
                    {['Home', 'About', 'Skills', 'Projects', 'Playground'].map((item) => (
                      <li key={item}>
                        <button onClick={() => scrollToSection(item.toLowerCase())} className="footer-link">{item}</button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              
              <div className="scroll-animate">
                <h3 className="footer-heading">CONTACT</h3>
                <nav>
                  <ul className="footer-links">
                    <li>
                      <button onClick={() => handleExternalLink('mailto:m.joeanand@gmail.com', 'your Email')} className="footer-link">
                        m.joeanand@gmail.com
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleExternalLink('tel:+19059619856', 'call')} className="footer-link">
                        +1 (905) 961 9856
                      </button>
                    </li>
                    <li>
                      <button className="footer-link" style={{ cursor: 'default' }}>Hamilton, ON</button>
                    </li>
                  </ul>
                </nav>
              </div>
              
              <div className="scroll-animate">
                <h3 className="footer-heading">CONNECT</h3>
                <div className="footer-social">
                  <button onClick={() => handleExternalLink('https://github.com/mcheljoe', 'GitHub')} className="social-link"><Github size={24} /></button>
                  <button onClick={() => handleExternalLink('https://www.linkedin.com/in/mechelle-joe-anand-5406722b3/', 'LinkedIn')} className="social-link"><Linkedin size={24} /></button>
                  <button onClick={() => handleExternalLink('mailto:m.joeanand@gmail.com', 'Email')} className="social-link"><Mail size={24} /></button>
                </div>
              </div>
            </div>
            
            <div className="footer-bottom">
              <p>© {new Date().getFullYear()} Mechelle Joe Anand. All rights reserved.</p>
              <p className='footer-bottom-tech'>Built with Next.js •  {theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />} {theme} mode</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}