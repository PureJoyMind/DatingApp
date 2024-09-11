using API.Data;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController(DataContext context) : ApiBaseController
{
    [HttpGet("auth")]
    [Authorize]
    public ActionResult<string> GetAuth()
    {
        return "authorized string";
    }

    [HttpGet("not-found")]
    public ActionResult<AppUser> GetNotFound()
    {
        return NotFound();
    }

    [HttpGet("server-error")]
    public ActionResult<string> GetServerError()
    {
        throw new Exception("something bad happened");
    }

    [HttpGet("bad-request")]
    public ActionResult<string> GetBadRequest()
    {
        return BadRequest();
    }
}