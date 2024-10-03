using API.Interfaces;
using API.Services.Extensions;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers;

public class LogUserActiviy : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var resultContext = await next();
        // after any action is executed
        if(context.HttpContext.User.Identity?.IsAuthenticated == false) return;

        var userId = resultContext.HttpContext.User.GetUserId();
        var repo = resultContext.HttpContext.RequestServices.GetRequiredService<IUserRepository>();
        var user = await repo.GetUserByIdAsync(userId );
        if(user == null)return;
        user.LastActive = DateTime.UtcNow;
        await repo.SaveAllAsync();
    }
}