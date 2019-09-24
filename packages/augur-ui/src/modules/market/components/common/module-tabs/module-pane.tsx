export interface ModulePaneProps {
  label?: string;
  onClickCallback?: Function;
  children: any;
}

export const ModulePane = (p: ModulePaneProps) => p.children;