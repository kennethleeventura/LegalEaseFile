import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, useMotionValue, useVelocity } from 'framer-motion';

// Multi-paced parallax container
interface MultiParallaxProps {
  children: React.ReactNode;
  className?: string;
}

export const MultiParallaxContainer: React.FC<MultiParallaxProps> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  return (
    <div ref={ref} className={`relative ${className}`}>
      {children}
    </div>
  );
};

// Multi-speed parallax element
interface ParallaxLayerProps {
  children: React.ReactNode;
  speed: number; // 0.1 = slow, 1 = normal, 2 = fast
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({ 
  children, 
  speed, 
  direction = 'up',
  className = '' 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const getTransform = () => {
    const distance = 200 * speed;
    switch (direction) {
      case 'down':
        return useTransform(scrollYProgress, [0, 1], [0, distance]);
      case 'left':
        return useTransform(scrollYProgress, [0, 1], [distance, -distance]);
      case 'right':
        return useTransform(scrollYProgress, [0, 1], [-distance, distance]);
      default: // up
        return useTransform(scrollYProgress, [0, 1], [distance, -distance]);
    }
  };

  const transform = getTransform();

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        [direction === 'left' || direction === 'right' ? 'x' : 'y']: transform
      }}
    >
      {children}
    </motion.div>
  );
};

// Horizontal scroll section
interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
}

export const HorizontalScrollSection: React.FC<HorizontalScrollProps> = ({ children, className = '' }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']);

  return (
    <section ref={targetRef} className={`relative h-[300vh] ${className}`}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-8">
          {children}
        </motion.div>
      </div>
    </section>
  );
};

// Gradient color change on scroll
interface ScrollGradientProps {
  children: React.ReactNode;
  gradients: string[];
  className?: string;
}

export const ScrollGradient: React.FC<ScrollGradientProps> = ({ children, gradients, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const [currentGradient, setCurrentGradient] = useState(gradients[0]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (progress) => {
      const index = Math.floor(progress * (gradients.length - 1));
      setCurrentGradient(gradients[Math.min(index, gradients.length - 1)]);
    });
    
    return () => unsubscribe();
  }, [scrollYProgress, gradients]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        background: currentGradient,
        transition: 'background 0.3s ease-out'
      }}
    >
      {children}
    </div>
  );
};

// Spinning morph animation (Wix style)
interface SpinMorphProps {
  children: React.ReactNode;
  className?: string;
}

export const SpinMorph: React.FC<SpinMorphProps> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotate,
        scale,
      }}
    >
      {children}
    </motion.div>
  );
};

interface WixScrollAnimationProps {
  children: React.ReactNode;
  animation?: 'morphText' | 'staggerReveal' | 'parallaxScale' | 'liquidMorph' | 'spinningReveal' | 'textReveal' | 'scaleRotate';
  delay?: number;
  duration?: number;
  className?: string;
}

