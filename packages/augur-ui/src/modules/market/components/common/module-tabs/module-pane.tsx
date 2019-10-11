interface ModulePane {
  label?: string;
  onClickCallback?: Function
}

const ModulePane: React.FC<ModulePane> = ({ children }) => {
  return children
};

export default ModulePane;
