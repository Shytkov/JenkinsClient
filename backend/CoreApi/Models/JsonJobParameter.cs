using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace CoreApi.Models {

  public class JsonJobParameter {

    [JsonProperty("_class")]
    public string Class {
      get;
      set;
    }

    [JsonProperty("description")]
    public string Description {
      get;
      set;
    }

    [JsonProperty("name")]
    public string Name {
      get;
      set;
    }

    [JsonProperty("type")]
    public string Type {
      get;
      set;
    }

    [JsonProperty("defaultParameterValue")]
    public JsonValue DefaultParameterValue {
      get;
      set;
    }
    
  }

  public class JsonValue {

    [JsonProperty("_class")]
    public string Class {
      get;
      set;
    }

    [JsonProperty("value")]
    public string Value {
      get;
      set;
    }

  }
}
