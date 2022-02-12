use actix_files::Files;
use actix_web::{App, HttpServer, cookie::SameSite, web};
use actix_identity::{CookieIdentityPolicy, IdentityService};
use mongodb::Client;
use dotenv::dotenv;
use rand::Rng;

mod utils;
mod structs;
mod handlers;
use handlers::*;


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let private_key = rand::thread_rng().gen::<[u8; 32]>();

    let uri = std::env::var("MONGODB_URI").expect("MONGODB_URI must be set");
    let client = Client::with_uri_str(uri).await.expect("Failed to connect");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(client.clone()))
            .wrap(IdentityService::new(
                CookieIdentityPolicy::new(&private_key)
                    .name("accessToken")
                    .same_site(SameSite::Strict)
                    .http_only(true)
                    .secure(true)
            ))
            .service(create_haste)
            .service(get_haste)
            .service(get_user)
            .service(login)
            .service(
                Files::new("/", "public")
                .show_files_listing()
                .index_file("index.html")
            )
            .default_service(web::get().to(catch_all))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
