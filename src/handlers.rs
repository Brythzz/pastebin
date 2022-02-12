use actix_web::{get, post, web, HttpResponse, Result};
use actix_files::NamedFile;
use actix_identity::{Identity};
use mongodb::Client;
use bcrypt::verify;
use crate::utils::*;
use crate::structs::*;


#[post("/api/login")]
async fn login(client: web::Data<Client>, id: Identity, info: web::Json<User>) -> HttpResponse {
    let user = fetch_user(client, &info.username).await;

    if user.is_none() {
        return HttpResponse::Unauthorized().body("Invalid username or password");
    }

    let u = user.unwrap();
    let valid_password = verify(&info.password, &u.password).unwrap();
    if !valid_password {
        return HttpResponse::Unauthorized().body("Invalid username or password");
    }

    id.remember(u.username);
    HttpResponse::Ok().finish()
}

#[post("/api/logout")]
async fn logout(id: Identity) -> HttpResponse {
    id.forget();
    HttpResponse::Ok().finish()
}

#[post("/api/haste")]
async fn create_haste(client: web::Data<Client>, id: Identity, info: web::Json<NewHaste>) -> HttpResponse {
    if id.identity().is_none() {
        return HttpResponse::Unauthorized().finish();
    }

    if info.content.len() == 0 {
        return HttpResponse::BadRequest().finish();
    }

    let id = save_haste(client, info.content.to_string()).await;

    return if !id.is_none() {
        let haste = CreatedHaste { id: id.unwrap() };

        HttpResponse::Ok()
            .content_type("application/json")
            .json(haste)
    } else {
        HttpResponse::InternalServerError().finish()
    };
}

#[get("/api/haste/{id}")]
async fn get_haste(client: web::Data<Client>, id: web::Path<String>) -> HttpResponse {
    if id.len() != 8 {
        return HttpResponse::BadRequest().finish();
    }

    let haste = fetch_haste(client, &id).await;

    if haste.is_none() {
        return HttpResponse::NotFound().finish();
    }

    HttpResponse::Ok()
        .content_type("application/json")
        .json(haste)
}

#[get("/api/user")]
async fn get_user(id: Identity) -> HttpResponse {
    if id.identity().is_none() {
        return HttpResponse::Unauthorized().finish();
    }

    HttpResponse::Ok().finish()
}

pub async fn catch_all() -> Result<NamedFile> {
    Ok(NamedFile::open("public/index.html")?)
}
