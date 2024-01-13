1. MVC stands for the 3 layers:
    - M (model) - represents the data of the app, they store and retrieve state in a database,
    - V (view) - basically the UI of the app that displays the model data
    - C (controller) - classes that do actions like handling browser requests, retrieving model data and calling view templates that return a response.
2. Naming conventions of:
    1. Models - Pascal case, describe the data they contain
    1. Controllers - Pascal case, ends in "Controller"
    2. Controller actions - descriptive verbs in Pascal case
    3. Views - Named after the controller (without "Controller")
    4. Views Themselves: Corresponding to the controller action
3. Using ViewData inside controllers:
```c#
public IActionResult Welcome(string name, int numTimes = 1)
{
    ViewData["Message"] = "Hello " + name;
    ViewData["NumTimes"] = numTimes;

    return View();
}
```
And then read the data inside the view
```html
@{
    ViewData["Title"] = "Welcome";
}

<h2>Welcome</h2>

<ul>
@for (int i = 0; i < (int)ViewData["NumTimes"]; i++)
{
    <li>@ViewData["Message"]</li>
}
</ul>

```
Or using Strongly typed models and the @model directive:
```c#
public async Task<IActionResult> Details(int? id)
{
    if (id == null)
    {
        return NotFound();
    }

    var movie = await _context.Movie
        .FirstOrDefaultAsync(m => m.Id == id);
    if (movie == null)
    {
        return NotFound();
    }

    return View(movie);
}
```
In the view:
```
@model MvcMovie.Models.Movie
```
4. Actions can be mapped to urls using:
```c#
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}");
});
```
With the appriopriate actions being needed to be implemented.

5. Use attributes annotations on controller actions like: [HttpPost], [HttpGet]

6. With the use of [ValidateAntiForgeryToken] annotation on actions and including the token in the forms.

7. 