// Wix Studio-style morphing text reveal
export const WixScrollAnimation: React.FC<WixScrollAnimationProps> = ({
  children,
  animation = 'staggerReveal',
  delay = 0,
  duration = 1.2,
  className = ''
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const animations = {
    morphText: {
      initial: { 
        scaleX: 0.3, 
        scaleY: 1.8, 
        opacity: 0, 
        filter: 'blur(20px)',
        rotateX: 45 
      },
      animate: { 
        scaleX: 1, 
        scaleY: 1, 
        opacity: 1, 
        filter: 'blur(0px)',
        rotateX: 0,
        transition: {
          duration: duration,
          delay,
          ease: [0.23, 1, 0.32, 1],
          scaleX: { type: "spring", stiffness: 100, damping: 15 },
          scaleY: { type: "spring", stiffness: 100, damping: 15 },
          rotateX: { type: "spring", stiffness: 80, damping: 10 }
        }
      }
    },
    staggerReveal: {
      initial: { 
        opacity: 0, 
        y: 100, 
        clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)',
        filter: 'blur(8px)'
      },
      animate: { 
        opacity: 1, 
        y: 0, 
        clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)',
        filter: 'blur(0px)',
        transition: {
          duration: duration,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
          y: { type: "spring", stiffness: 100, damping: 12 }
        }
      }
    },
    parallaxScale: {
      initial: { scale: 0.6, opacity: 0, rotateY: 25 },
      animate: { 
        scale: 1, 
        opacity: 1, 
        rotateY: 0,
        transition: {
          duration: duration + 0.5,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
          scale: { type: "spring", stiffness: 80, damping: 12 }
        }
      }
    },
    liquidMorph: {
      initial: { 
        borderRadius: '50% 50% 50% 50%',
        scale: 0.3,
        opacity: 0,
        rotate: 180
      },
      animate: { 
        borderRadius: '0% 0% 0% 0%',
        scale: 1,
        opacity: 1,
        rotate: 0,
        transition: {
          duration: duration + 0.8,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
          borderRadius: {
            times: [0, 0.3, 0.6, 1],
            values: ['50% 50% 50% 50%', '30% 70% 70% 30%', '10% 90% 10% 90%', '0% 0% 0% 0%']
          }
        }
      }
    },
    spinningReveal: {
      initial: { 
        rotateY: 90,
        rotateX: 45,
        scale: 0.8,
        opacity: 0,
        filter: 'blur(10px)'
      },
      animate: { 
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        transition: {
          duration: duration + 0.5,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
          rotateY: { type: "spring", stiffness: 80, damping: 15 },
          scale: { type: "spring", stiffness: 100, damping: 12 }
        }
      }
    },
    textReveal: {
      initial: { 
        y: '100%',
        opacity: 0,
        clipPath: 'inset(100% 0 0 0)'
      },
      animate: { 
        y: '0%',
        opacity: 1,
        clipPath: 'inset(0% 0 0 0)',
        transition: {
          duration: duration,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    },
    scaleRotate: {
      initial: { 
        scale: 0.5,
        rotate: -180,
        opacity: 0,
        filter: 'hue-rotate(180deg) blur(15px)'
      },
      animate: { 
        scale: 1,
        rotate: 0,
        opacity: 1,
        filter: 'hue-rotate(0deg) blur(0px)',
        transition: {
          duration: duration + 0.3,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
          scale: { type: "spring", stiffness: 100, damping: 10 },
          rotate: { type: "spring", stiffness: 80, damping: 15 }
        }
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      variants={animations[animation]}
      style={{ perspective: 1000 }}
    >
      {children}
    </motion.div>
  );
};

// Wix Studio-style magnetic hover effect
export const MagneticElement: React.FC<{
  children: React.ReactNode;
  className?: string;
  strength?: number;
}> = ({ children, className = '', strength = 0.3 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (e.clientX - centerX) * strength;
    const y = (e.clientY - centerY) * strength;
    
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
    >
      {children}
    </motion.div>
  );
};

// Wix Studio-style advanced parallax with depth layers
export const WixParallax: React.FC<{
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'rotate' | 'scale';
}> = ({ children, className = '', speed = 0.5, direction = 'up' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const transforms = {
    up: useTransform(scrollYProgress, [0, 1], ['0%', `-${speed * 100}%`]),
    down: useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]),
    left: useTransform(scrollYProgress, [0, 1], ['0%', `-${speed * 50}%`]),
    right: useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 50}%`]),
    rotate: useTransform(scrollYProgress, [0, 1], [0, speed * 360]),
    scale: useTransform(scrollYProgress, [0, 0.5, 1], [1, 1 + speed, 1])
  };

  const springTransform = useSpring(transforms[direction], {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const getStyle = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { y: springTransform };
      case 'left':
      case 'right':
        return { x: springTransform };
      case 'rotate':
        return { rotate: springTransform };
      case 'scale':
        return { scale: springTransform };
      default:
        return { y: springTransform };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={getStyle()}
    >
      {children}
    </motion.div>
  );
};

// Wix Studio-style staggered container animations
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}> = ({ children, className = '', staggerDelay = 0.1 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      rotateX: 45,
      filter: 'blur(10px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        y: { type: "spring", stiffness: 100, damping: 12 }
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={itemVariants}
    >
      {children}
    </motion.div>
  );
};

// Wix Studio-style scroll-triggered counter with morphing numbers
export const WixCounter: React.FC<{
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}> = ({ target, duration = 2000, suffix = '', prefix = '', className = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const startCount = 0;
      
      const updateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        setCount(Math.floor(easeOutExpo * (target - startCount) + startCount));
        
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };
      
      requestAnimationFrame(updateCount);
    }
  }, [isInView, target, duration]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ scale: 0.8, filter: 'blur(10px)' }}
      animate={isInView ? { scale: 1, filter: 'blur(0px)' } : { scale: 0.8, filter: 'blur(10px)' }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <motion.span
        key={count}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {prefix}{count.toLocaleString()}{suffix}
      </motion.span>
    </motion.span>
  );
};