interface ModulePane {
  label?: string;
  onClickCallback?: Function;
  headerType?: string;
  status?: string;
}

const ModulePane: React.FC<ModulePane> = ({ children }) => {
  return children
};

export default ModulePane;
