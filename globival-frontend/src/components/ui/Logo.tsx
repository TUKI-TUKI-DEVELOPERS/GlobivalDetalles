import styled from "styled-components"
import brandLogoUrl from "../../assets/brand-logo.svg"
import { useEffect, useState } from "react"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  contrast?: boolean; // adds a subtle backdrop for dark mode or busy backgrounds
  animated?: boolean; // enables animation effects
  variant?: "standard" | "compact"; // compact shows only the logo mark on mobile
}

const LogoContainer = styled.div<{ 
  $contrast?: boolean;
  $animated?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ $contrast, theme }) => ($contrast ? `${theme.spacing.xs} ${theme.spacing.md}` : "0")};
  background: ${({ $contrast }) => ($contrast 
    ? `linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))` 
    : "transparent")};
  box-shadow: ${({ $contrast }) => ($contrast 
    ? "0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)" 
    : "none")};
  backdrop-filter: ${({ $contrast }) => ($contrast ? "saturate(180%) blur(8px)" : "none")};
  transition: all 0.3s ease-in-out;
  position: relative;
  overflow: hidden;
  
  ${({ $animated }) => $animated && `
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06);
    }
    
    &::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
      pointer-events: none;
      z-index: 1;
    }
    
    &:hover::after {
      opacity: 1;
    }
  `}
`

const LogoMark = styled.div<{ 
  $size: "sm" | "md" | "lg" | "xl";
  $animated?: boolean;
}>`
  background-image: url(${brandLogoUrl});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  width: ${({ $size }) => (
    $size === "sm" ? "32px" : 
    $size === "md" ? "40px" : 
    $size === "lg" ? "48px" : "56px"
  )};
  height: ${({ $size }) => (
    $size === "sm" ? "32px" : 
    $size === "md" ? "40px" : 
    $size === "lg" ? "48px" : "56px"
  )};
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  
  ${({ $animated }) => $animated && `
    transition: transform 0.3s ease-in-out;
    
    &:hover {
      transform: scale(1.05) rotate(2deg);
    }
  `}
`

const LogoText = styled.h1<{ 
  $size: "sm" | "md" | "lg" | "xl";
  $animated?: boolean;
  $variant: "standard" | "compact";
}>`
  font-size: ${({ $size }) => (
    $size === "sm" ? "1.1rem" : 
    $size === "md" ? "1.3rem" : 
    $size === "lg" ? "1.5rem" : "1.8rem"
  )};
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) => theme.colors.neutral900};
  letter-spacing: 0.5px;
  position: relative;
  z-index: 2;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: ${({ $variant }) => ($variant === "compact" ? "none" : "block")};
    font-size: ${({ $size }) => (
      $size === "sm" ? "0.9rem" : 
      $size === "md" ? "1.1rem" : 
      $size === "lg" ? "1.3rem" : "1.5rem"
    )};
  }
  
  span {
    color: ${({ theme }) => theme.colors.brand500};
    position: relative;
    display: inline-block;
    
    ${({ $animated }) => $animated && `
      transition: transform 0.3s ease-in-out;
      
      &:hover {
        transform: scale(1.1);
      }
    `}
  }
`

const Logo = ({ 
  size = "md", 
  contrast = false, 
  animated = true,
  variant = "standard" 
}: LogoProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <LogoContainer 
      $contrast={contrast} 
      $animated={animated}
      style={{ 
        opacity: isVisible ? 1 : 0,
        transform: `translateY(${isVisible ? 0 : '10px'})`,
        transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out'
      }}
    >
      <LogoMark $size={size} $animated={animated} />
      <LogoText $size={size} $animated={animated} $variant={variant}>
        Globival <span>&</span> Detalles
      </LogoText>
    </LogoContainer>
  )
}

export default Logo
