using Narochno.Jenkins.Entities.Jobs;
using Narochno.Jenkins.Entities.Views;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Narochno.Jenkins.Entities {

  public class HealthReport {

    [JsonProperty("description")]
    public string Description { get; set; }

    [JsonProperty("iconClassName")]
    public string IconClassName { get; set; }

    [JsonProperty("iconUrl")]
    public string IconUrl { get; set; }

    [JsonProperty("score")]
    public long Score { get; set; }
  }


  public class Master {

    [JsonProperty("description")]
    public string Description { get; set; }

    [JsonProperty("displayName")]
    public string DisplayName { get; set; }

    [JsonProperty("displayNameOrNull")]
    public object DisplayNameOrNull { get; set; }

    [JsonProperty("fullDisplayName")]
    public string FullDisplayName { get; set; }

    [JsonProperty("fullName")]
    public string FullName { get; set; }

    [JsonProperty("name")]
    public string Name { get; set; }

    [JsonProperty("url")]
    public string Url { get; set; }

    [JsonProperty("healthReport")]
    public HealthReport[] HealthReport { get; set; }

    public string Mode { get; set; }
    public string NodeDescription { get; set; }
    public string NodeName { get; set; }
    public int NumExecutors { get; set; }
    public bool QuietingDown { get; set; }
    public int SlaveAgentPort { get; set; }
    public bool UseCrumbs { get; set; }
    public bool UseSecurity { get; set; }
    public View PrimaryView { get; set; }
    public IList<Job> Jobs { get; set; } = new List<Job>();
    public IList<View> Views { get; set; } = new List<View>();
  }
}
