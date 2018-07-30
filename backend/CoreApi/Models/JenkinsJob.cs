using System;
using System.Collections.Generic;
using System.Text;

namespace CoreApi.Models {

  public class JenkinsJob {

    public string Name {
      get;
      set;
    }

    public bool Building {
      get;
      set;
    }

    public string Color {
      get;
      set;
    }

    public string Url {
      get;
      set;
    }

    public bool Buildable {
      get;
      set;
    }

    public JenkinsBuild LastBuild {
      get;
      set;
    }

    public int Health {
      get;
      set;
    }
  }
}
