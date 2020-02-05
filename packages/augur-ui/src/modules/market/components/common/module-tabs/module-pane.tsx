interface ModulePane {
  label?: string;
  onClickCallback?: Function;
  h1Label?: boolean;
}

const ModulePane: React.FC<ModulePane> = ({ children }) => {
  return children
};

export default ModulePane;
