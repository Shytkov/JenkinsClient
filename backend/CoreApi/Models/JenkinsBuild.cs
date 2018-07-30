using System;
using System.Collections.Generic;
using System.Text;

namespace CoreApi.Models {

  public class JenkinsBuild {

    public string Url {
      get;
      set;
    }

    public long Number {
      get;
      set;
    }

    public string Result {
      get;
      set;
    }
  }
}
