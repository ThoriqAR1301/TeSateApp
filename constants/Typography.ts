import { TextStyle } from 'react-native';

export const FontFamily = {
  regular:     'System',   
  medium:      'System',
  semiBold:    'System',
  bold:        'System',
} as const;

export const FontSize = {
  xs:   11,   
  sm:   13,   
  base: 14,   
  md:   15,   
  lg:   16,   
  xl:   18,   
  '2xl': 20,  
  '3xl': 24,  
  '4xl': 28,  
} as const;

export const LineHeight = {
  tight:  1.2,
  normal: 1.5,
  loose:  1.8,
} as const;


const Typography: Record<string, TextStyle> = {
  h1: {
    fontSize:   FontSize['3xl'],
    fontWeight: '700',
    lineHeight: FontSize['3xl'] * 1.3,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize:   FontSize['2xl'],
    fontWeight: '700',
    lineHeight: FontSize['2xl'] * 1.3,
  },
  h3: {
    fontSize:   FontSize.xl,
    fontWeight: '600',
    lineHeight: FontSize.xl * 1.4,
  },
  h4: {
    fontSize:   FontSize.lg,
    fontWeight: '600',
    lineHeight: FontSize.lg * 1.4,
  },

  bodyLg: {
    fontSize:   FontSize.md,
    fontWeight: '400',
    lineHeight: FontSize.md * 1.6,
  },
  body: {
    fontSize:   FontSize.base,
    fontWeight: '400',
    lineHeight: FontSize.base * 1.6,
  },
  bodySm: {
    fontSize:   FontSize.sm,
    fontWeight: '400',
    lineHeight: FontSize.sm * 1.6,
  },

  label: {
    fontSize:   FontSize.base,
    fontWeight: '500',
    lineHeight: FontSize.base * 1.4,
  },
  labelSm: {
    fontSize:   FontSize.sm,
    fontWeight: '500',
    lineHeight: FontSize.sm * 1.4,
  },

  caption: {
    fontSize:   FontSize.xs,
    fontWeight: '400',
    lineHeight: FontSize.xs * 1.5,
  },

  price: {
    fontSize:   FontSize.base,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  button: {
    fontSize:   FontSize.base,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  link: {
    fontSize:   FontSize.base,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
} as const;

export default Typography;