import axios from 'axios';

class JenkinsApi {
  constructor(jenkinsUrl) {
    this.baseUrl = 'http://localhost:5000/';
    this.jenkinsUrl = jenkinsUrl;
  }

  getJobsAsync() {
    return this.getRequest('get-jobs');
  }

  getMasterAsync() {
    return this.getRequest('get-master');
  }

  getJobAsync(name: string) {
    return this.getRequest('get-job', { name });
  }

  getRequest(func, param={}) {
    const url = `${this.baseUrl}${func}`;
    const params = {
      ...param,
      jenkinsUrl: this.jenkinsUrl,
    };
    return axios.get(url, { params });
  }
}

export default JenkinsApi;
