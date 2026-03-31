const Colors = {
  primary: {
    default:  '#3DAA56',   
    light:    '#E8F5EB',   
    dark:     '#2C8040',   
    contrast: '#FFFFFF',   
  },

  secondary: {
    default:  '#1E1E1E',   
    light:    '#3A3A3A',   
    contrast: '#FFFFFF',
  },

  payment: {
    cash:  '#1E1E1E',      
    ovo:   '#6B2FCC',      
    qris:  '#CC2F5E',      
  },

  background: {
    default:  '#FFFFFF',   
    soft:     '#F5F5F5',   
    card:     '#FFFFFF',   
  },

  text: {
    primary:   '#1E1E1E',  
    secondary: '#6B6B6B',  
    placeholder:'#ABABAB', 
    disabled:  '#C4C4C4',  
    link:      '#3DAA56',  
    white:     '#FFFFFF',
  },

  border: {
    default:  '#E0E0E0',   
    focus:    '#3DAA56',   
  },

  status: {
    error:   '#E53E3E',    
    success: '#3DAA56',    
    warning: '#F6AD55',    
    info:    '#4299E1',    
  },

  empty: {
    icon:       '#BDBDBD', 
    text:       '#9E9E9E', 
  },

  white:       '#FFFFFF',
  black:       '#000000',
  transparent: 'transparent',
} as const;

export type ColorKeys = typeof Colors;
export default Colors;