using API.Helpers;
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;


[ApiController]
[Route("api/[controller]")]
[ServiceFilter(typeof(LogUserActiviy))]
public class ApiBaseController : ControllerBase 
{
    
}