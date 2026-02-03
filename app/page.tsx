'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Github, Linkedin, Mail, ExternalLink, Menu, X, Moon, Sun, Download } from 'lucide-react';
import './portfolio.css';

// ==================== CONSTANTS ====================
const NAVIGATION_ITEMS = ['home', 'about', 'skills', 'projects', 'linkedin', 'contact'] as const;

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
    screenshots: ['/taskflow-screenshot.png', '/taskflow-dashboard.png'],
    extendedInfo: 'Features include drag-and-drop task prioritization, category filtering, and a clean, intuitive interface designed for productivity. The app demonstrates proficiency in React state management and modern web development practices.'
  }
] as const;

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
      
      <div className="transition-floating-elements">
        {[...Array(40)].map((_, i) => (
          <div key={`transition-dot-${i}`} className={`floating-dot floating-dot-${i + 1}`}></div>
        ))}
      </div>
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
        transform: isHovering ? 'translate(-50%, -50%) scale(1.8)' : 'translate(-50%, -50%) scale(1)',
      }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        {isHovering ? (
          // Filled arrow for hover state - more prominent
          <>
            <path d="M5 5L12.57 23.47L15.29 15.29L23.47 12.57L5 5Z" 
                  fill="#7A1E35" 
                  stroke="#932841" 
                  strokeWidth="2" 
                  strokeLinejoin="round" 
                  strokeLinecap="round" 
            />
            <circle cx="16" cy="16" r="2" fill="#932841" opacity="0.6" />
          </>
        ) : (
          // Regular arrow
          <>
            <path d="M5 5L12.57 23.47L15.29 15.29L23.47 12.57L5 5Z" fill="none" stroke="#A89F91" strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round" />
            <path d="M5 5L12.57 23.47L15.29 15.29L23.47 12.57L5 5Z" fill="#7A1E35" stroke="#932841" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
          </>
        )}
      </svg>
    </div>
  </>
));

