import { connect } from "react-redux";
import { ThemeSwitch } from 'modules/app/components/theme-switch';
import { setTheme } from 'modules/app/actions/update-app-status';

const mapStateToProps = state => {
  return {
    theme: state.appStatus.theme
  }
};

const mapDispatchToProps = dispatch => ({
  setTheme: (theme) => dispatch(setTheme(theme)),
});

const ThemeSwitchContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ThemeSwitch);

export default ThemeSwitchContainer;