use rocket_dyn_templates::Template;
use rocket::get;
use std::collections::HashMap;

#[get("/")]
pub fn index() -> Template {
    let mut context =HashMap::new();
    context.insert("title", "Todo-list api");
    context.insert("message", "welcome to api");

    Template::render("index", &context)
}