CustomCursor.displayName = 'CustomCursor';

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
    // Hide cursor immediately on mount - don't wait for mouse move
    const hideCursorImmediately = () => {
      document.body.style.cursor = 'none';
      document.documentElement.style.cursor = 'none';
      document.body.classList.add('custom-cursor-active');
      document.documentElement.classList.add('custom-cursor-active');
      
      // Remove existing style tag if present
      const existingStyle = document.getElementById('custom-cursor-override');
      if (existingStyle) {
        existingStyle.remove();
      }
      
      // Inject global cursor override styles
      const styleSheet = document.createElement('style');
      styleSheet.id = 'custom-cursor-override';
      styleSheet.textContent = `
        *, *::before, *::after, 
        html, body, div, span, button, a, input, textarea, select,
        [role="button"], [onclick], label {
          cursor: none !important;
        }
        body, html {
          cursor: none !important;
        }
      `;
      document.head.insertBefore(styleSheet, document.head.firstChild);
    };
    
    // Call immediately on mount
    hideCursorImmediately();
    
    // Also hide on visibility change (when user returns to tab)
    document.addEventListener('visibilitychange', hideCursorImmediately);
    
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
      hideCursorImmediately();
    };

    const handleMouseOver = (e: MouseEvent) => {
      hideCursorImmediately();
      const target = e.target as HTMLElement;
      // Check for interactive elements including elements with click handlers
      const isInteractive = !!(
        target.closest('button') || 
        target.closest('a') || 
        target.closest('[role="button"]') ||
        target.closest('[onclick]') ||
        target.closest('.nav-link') ||
        target.closest('.hero-button') ||
        target.closest('.social-link') ||
        target.closest('.project-link') ||
        target.closest('.education-link') ||
        target.closest('.footer-link') ||
        target.closest('.more-link') ||
        target.closest('.theme-toggle') ||
        target.closest('.nav-logo') ||
        target.closest('.nav-mobile-link') ||
        target.closest('.project-card') ||
        target.closest('.hero-button-secondary')
      );
      setIsHovering(isInteractive);
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isLeavingInteractive = !!(
        target.closest('button') || 
        target.closest('a') || 
        target.closest('[role="button"]') ||
        target.closest('[onclick]') ||
        target.closest('.nav-link') ||
        target.closest('.hero-button') ||
        target.closest('.social-link') ||
        target.closest('.project-link') ||
        target.closest('.education-link') ||
        target.closest('.footer-link') ||
        target.closest('.more-link') ||
        target.closest('.theme-toggle') ||
        target.closest('.nav-logo') ||
        target.closest('.nav-mobile-link') ||
        target.closest('.project-card') ||
        target.closest('.hero-button-secondary')
      );
      if (isLeavingInteractive) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mouseout', handleMouseOut, { passive: true });
    document.addEventListener('mouseenter', hideCursorImmediately);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mouseenter', hideCursorImmediately);
      document.removeEventListener('visibilitychange', hideCursorImmediately);
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
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  }, []);

  const handleExternalLink = useCallback((url: string, linkName: string) => {
    if (window.confirm(`You are about to leave this site and visit ${linkName}. Continue?`)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  const handleDownloadResume = useCallback(() => {
    const resumeUrl = '/resume.pdf';
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'Mechelle_Joe_Anand_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <>
                <div className="nav-mobile-overlay" onClick={() => setIsMenuOpen(false)}></div>
                <div className="nav-mobile">
                  {NAVIGATION_ITEMS.filter(item => item !== 'contact').map((item) => (
                    <button key={item} onClick={() => scrollToSection(item)} className="nav-mobile-link">
                      {item}
                    </button>
                  ))}
                  <button onClick={toggleTheme} className="nav-mobile-link theme-toggle-mobile">
                    {theme === 'light' ? (
                      <>
                        <Moon size={20} />
                        <span>Dark Mode</span>
                      </>
                    ) : (
                      <>
                        <Sun size={20} />
                        <span>Light Mode</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className="hero-section">
          <div className="hero-bg">
            <div className="hero-orb hero-orb-1"></div>
            <div className="hero-orb hero-orb-2"></div>
            
            <div className="hero-floating-elements">
              {[...Array(40)].map((_, i) => (
                <div key={`dot-${i}`} className={`floating-dot floating-dot-${i + 1}`}></div>
              ))}
              
              {[...Array(8)].map((_, i) => (
                <div key={`shape-${i}`} className={`floating-shape floating-shape-${i + 1}`}></div>
              ))}
            </div>
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
                
                <p className="scroll-animate">As a Software Developer driven by curiosity and a relentless pursuit of excellence, I approach every project as both a craft and a challenge. I see software development as a disciplined art, where elegant architecture meets innovative solutions to solve real-world problems.</p>
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
                    <div className="project-header-buttons">
                      <button onClick={() => handleExternalLink(project.link, project.title)} className="project-link">
                        View Project<ExternalLink size={16} className="project-link-icon" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Screenshots appear on hover */}
                  {project.screenshots && expandedProject === index && (
                    <div className="project-screenshots-grid">
                      {project.screenshots.map((screenshot, imgIndex) => (
                        <div key={imgIndex} className="project-screenshot-container">
                          <img 
                            src={screenshot} 
                            alt={`${project.title} screenshot ${imgIndex + 1}`} 
                            className="project-screenshot"
                            loading="eager"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
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

        <SectionTransition variant="light" />

        {/* Footer */}
        <footer className="footer scroll-animate" id="contact">
          <div className="footer-orb footer-orb-1"></div>
          <div className="footer-orb footer-orb-2"></div>
          
          <div className="footer-floating-elements">
            {[...Array(40)].map((_, i) => (
              <div key={`footer-dot-${i}`} className={`floating-dot floating-dot-${i + 1}`}></div>
            ))}
            
            {[...Array(8)].map((_, i) => (
              <div key={`footer-shape-${i}`} className={`floating-shape floating-shape-${i + 1}`}></div>
            ))}
          </div>
          
          <div className="footer-content">
            <div className="footer-grid">
              <div className="scroll-animate">
                <h3 className="footer-heading">QUICK LINKS</h3>
                <nav>
                  <ul className="footer-links">
                    {['Home', 'About', 'Skills', 'Projects'].map((item) => (
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
                      <p className="footer-addy-link" style={{ cursor: 'default' }}>Hamilton, ON</p>
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
              <p className='footer-bottom-tech'>
                Built with Next.js • <span className="footer-theme-indicator">{theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />} {theme} mode</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}