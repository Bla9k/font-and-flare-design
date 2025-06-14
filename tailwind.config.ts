
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'digital': ['"Share Tech Mono"', 'monospace'],
				'sans': ['"Inter"', 'sans-serif'],
				'display': ['"Rajdhani"', 'sans-serif'],
				'jp': ['"Noto Sans JP"', 'sans-serif'],
				'persona-title': ['"Cinzel"', 'serif'],
				'persona-ui': ['"Orbitron"', 'monospace'],
				'persona-body': ['"Inter"', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				anime: {
					red: '#FF2A45',
					blue: '#A2C4FF',
					dark: '#121212',
					gray: '#282828',
					'light-gray': '#3A3A3A',
					'cyberpunk-blue': '#00F0FF',
				},
				persona: {
					gold: '#FFD700',
					flame: '#FF4500',
					purple: '#8A2BE2',
					shadow: '#4B0082',
					void: '#0A0A0F',
					velvet: '#1A1A25',
					card: '#151520',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'glitch': {
					'0%, 100%': { transform: 'translate(0)' },
					'20%': { transform: 'translate(-5px, 5px)' },
					'40%': { transform: 'translate(-5px, -5px)' },
					'60%': { transform: 'translate(5px, 5px)' },
					'80%': { transform: 'translate(5px, -5px)' },
				},
				'scanline': {
					'0%': { transform: 'translateY(0)' },
					'100%': { transform: 'translateY(100%)' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'pulse-light': {
					'0%, 100%': { opacity: '0.7' },
					'50%': { opacity: '0.3' },
				},
				'text-flicker': {
					'0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': {
						opacity: '0.99',
						textShadow: '-2px -2px 10px rgba(255, 42, 69, 0.5), 2px 2px 10px rgba(0, 240, 255, 0.5)'
					},
					'20%, 24%, 55%': {
						opacity: '0.5',
						textShadow: 'none'
					}
				},
				// Persona-specific animations
				'persona-pulse': {
					'0%, 100%': { 
						boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
						transform: 'scale(1)'
					},
					'50%': { 
						boxShadow: '0 0 40px rgba(255, 215, 0, 0.6)',
						transform: 'scale(1.02)'
					}
				},
				'arcana-rotate': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'shadow-flicker': {
					'0%, 100%': { opacity: '0.8' },
					'50%': { opacity: '0.4' }
				},
				'mystical-float': {
					'0%, 100%': { 
						transform: 'translateY(0px) rotate(0deg)', 
						opacity: '0.7'
					},
					'50%': { 
						transform: 'translateY(-10px) rotate(180deg)', 
						opacity: '1'
					}
				},
				'tarot-flip': {
					'0%': { transform: 'rotateY(0deg)' },
					'50%': { transform: 'rotateY(90deg)' },
					'100%': { transform: 'rotateY(0deg)' }
				},
				'velvet-room-glow': {
					'0%, 100%': {
						background: 'radial-gradient(ellipse at center, rgba(138, 43, 226, 0.2) 0%, rgba(255, 215, 0, 0.1) 50%, transparent 100%)'
					},
					'50%': {
						background: 'radial-gradient(ellipse at center, rgba(255, 215, 0, 0.3) 0%, rgba(138, 43, 226, 0.2) 50%, transparent 100%)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'glitch': 'glitch 1s infinite',
				'scanline': 'scanline 8s linear infinite',
				'float': 'float 6s ease-in-out infinite',
				'pulse-light': 'pulse-light 4s ease-in-out infinite',
				'text-flicker': 'text-flicker 3s linear infinite',
				'persona-pulse': 'persona-pulse 3s ease-in-out infinite',
				'arcana-rotate': 'arcana-rotate 20s linear infinite',
				'shadow-flicker': 'shadow-flicker 2s ease-in-out infinite',
				'mystical-float': 'mystical-float 6s ease-in-out infinite',
				'tarot-flip': 'tarot-flip 2s ease-in-out',
				'velvet-room-glow': 'velvet-room-glow 8s ease-in-out infinite',
			},
			backdropBlur: {
				'xs': '2px',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
