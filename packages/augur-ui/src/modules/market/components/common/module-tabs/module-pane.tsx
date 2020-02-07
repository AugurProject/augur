interface ModulePane {
  label?: string;
  onClickCallback?: Function;
  headerType?: string;
}

const ModulePane: React.FC<ModulePane> = ({ children }) => {
  return children
};

export default ModulePane;
