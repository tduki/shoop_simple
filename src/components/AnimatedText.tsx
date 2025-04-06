'use client';

import { useEffect, useRef } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  type?: 'typing' | 'fadeIn' | 'slideIn' | 'glowing';
  color?: string;
}

export default function AnimatedText({ 
  text, 
  className = '', 
  speed = 100, 
  delay = 0,
  type = 'typing',
  color = 'currentColor'
}: AnimatedTextProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    setTimeout(() => {
      if (type === 'typing') {
        element.innerHTML = '';
        let i = 0;
        const typeText = () => {
          if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeText, speed);
          } else {
            // Add cursor blink after typing is complete
            element.classList.add('after:content-["_"]', 'after:animate-blink');
          }
        };
        typeText();
      } else if (type === 'fadeIn') {
        element.style.opacity = '0';
        element.textContent = text;
        let opacity = 0;
        const fadeIn = () => {
          if (opacity < 1) {
            opacity += 0.05;
            element.style.opacity = opacity.toString();
            requestAnimationFrame(fadeIn);
          }
        };
        fadeIn();
      } else if (type === 'slideIn') {
        element.style.transform = 'translateX(-20px)';
        element.style.opacity = '0';
        element.textContent = text;
        
        element.style.transition = `transform ${speed * 2}ms ease-out, opacity ${speed * 2}ms ease-out`;
        
        setTimeout(() => {
          element.style.transform = 'translateX(0)';
          element.style.opacity = '1';
        }, 50);
      } else if (type === 'glowing') {
        element.textContent = text;
        
        // Enhanced glowing effect
        element.style.color = color;
        element.classList.add('animate-glow');
        element.style.textShadow = `0 0 5px ${color}, 0 0 15px ${color}, 0 0 25px ${color}`;
        
        // Add letter-spacing animation
        let letterSpacing = 0;
        const maxLetterSpacing = 2; // maximum letter-spacing value in pixels
        let increasing = true;
        
        const animateLetterSpacing = () => {
          if (increasing) {
            letterSpacing += 0.1;
            if (letterSpacing >= maxLetterSpacing) {
              increasing = false;
            }
          } else {
            letterSpacing -= 0.1;
            if (letterSpacing <= 0) {
              increasing = true;
            }
          }
          
          element.style.letterSpacing = `${letterSpacing}px`;
          
          requestAnimationFrame(animateLetterSpacing);
        };
        
        // Uncomment to enable letter spacing animation
        // animateLetterSpacing();
      }
    }, delay);
  }, [text, speed, delay, type, color]);

  return (
    <div 
      ref={elementRef} 
      className={`inline-block ${className} ${type === 'glowing' ? 'text-shadow-glow' : ''}`}
    ></div>
  );
} 