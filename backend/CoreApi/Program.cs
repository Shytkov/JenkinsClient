using System;
using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CoreApi {

  class Program {

    enum ExitCode : int {
      Success = 0,
      InvalidPort = 100,
      UnknownError = 1000
    }

    static void Main(string[] args) {

      var config = new ConfigurationBuilder()
          .AddCommandLine(args)
          .Build();

      var host = new WebHostBuilder()
                    .UseKestrel()
                    .UseStartup<Startup>()
                    .UseConfiguration(config)
                    .Build();

      try {
        host.Run();
      }
      catch(IOException) {

        Environment.ExitCode = (int)ExitCode.InvalidPort;
        throw;
      }
      catch {
        Environment.ExitCode = (int)ExitCode.UnknownError;
        throw;
      }
    }
  }



  public class Startup {

    public Startup(IHostingEnvironment env) {
    }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services) {

      // Add framework services.
      services.AddMvc().AddJsonOptions(options => {
        //return json format with Camel Case
        options.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.DefaultContractResolver();
      });
    }

    private void Close() {
    }

    public void Configure(IApplicationBuilder app,
                        IHostingEnvironment env,
                        IApplicationLifetime appLifetime) {

      appLifetime.ApplicationStopped.Register(Close);
      app.UseMvc();
    }
  }
}
