import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import BuildJob from '../components/BuildJob';
import * as BuildJobActions from '../actions/buildjob';

function mapStateToProps(state) {
  return {
    job: state.buildjob.job,
    loading: state.buildjob.loading,
    parameters: state.buildjob.parameters
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(BuildJobActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BuildJob);
