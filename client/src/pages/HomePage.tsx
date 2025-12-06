import React, { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Server, Terminal, Code, ArrowDown, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import avatarImage from "@assets/ChatGPT Image Apr 10, 2025, 08_54_14 PM-Photoroom.png";

interface SectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
  align?: "left" | "right";
  index: number;
}

const ServiceSection: React.FC<SectionProps> = ({
  title,
  description,
  icon,
  linkTo,
  align = "left",
  index
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const arrowOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const arrowY = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);
  
  return (
    <motion.div 
      ref={sectionRef}
      className={`flex flex-col md:flex-row items-center w-full my-16 py-16 relative ${
        align === "right" ? "md:flex-row-reverse" : "md:flex-row"
      }`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
    >
      {/* Arrow pointing to the section */}
      {index < 2 && (
        <motion.div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-12 z-10"
          style={{ opacity: arrowOpacity, y: arrowY }}
        >
          <ArrowDown className="h-12 w-12 text-primary animate-bounce" />
        </motion.div>
      )}
      
      <div className={`w-full md:w-1/2 p-8 ${align === "right" ? "text-center md:text-right" : "text-center md:text-left"}`}>
        <div className={`flex flex-col md:flex-row items-center mb-6 ${
          align === "right" ? "md:justify-end" : "md:justify-start"
        } ${
          align === "right" ? "md:flex-row-reverse" : "md:flex-row"
        }`}>
          <div className="p-4 mb-4 md:mb-0 rounded-full bg-primary/10 text-primary md:mx-3">
            {icon}
          </div>
          <h2 className="text-3xl font-bold">{title}</h2>
        </div>
        <p className="text-muted-foreground text-lg md:text-xl mb-6">{description}</p>
        <div className={`flex ${align === "right" ? "justify-center md:justify-end" : "justify-center md:justify-start"}`}>
          <Link href={linkTo}>
            <Button className="group" size="lg" variant="outline">
              <span>Explore {title}</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 flex justify-center py-8 md:py-0">
        <motion.div 
          className="relative flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0.5 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
        >
          {/* Icon circle with glow effect */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary opacity-20 blur-xl transform scale-150"></div>
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary relative z-10 shadow-lg">
              <motion.div
                animate={{ 
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5,
                  ease: "easeInOut" 
                }}
              >
                {React.cloneElement(icon as React.ReactElement, { size: 48 })}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = window.scrollY / totalHeight;
      setScrollProgress(progress);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToContent = () => {
    if (contentRef.current) {
      const offsetTop = contentRef.current.offsetTop - 80; // Account for header
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        ref={heroRef} 
        className="relative min-h-[calc(100vh-80px)] flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-12 overflow-hidden"
      >
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        
        <motion.div 
          className="w-full md:w-1/2 mb-8 md:mb-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Hi, I'm Siddhant
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-8 text-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Hey there, internet traveler. I'm Software Developer — I build scalable systems, debug race conditions at 3 AM, and occasionally Google my own StackOverflow answers. 
            My code compiles, my containers run, and my API docs are almost human-readable. 
            Some call it backend development. I call it therapy.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button 
              onClick={scrollToContent} 
              size="lg" 
              className="group transition-all hover:pr-6"
            >
              <span>Explore My Work</span>
              <ArrowDown className="ml-2 h-4 w-4 group-hover:animate-bounce" />
            </Button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="w-full md:w-1/2 flex justify-center md:justify-end relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.2,
            ease: "easeOut" 
          }}
        >
          {/* Subtle glow behind image */}
          <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-75 opacity-70" />
          
          {/* Avatar with animation */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3,
              ease: "easeInOut" 
            }}
            className="relative z-10"
          >
            <img 
              src={avatarImage} 
              alt="Siddhant 3D Avatar" 
              className="w-[280px] md:w-[350px] lg:w-[400px] h-auto drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 0.5
          }}
          onClick={scrollToContent}
        >
          <ChevronDown size={36} className="text-primary cursor-pointer" />
        </motion.div>
      </div>

      {/* Disclaimer for non-technical visitors */}
      <div ref={contentRef} id="disclaimer" className="container mx-auto px-6 py-12 mb-8">
        <motion.div 
          className="relative max-w-4xl mx-auto p-8 rounded-lg border-2 border-primary/30 bg-gradient-to-br from-background to-primary/5 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut"
          }}
        >
          {/* Magical sparkles effect */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-1/4 right-20 w-12 h-12 bg-primary/30 rounded-full blur-lg animate-ping" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-10 left-1/3 w-16 h-16 bg-primary/20 rounded-full blur-lg animate-pulse" style={{ animationDuration: '6s' }}></div>
          <div className="absolute top-1/3 left-20 w-8 h-8 bg-primary/40 rounded-full blur-md animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-10 h-10 bg-primary/25 rounded-full blur-lg animate-pulse" style={{ animationDuration: '7s' }}></div>
          
          {/* Sparkle stars */}
          <motion.div 
            className="absolute top-0 right-1/4 text-primary opacity-70"
            animate={{ 
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5],
              rotate: [0, 15, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 4,
              ease: "easeInOut" 
            }}
          >
            ✨
          </motion.div>
          <motion.div 
            className="absolute bottom-4 right-10 text-primary opacity-70"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.8, 0.5],
              rotate: [0, -15, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 5,
              ease: "easeInOut" 
            }}
          >
            ✨
          </motion.div>
          <motion.div 
            className="absolute top-0 left-4 text-primary opacity-50"
            animate={{ 
              scale: [0.9, 1.3, 0.9],
              opacity: [0.4, 0.9, 0.4],
              rotate: [0, 20, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 6,
              ease: "easeInOut" 
            }}
          >
            ✨
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative z-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center text-gray-300">
             Not a techie? Totally okay.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
              This site has a lot of geeky stuff — system diagrams, a terminal, an API playground... you get the idea. If that sounds like something you'd rather not decode, no worries.  
              <br /><br />
              Just head over to my profile — it's a plain and simple overview of what I do, no tech jargon included.  
              <br /><br />
              You won't need to know what “POST /api/profile" means, promise.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              {/* Magic aura effect around button */}
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full -z-10"></div>
              
              <Link href="/profile">
                <Button 
                  size="lg" 
                  variant="default" 
                  className="group relative transition-all duration-300 shadow-lg hover:shadow-primary/50 hover:shadow-lg border border-primary/20"
                >
                  <motion.span
                    animate={{ 
                      color: ["hsl(var(--primary-foreground))", "hsl(var(--primary-foreground))", "hsl(var(--primary-foreground))"],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 3,
                    }}
                    className="mr-2"
                  >
                  </motion.span>
                  <span>Go to Profile</span>
                  <User className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Service Sections */}
      <div className="container mx-auto px-6 py-12 text-gray-100">
        <ServiceSection 
          title="How I Show System Architecture"  
          description="A real-time visualization of microservice architecture. Monitor service health, view logs, and see how different components interact with each other. Experience the complexity of distributed systems through an intuitive interface." 
          icon={<Server size={24} />} 
          linkTo="/dashboard"
          index={0}
        />
        
        <ServiceSection 
          title="Dev Console" 
          description="A custom-built terminal with command support. Interact directly with a simulated backend through a command-line interface. Execute commands to query services, check status, and manage operations. Experience the power of command-line tools for backend operations." 
          icon={<Terminal size={24} />} 
          linkTo="/terminal"
          align="right"
          index={1}
        />
        
        <ServiceSection 
          title="API Playground" 
          description="Explore and test the available API endpoints. Send requests, view responses, and understand how the backend processes different operations. Test different parameters and see real-time responses from the system." 
          icon={<Code size={24} />} 
          linkTo="/api"
          index={2}
        />
        
        {/* Final Call to Action */}
        <motion.div 
          className="text-center mt-32 mb-24 max-w-3xl mx-auto relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Background decorative elements */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-xl -z-10" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-xl -z-10" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-100">
            Go ahead, explore the repo of me.
          </h2>
          <p className="text-lg text-muted-foreground mb-8 text-gray-100">
            If you made it this far and still think I'm cool— thank you!😇
            <br /><br />  If you'd like to say hi or talk more
            hit the /api/contect in API Playground. Promise I will reply instantly!
            <br /><br />
            That's it.
            <br />
            No newsletter.
            <br />
            No cookies.
            <br />
            Just code, caffeine, and questionable variable names.
          </p>
        </motion.div>
      </div>
      
      {/* Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-100"
        style={{ width: `${scrollProgress * 100}%` }}
      />
    </div>
  );
}