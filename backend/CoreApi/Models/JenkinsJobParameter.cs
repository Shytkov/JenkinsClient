using System;
using System.Collections.Generic;
using System.Text;

namespace CoreApi.Models {

  public class JenkinsJobParameter {

    public string Name {
      get;
      set;
    }

    public string DataType {
      get;
      set;
    }

    public string DefaultValue {
      get;
      set;
    }
  }
}
