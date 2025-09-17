"use client";

import SocialMedia from "@/components/SocialMedia";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimateIn } from "@/components/animations/AnimateIn";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { track } from "@vercel/analytics";
import { ExternalLink } from "lucide-react";

export default function Home() {
  return (
    <main className="text-zinc-900 dark:text-zinc-100 max-w-xl mx-auto px-4 py-4 mt-16">
      <AnimateIn variant="fadeUp">
        <section className="mb-6">
          <AnimateIn variant="fadeUp" delay={0.2}>
            <h1 className="text-xl font-medium tracking-tight mb-4 flex items-baseline justify-between">
              <span>Hey, I&apos;m Ankush</span>
              <ThemeToggle />
            </h1>
          </AnimateIn>
          <AnimateIn variant="fadeUp" delay={0.4}>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mb-8">
              Computer Engineer student from India. Open to work. Contact me below.
              {/* Currently building{" "}
              <a
                href="https://0.email"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-900 dark:text-zinc-100 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                onClick={() => track("zero_email_clicked")}
              >
                Zero
              </a>{" "}
              and{" "}
              <a
                href="https://oss.now"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-900 dark:text-zinc-100 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                onClick={() => track("oss.now_clicked")}
              >
                oss.now
              </a>
              . */}
            </p>
          </AnimateIn>

          <AnimateIn variant="fadeUp" delay={0.6}>
            <div className="flex items-center gap-5">
              <SocialMedia />
            </div>
          </AnimateIn>
        </section>
      </AnimateIn>

      <Tabs defaultValue="projects">
        <AnimateIn variant="fadeUp" delay={0.2}>
          <TabsList className="mb-4 border-none bg-transparent p-0 -ml-[8px]">
            <TabsTrigger value="projects" className="!bg-transparent !border-none !shadow-none">
              Projects
            </TabsTrigger>
            <TabsTrigger value="experience" className="!bg-transparent !border-none !shadow-none">
              Experience
            </TabsTrigger>
            <TabsTrigger value="extracurricular" className="!bg-transparent !border-none !shadow-none">
              Extracurricular
            </TabsTrigger>
          </TabsList>
        </AnimateIn>

        <TabsContent value="projects">
          <AnimateIn variant="fadeUp" delay={0}>
            <section className="mb-12">
              <div className="space-y-8">
                <ul className="space-y-8">
                  {projects.map((project, index) => {
                    const delay = 0.1 + index * 0.1;
                    return (
                      <AnimateIn key={index} variant="fadeLeft" delay={delay}>
                        <li className="group hover:translate-x-1 transition-all duration-300 ease-out">
                          <div className="flex items-baseline justify-between mb-1">
                            <h3 className="text-md font-medium">{project.title}</h3>
                            <div className="flex flex-row gap-2">
                              {project.github ? (
                                <a
                                  href={project.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                  onClick={() => track(`${project.title}_github_clicked`)}
                                >
                                  GitHub <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : null}
                              {/* {project.link ? (
                                <a
                                  href={project.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                  onClick={() => track(`${project.title}_clicked`)}
                                >
                                  View <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : null} */}
                            </div>
                          </div>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">{project.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, techIndex) => (
                              <span key={techIndex} className="text-xs text-zinc-400 dark:text-zinc-500">
                                {tech}
                                {techIndex < project.technologies.length - 1 ? " /" : ""}
                              </span>
                            ))}
                          </div>
                        </li>
                      </AnimateIn>
                    );
                  })}
                </ul>
              </div>
            </section>
          </AnimateIn>
        </TabsContent>

        <TabsContent value="experience">
          <AnimateIn variant="fadeUp" delay={0}>
            <section className="mb-12">
              <div className="space-y-8">
                <ul className="space-y-8">
                  {experience.map((job, index) => {
                    const delay = 0.1 + index * 0.1;
                    return (
                      <AnimateIn key={index} variant="fadeLeft" delay={delay}>
                        <li className="group hover:translate-x-1 transition-all duration-300 ease-out">
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                            <h3 className="text-md font-medium">
                              {job.role} {job.role.toLowerCase().includes("freelance") ? "" : "at"} {job.company}
                            </h3>
                            <span className="text-xs text-zinc-400 dark:text-zinc-500">{job.period}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                          {job.github ? (
                            <a
                              href={job.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                              onClick={() => track(`${job.role}_github_clicked`)}
                            >
                              GitHub <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : null}
                          {job.link ? (
                            <a
                              href={job.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                              onClick={() => track(`${job.company}_clicked`)}
                            >
                              View <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : null}
                          </div>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">{job.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {job.technologies.map((tech, techIndex) => (
                              <span key={techIndex} className="text-xs text-zinc-400 dark:text-zinc-500">
                                {tech}
                                {techIndex < job.technologies.length - 1 ? " /" : ""}
                              </span>
                            ))}
                          </div>
                        </li>
                      </AnimateIn>
                    );
                  })}
                </ul>
              </div>
            </section>
          </AnimateIn>
        </TabsContent>

        <TabsContent value="extracurricular">
          <AnimateIn variant="fadeUp" delay={0}>
            <section className="mb-12">
              <div className="space-y-8">
                <ul className="space-y-8">
                  {extracurricular.map((job, index) => {
                    const delay = 0.1 + index * 0.1;
                    return (
                      <AnimateIn key={index} variant="fadeLeft" delay={delay}>
                        <li className="group hover:translate-x-1 transition-all duration-300 ease-out">
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                            <h3 className="text-md font-medium">
                              {job.role} {job.role.toLowerCase().includes("freelance") ? "" : "at"} {job.company}
                            </h3>
                            <span className="text-xs text-zinc-400 dark:text-zinc-500">{job.period}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                          {job.link ? (
                            <a
                              href={job.link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                              onClick={() => track(`${job.company}_clicked`)}
                            >
                              View ({job.link.label}) <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : null}
                          {job.extraLink ? (
                                <a
                                  href={job.extraLink.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                  onClick={() => track(`${job.extraLink.label}_clicked`)}
                                >
                                  View ({job.extraLink.label}) <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : null}
                          </div>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">{job.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {job.technologies.map((tech, techIndex) => (
                              <span key={techIndex} className="text-xs text-zinc-400 dark:text-zinc-500">
                                {tech}
                                {techIndex < job.technologies.length - 1 ? " /" : ""}
                              </span>
                            ))}
                          </div>
                        </li>
                      </AnimateIn>
                    );
                  })}
                </ul>
              </div>
            </section>
          </AnimateIn>
        </TabsContent>
      </Tabs>

      <AnimateIn variant="fadeUp" delay={0.8}>
        <footer className="pt-4 text-xs text-zinc-400 dark:text-zinc-500 flex justify-between items-center">
          <div>Ankush Kapoor</div>
          <div>Built with Next.js</div>
        </footer>
      </AnimateIn>
    </main>
  );
}

const projects = [
  {
    title: "KapoorVM",
    description: "A 16-bit virtual CPU built from scratch in C with custom opcodes and 65 KB of virtual memory.",
    // link: "https://github.com/ankushhKapoor/KapoorVM",
    github: "https://github.com/ankushhKapoor/KapoorVM",
    technologies: ["C", "Linux", "GCC", "Git"],
  },
  {
    title: "Alloc",
    description: "A custom memory allocator mimicking malloc/free with secure deallocation and debugger tools.",
    // link: "https://github.com/ankushhKapoor/alloc",
    github: "https://github.com/ankushhKapoor/alloc",
    technologies: ["C", "Linux", "NASM", "GCC"],
  },
  {
    title: "CodeNexus",
    description: "A Python-based code editor with syntax highlighting, autocomplete, and integrated CMD runner.",
    // link: "https://github.com/ankushhKapoor/CodeNexus",
    github: "https://github.com/ankushhKapoor/CodeNexus-Custom-Python-Editor-IDE",
    technologies: ["Python", "PyQt5", "QScintilla", "Jedi"],
  },
  {
    title: "Email Unsubscriber",
    description: "A tool to automatically unsubscribe from emails by scanning inbox and visiting unsubscribe links.",
    // link: "https://github.com/ankushhKapoor/email-unsubscriber",
    github: "https://github.com/ankushhKapoor/Python-Email-Auto-Unsubscriber",
    technologies: ["Python", "IMAP", "SMTP", "BeautifulSoup", "requests"],
  },
  {
  title: "AI Flappy Bird",
  description: "A NEAT-powered Flappy Bird game where AI birds learn to play by evolving neural networks through generations.",
  // link: "https://github.com/ankushhKapoor/flappy-bird-ai",
  github: "https://github.com/ankushhKapoor/Flappy-Bird-AI",
  technologies: ["Python", "Pygame", "NEAT", "OOP"],
  },
  {
  title: "Chess Game",
  description: "An offline player-vs-player chess game built with Pygame, featuring move validation, themes, pawn promotion, castling, and en passant.",
  // link: "https://github.com/ankushhKapoor/python-chess",
  github: "https://github.com/ankushhKapoor/Chess-Python",
  technologies: ["Python", "Pygame", "OOP"],
  },
];

const experience = [
  {
    role: "Open Source Contributor",
    company: "Holidays Framework",
    period: "Jan 2025 – June 2025",
    link: "https://pypi.org/project/holidays/",
    github: "https://github.com/vacanza/holidays/pulls/ankushhKapoor",
    description: "Contributed to the Open World Holidays Framework — a Python-based library — by adding public holidays for India, Nepal, and Mongolia, including static, lunisolar, optional, and workday-based observances.",
    technologies: ["Python", "Git", "GitHub", "Data Processing", "Open Source Collaboration"],
  },
];

const extracurricular = [
  {
    role: "Core Team Member",
    company: "Our Tech Community (OTC)",
    period: "Jul 2025 – Present",
    link: {
      label: "OTC Wesbite",
      url: "https://ourtech.community",
    },
    extraLink: {
      label: "Catchup",
      url: "https://catchup.ourtech.community/",
    },
    description:
      "As part of the OTC core team, I contribute to overseeing flagship initiatives such as CatchUps, Talks, and organizational operations, driving collaboration within the tech community.",
    technologies: ["Community Building", "Event Organization", "Technical Communication", "Team Collaboration"],
  },
];