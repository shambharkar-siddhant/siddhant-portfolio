import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Code, 
  Server, 
  Briefcase, 
  GraduationCap, 
  Coffee, 
  Mail, 
  Phone, 
  Linkedin, 
  Award, 
  ChevronRight, 
  Cpu, 
  Layers, 
  Globe,
  Database,
  Terminal,
  Workflow,
  GitBranch,
  Wrench,
  User,
  MessageSquare,
  TrendingUp,
  GitCommit,
  ShieldCheck
} from 'lucide-react';

const DeveloperProfile: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('about');
  
  const technologies = [
    { name: 'Python', level: 95, icon: <Terminal className="h-4 w-4" /> },
    { name: 'JavaScript/Node.js', level: 90, icon: <Globe className="h-4 w-4" /> },
    { name: 'React', level: 85, icon: <Layers className="h-4 w-4" /> },
    { name: 'SQL/NoSQL', level: 90, icon: <Database className="h-4 w-4" /> },
    { name: 'C/C++', level: 80, icon: <Cpu className="h-4 w-4" /> },
    { name: 'AWS', level: 85, icon: <Server className="h-4 w-4" /> },
    { name: 'Flask/Falcon', level: 90, icon: <Workflow className="h-4 w-4" /> },
    { name: 'Socket Programming', level: 85, icon: <MessageSquare className="h-4 w-4" /> },
    { name: 'Git/Version Control', level: 85, icon: <GitBranch className="h-4 w-4" /> },
    { name: 'Machine Learning', level: 80, icon: <TrendingUp className="h-4 w-4" /> },
    { name: 'Cyber Security', level: 75, icon: <ShieldCheck className="h-4 w-4" /> }
  ];
  
  const additionalTools = [
    'OpenCV', 'PyTorch', 'FastAPI', 'Kafka', 'Redis', 'Nginx', 'Postman', 
    'Docker', 'LaTeX', 'VS Code', 'Vim', 'BERT'
  ];
  
  const workExperience = [
    {
      title: 'Backend Developer',
      company: 'Aparoksha Financial Services Private Limited',
      location: 'Bengaluru, Karnataka',
      period: 'May 2024 - Present',
      achievements: [
        'Created an efficient loan processing system for two-wheelers using Python and Falcon, which cut transaction times by 30% and improved system security.',
        'Developed a scalable integration pipeline with Bash and Python across distributed platforms, which doubled the rate of new lender additions and greatly enhanced business scalability.',
        'Guided a team in building a de-duplication server to combat loan fraud, leading to an 80% reduction in duplicate applications and significantly strengthening data integrity.'
      ]
    },
    {
      title: 'Full-Stack Developer',
      company: 'Expert Script Soft-Solutions',
      location: 'Sambhajinagar, Maharashtra',
      period: 'June 2020 - June 2022',
      achievements: [
        'Created a product recommendation system using React and Machine learning, resulting in a 20% increase in user engagement.',
        'Built a robust Node.js backend that can manage more than a million transactions per day across distributed systems, enhancing transaction speed and system responsiveness.',
        'Achieved 99.9% system reliability and uptime by integrating Apache Kafka for efficient real-time data synchronization and inter-service communication.'
      ]
    }
  ];
  
  const education = [
    {
      degree: 'Master of Technology in Computer Science',
      institution: 'IIT Kharagpur',
      period: 'August 2022 - May 2024',
      gpa: '8.02',
      courses: ['Algorithm Analysis', 'Computer Networks', 'Operating System', 'Computer Vision', 'DBMS', 'Image Processing']
    },
    {
      degree: 'Bachelor of Engineering in Information Technology',
      institution: 'MIT College of Engineering, Pune',
      period: 'August 2017 - May 2020',
      gpa: '6.99',
    },
    {
      degree: 'Diploma in Information Technology',
      institution: 'Government Institute of Polytechnic, Aurangabad',
      period: 'August 2014 - May 2017',
      gpa: '7.8',
    }
  ];
  
  const projects = [
    {
      name: 'Chat Application with Abusive Text Detection',
      date: 'February 2023',
      description: [
        'Constructed a CLI-based chat app using socket programming with real-time abusive text detection, enhancing user safety with 85% accuracy.',
        'Integrated non-blocking calls for improved concurrency, supporting private messaging, group chat, and broadcast features.',
        'Tuned a multilingual BERT model (mBERT) to enhance context-sensitive language understanding, enabling effective moderation across diverse linguistic environments.'
      ],
      tech: ['Python', 'Socket Programming', 'BERT', 'Machine Learning', 'NLP'],
      icon: <MessageSquare />
    },
    {
      name: 'Predictive StockTrader: AI-Driven Market Investment Platform',
      date: 'April 2023',
      description: [
        'Developed an AI-powered web application for stock investment using Flask and LSTM models, reaching a prediction accuracy of 90%.',
        'Implemented a dynamic algorithm for daily portfolio adjustments to optimize ROI based on historical market analysis.',
        'Utilized PostgreSQL for secure transaction processing, ensuring robust and scalable management of financial data.'
      ],
      tech: ['Python', 'Flask', 'LSTM', 'RNN', 'PostgreSQL', 'Web Development'],
      icon: <TrendingUp />
    },
    {
      name: 'Network Architecture Search(NAS) using Meta Heuristic Algorithms',
      date: 'January 2021',
      description: [
        'Addressed the need of automated NAS by utilizing population based meta-heuristic algorithms for optimization.',
        'Constructed a specialized algorithm for architecture search, employing population creation, crossover, and mutation.',
        'Utilized multiprocessing for parallelization, leading to 20% reduction in search time and 80% model accuracy.'
      ],
      tech: ['Python', 'Neural Networks', 'Optimization Algorithms', 'Multiprocessing'],
      icon: <Workflow />
    },
    {
      name: 'Fake Face Detection using Haar Feature Extractor',
      date: 'February 2023',
      description: [
        'Developed Python script for image pre-processing, variance thresholding, and feature extraction.',
        'Implemented Haar feature extraction for simple computation, adaptability to different object sizes and robustness.',
        'Trained AdaBoost and Random Forest models on 1000+ real and fake face images, achieving 85-87% accuracy.'
      ],
      tech: ['Python', 'OpenCV', 'Machine Learning', 'Computer Vision', 'AdaBoost', 'Random Forest'],
      icon: <User />
    }
  ];
  
  const achievements = [
    'Earned victory in the Capture the Flag (CTF) Challenge organized by CloudSEK company',
    'Organized "Innovating Technologies" Inter-College paper presentation competition with 35 participants',
    'Served as Students Coordinator at MMM Hall, IIT Kharagpur organizing technical workshops and events',
    'Secured first prize among 47 participants in the Solo Dance competition at "Gracia-2018" cultural fest'
  ];
  
  const contactInfo = {
    email: 'shambharkarsiddhant0698@gmail.com',
    phone: '+918149600848',
    linkedin: 'linkedin.com/in/siddhant-shambharkar'
  };
  
  return (
    <div className="space-y-8 mb-16">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-3/4 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl font-bold">Siddhant Shambharkar</CardTitle>
                  <CardDescription className="text-lg">
                    Software Developer
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="text-sm">{contactInfo.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="text-sm">{contactInfo.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Linkedin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{contactInfo.linkedin}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Accomplished Software Engineer holding a Master's degree in Computer Science from IIT
                Kharagpur, with a focus on full-stack development. I have significant experience in Python, JavaScript, and cloud
                infrastructure. I have a proven ability to deploy scalable applications and thrive in high-pressure situations, using
                my strong technical skills to tackle complex problems and drive business innovation.
              </p>
              
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid grid-cols-5 mb-6">
                  <TabsTrigger value="about" onClick={() => setSelectedTab('about')}>
                    <User className="h-4 w-4 mr-2 md:mr-0 lg:mr-2" />
                    <span className="hidden md:inline-block">About</span>
                  </TabsTrigger>
                  <TabsTrigger value="skills" onClick={() => setSelectedTab('skills')}>
                    <Code className="h-4 w-4 mr-2 md:mr-0 lg:mr-2" />
                    <span className="hidden md:inline-block">Skills</span>
                  </TabsTrigger>
                  <TabsTrigger value="experience" onClick={() => setSelectedTab('experience')}>
                    <Briefcase className="h-4 w-4 mr-2 md:mr-0 lg:mr-2" />
                    <span className="hidden md:inline-block">Experience</span>
                  </TabsTrigger>
                  <TabsTrigger value="education" onClick={() => setSelectedTab('education')}>
                    <GraduationCap className="h-4 w-4 mr-2 md:mr-0 lg:mr-2" />
                    <span className="hidden md:inline-block">Education</span>
                  </TabsTrigger>
                  <TabsTrigger value="projects" onClick={() => setSelectedTab('projects')}>
                    <GitCommit className="h-4 w-4 mr-2 md:mr-0 lg:mr-2" />
                    <span className="hidden md:inline-block">Projects</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Award className="h-5 w-5 mr-2" /> 
                      Achievements & Activities
                    </h3>
                    <ul className="space-y-2">
                      {achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start">
                          <ChevronRight className="h-5 w-5 mr-2 flex-shrink-0 text-primary" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Coffee className="h-5 w-5 mr-2" /> 
                      Hobbies & Interests
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {['Dancing', 'Trekking', 'Reading', 'Swimming'].map((hobby, index) => (
                        <Badge key={index} variant="secondary">{hobby}</Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="skills" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Wrench className="h-5 w-5 mr-2" /> 
                      Technical Skills
                    </h3>
                    <div className="space-y-4">
                      {technologies.map((tech, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              {tech.icon}
                              <span className="ml-2 font-medium">{tech.name}</span>
                            </div>
                            <span className="text-sm">{tech.level}%</span>
                          </div>
                          <Progress value={tech.level} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Terminal className="h-5 w-5 mr-2" /> 
                      Additional Tools & Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {additionalTools.map((tool, index) => (
                        <Badge key={index} variant="outline">{tool}</Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="experience" className="space-y-6">
                  {workExperience.map((exp, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold">{exp.title}</h3>
                          <div className="text-primary font-medium">{exp.company}</div>
                          <div className="text-sm text-muted-foreground">{exp.location}</div>
                        </div>
                        <Badge variant="outline">{exp.period}</Badge>
                      </div>
                      
                      <div className="mt-3 space-y-2">
                        {exp.achievements.map((achievement, i) => (
                          <div key={i} className="flex items-start">
                            <ChevronRight className="h-5 w-5 mr-2 flex-shrink-0 text-primary mt-0.5" />
                            <span>{achievement}</span>
                          </div>
                        ))}
                      </div>
                      
                      {index < workExperience.length - 1 && (
                        <Separator className="mt-6" />
                      )}
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="education" className="space-y-6">
                  {education.map((edu, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold">{edu.degree}</h3>
                          <div className="text-primary font-medium">{edu.institution}</div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{edu.period}</Badge>
                          <div className="text-sm font-medium mt-1">CGPA: {edu.gpa}</div>
                        </div>
                      </div>
                      
                      {edu.courses && (
                        <div className="mt-3">
                          <div className="text-sm font-medium mb-2">Relevant Coursework</div>
                          <div className="flex flex-wrap gap-2">
                            {edu.courses.map((course, i) => (
                              <Badge key={i} variant="secondary">{course}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {index < education.length - 1 && (
                        <Separator className="mt-6" />
                      )}
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="projects" className="space-y-6">
                  {projects.map((project, index) => (
                    <Card key={index} className="mb-6 last:mb-0 border-l-4 border-l-primary">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="bg-primary/10 p-2 rounded-full mr-3">
                              {React.cloneElement(project.icon, { className: "h-5 w-5 text-primary" })}
                            </div>
                            <CardTitle>{project.name}</CardTitle>
                          </div>
                          <Badge variant="outline">{project.date}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-3">
                          {project.description.map((desc, i) => (
                            <div key={i} className="flex items-start">
                              <ChevronRight className="h-5 w-5 mr-2 flex-shrink-0 text-primary mt-0.5" />
                              <span>{desc}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-4">
                          {project.tech.map((tech, i) => (
                            <Badge key={i} variant="secondary">{tech}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Side information - visible on desktop, hidden on mobile */}
        <div className="w-full md:w-1/4 space-y-6 hidden md:block">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Featured Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {technologies.slice(0, 6).map((tech, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {tech.icon}
                      <span className="ml-2 text-sm font-medium">{tech.name}</span>
                    </div>
                  </div>
                  <Progress value={tech.level} className="h-1" />
                </div>
              ))}
              
              <div className="pt-2">
                <button 
                  className="text-sm text-primary font-medium flex items-center"
                  onClick={() => setSelectedTab('skills')}
                >
                  View all skills
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Latest Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.slice(0, 3).map((project, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center">
                    {React.cloneElement(project.icon, { className: "h-4 w-4 text-primary mr-2" })}
                    <span className="font-medium">{project.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{project.tech.slice(0, 3).join(', ')}</p>
                </div>
              ))}
              
              <div className="pt-2">
                <button 
                  className="text-sm text-primary font-medium flex items-center"
                  onClick={() => setSelectedTab('projects')}
                >
                  View all projects
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="space-y-1">
                  <div className="font-medium">{edu.institution}</div>
                  <p className="text-xs text-muted-foreground">{edu.degree}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeveloperProfile;