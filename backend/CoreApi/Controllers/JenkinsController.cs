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

    [HttpGet("get-job")]
    public IActionResult GetJob(string jenkinsUrl, string name) {

      JenkinsConfig config = new JenkinsConfig() {
        JenkinsUrl = jenkinsUrl
      };

      JenkinsClient client = new JenkinsClient(config);
      CancellationToken token = new CancellationToken();
      var job = client.GetJob(name, token).Result;

      int? health = job.HealthReport.FirstOrDefault()?.Score;
      var lastBuild = client.GetBuild(name, job.LastBuild.Number.ToString(), token).Result;

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
