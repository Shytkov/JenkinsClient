import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import HomeJobList from '../components/HomeJobList';
import * as HomeActions from '../actions/home';

function mapStateToProps(state) {
  return {
    jobs: state.home.jobs,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(HomeActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeJobList);
