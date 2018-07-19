import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Loading from '../components/Loading';
import * as LoadingActions from '../actions/loading';

function mapStateToProps(state) {
  return {
    options: state.options,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(LoadingActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Loading);
