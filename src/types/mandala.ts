export interface MandalaData {
  title: string;
  center: string;
  goals: string[];
  subGoals: string[][];
  colors: {
    text: string;
    background: string;
  };
}

export interface MandalaGridProps {
  data: MandalaData;
  onCenterChange: (center: string) => void;
  onGoalChange: (index: number, value: string) => void;
  onSubGoalChange: (goalIndex: number, subIndex: number, value: string) => void;
}

export interface ColorPickerProps {
  colors: {
    text: string;
    background: string;
  };
  onColorChange: (colors: { text: string; background: string }) => void;
} 