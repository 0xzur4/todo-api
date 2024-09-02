mod handlers;

use mongodb::{options::ClientOptions, Client};
use rocket::{fairing::AdHoc, routes};
use rocket_cors::CorsOptions;
use rocket_dyn_templates::Template;
use std::sync::Arc;
use rocket::fs::{FileServer, relative};

// connection to mongodb
async fn connection() -> Client {
    dotenv::dotenv().ok();
    let url = std::env::var("DATABASE_URL").expect("error to database");
    let mut client_option = ClientOptions::parse(url).await.unwrap();

    client_option.app_name = Some("Rocket mongo".to_string());

    let client = Client::with_options(client_option).unwrap();

    client
}

#[rocket::main]
async fn main() {
    let client = connection().await;
    let db = client.database("article");

    let cors = CorsOptions::default().to_cors().unwrap();

    let _rocket = rocket::build()
        .attach(AdHoc::on_ignite("MongoDB", move |rocket| async move {
            rocket.manage(Arc::new(db))
        }))
        .attach(cors)
        .attach(Template::fairing())
        .mount("/static", FileServer::from(relative!("static")))
        .mount("/", routes![handlers::ui::index])
        .mount("/api",routes![
                handlers::todo::add_todo,
                handlers::todo::get_todo,
                handlers::todo::edit_data,
                handlers::todo::delete_data
            ],
        )
        .launch()
        .await;
}
