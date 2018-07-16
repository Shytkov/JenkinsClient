import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import OptionsUrlList from '../components/OptionsUrlList';
import * as OptionsActions from '../actions/options';

function mapStateToProps(state) {
  return {
    urls: state.options.urls,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(OptionsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionsUrlList);
