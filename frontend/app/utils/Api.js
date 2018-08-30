import axios from 'axios';

class JenkinsApi {

  constructor() {
    if(!JenkinsApi.instance){
      this.baseUrl = 'http://localhost:5100';
      JenkinsApi.instance = this;
    }
    return JenkinsApi.instance;
  }

  ping() {
    return this.getRequest('ping');
  }

  getJobsAsync(jenkinsUrl: string) {
    return this.getRequest('get-jobs', jenkinsUrl);
  }

  getJobParametersAsync(name: string, jenkinsUrl: string) {
    return this.getRequest('get-job-parameters', jenkinsUrl, { name });
  }

  buildJobAsync(name: string, jenkinsUrl: string, parameters) {
    return this.getRequest('build-job', jenkinsUrl, { name, parameters });
  }

  getMasterAsync(jenkinsUrl: string) {
    return this.getRequest('get-master', jenkinsUrl);
  }

  getJobAsync(name: string, jenkinsUrl: string) {
    return this.getRequest('get-job', jenkinsUrl, { name });
  }

  getRequest(func, jenkinsUrl, param={}) {

    const url = `${this.baseUrl}/${func}`;
    const params = {
      ...param,
      jenkinsUrl
    };
    return axios.get(url, { params });
  }
}

const instance = new JenkinsApi();
Object.freeze(instance);

export default instance;
