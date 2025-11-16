// src/components/ThemeWrapper.tsx
import { useStore } from '../store/useStore';
import ThemeA from '../themes/ThemeA';
import ThemeB from '../themes/ThemeB';
import ThemeC from '../themes/ThemeC';
import ThemeD from '../themes/ThemeD';

export default function ThemeWrapper() {
  const { currentTheme } = useStore();

  const themes = {
    A: ThemeA,
    B: ThemeB, 
    C: ThemeC,
    D: ThemeD,
  };

  const ThemeComponent = themes[currentTheme as keyof typeof themes] || ThemeA;

  return <ThemeComponent />;
}