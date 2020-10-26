interface ModulePane {
  label?: string;
  onClickCallback?: Function;
  headerType?: string;
  status?: string;
  isNew?: boolean;
  children: any;
}

const ModulePane = ({ children }: ModulePane) => {
  return children
};

export default ModulePane;
