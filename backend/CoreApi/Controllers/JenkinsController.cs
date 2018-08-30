using CoreApi.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;
using Narochno.Jenkins;
using System.Threading;
using System.Linq;

namespace CoreApi.Controllers {

  //[Route("")]
  [Controller]
  public class JenkinsController : Controller {

    [HttpGet("ping")]
    public IActionResult Ping() {

      return Json(true);
    }

    [HttpGet("get-jobs")]
    public IActionResult GetJobs(string jenkinsUrl) {

      // "http://jenkins-dbforge.datasoft.local:8080/job/Oracle4.0/"
      JenkinsConfig config = new JenkinsConfig() {
        JenkinsUrl = jenkinsUrl
      };

      JenkinsClient client = new JenkinsClient(config);
      CancellationToken token = new CancellationToken();
      var master = client.GetMaster(token).Result;

      var result = new List<JenkinsJob>();
      foreach (var job in master.Jobs) {
        result.Add(new JenkinsJob() {
          Name = job.Name,
          Color = job.Color,
          Url = job.Url.ToString()
        });
      }

      Console.WriteLine($"{DateTime.Now.TimeOfDay.ToString()}: get-jobs for {jenkinsUrl} = {result.Count}");
      return Json(result);
    }

    [HttpGet("get-master")]
    public IActionResult GetMaster(string jenkinsUrl) {

      JenkinsConfig config = new JenkinsConfig() {
        JenkinsUrl = jenkinsUrl
      };

      JenkinsClient client = new JenkinsClient(config);
      CancellationToken token = new CancellationToken();
      var master = client.GetMaster(token).Result;

      JenkinsMaster result = new JenkinsMaster() {
        Name = master.Name
      };

      return Json(result);
    }

    [HttpGet("get-job-parameters")]
    public IActionResult GetJobParameters(string jenkinsUrl, string name) {

      JenkinsConfig config = new JenkinsConfig() {
        JenkinsUrl = jenkinsUrl
      };

      JenkinsClient client = new JenkinsClient(config);
      CancellationToken token = new CancellationToken();
      var job = client.GetJob(name, token).Result;

      try {
        List<JenkinsJobParameter> parameters = new List<JenkinsJobParameter>();
        var par = job.Actions.Where(a => a["parameterDefinitions"] != null).FirstOrDefault();
        foreach (var item in par["parameterDefinitions"].Children()) {
          var p = Newtonsoft.Json.JsonConvert.DeserializeObject<JsonJobParameter>(item.ToString());
          parameters.Add(new JenkinsJobParameter() {
            Name = p.Name,
            DataType = p.Type,
            DefaultValue = p.DefaultParameterValue.Value
          });
        }
        return Json(parameters);

      }
      catch {
      }
      return Json(false);
    }


    public class Parameter {
      public string Key {
        get;
        set;
      }

      public string Value {
        get;
        set;
      }
    }

    [HttpGet("build-job")]
    public IActionResult BuildJob(string jenkinsUrl, string name, string parameters) {

      JenkinsConfig config = new JenkinsConfig() {
        JenkinsUrl = jenkinsUrl
      };

      JenkinsClient client = new JenkinsClient(config);
      CancellationToken token = new CancellationToken();
      var result = Newtonsoft.Json.JsonConvert.DeserializeObject<Parameter[]>(parameters);

      Dictionary<string, string> param = new Dictionary<string, string>(result.Length);
      foreach (var item in result)
        param.Add(item.Key, item.Value);


      try {
        client.BuildProjectWithParameters(name, param, token).Wait();
      }
      catch(Exception e) {
        return Json(false);
      }
      return Json(true);
    }

    [HttpGet("get-job")]
    public IActionResult GetJob(string jenkinsUrl, string name) {

      JenkinsConfig config = new JenkinsConfig() {
        JenkinsUrl = jenkinsUrl
      };

      JenkinsClient client = new JenkinsClient(config);
      CancellationToken token = new CancellationToken();
      var job = client.GetJob(name, token).Result;

      int? health = job.HealthReport.FirstOrDefault()?.Score;
      // var lastBuild = client.GetBuild(name, job.LastBuild.Number.ToString(), token).Result;

      string lastBuildResult = "UNKNOWN";
      if (job.LastBuild != null && job.LastSuccessfulBuild != null)
        lastBuildResult = job.LastBuild.Number == job.LastSuccessfulBuild.Number ? "SUCCESS" : "FAILED";

      // string lastBuildResult = (DateTime.Now.Millisecond % 2 == 0) ? "SUCCESS" : "FAILED";

      var result = new JenkinsJob() {
        Name = job.Name,
        Color = job.Color,
        Building = job.Color.Contains("anime"),
        Url = job.Url.ToString(),
        Buildable = job.Buildable,
        Health = health.GetValueOrDefault(-1),
        LastBuild = new JenkinsBuild() {
          Url = job.LastBuild.Url.ToString(),
          Number = job.LastBuild.Number,
          Result = lastBuildResult
        },
      };
      return Json(result);
    }
  }
}
