use mongodb::{bson::doc, Client, Collection};
use actix_web::web;
use rand::Rng;
use crate::structs::*;


fn generate_id() -> String {
    let random_bytes = rand::thread_rng().gen::<[u8; 4]>();
    return hex::encode(random_bytes);
}

pub async fn fetch_user(client: web::Data<Client>, username: &String) -> Option<User> {
    let collection = client.database("haste").collection("users");
    let user = collection.find_one(doc! {"username": username}, None).await.unwrap();
    return user;
}

pub async fn fetch_haste(client: web::Data<Client>, id: &String) -> Option<Haste> {
    let collection = client.database("haste").collection("hastes");
    let haste = collection.find_one(doc! {"_id": id}, None).await.unwrap();
    return haste;
}

pub async fn save_haste(client: web::Data<Client>, content: String) -> Option<String> {
    let timestamp = chrono::Utc::now().timestamp_millis();
    let id = generate_id();

    let collection: Collection<Haste> = client.database("haste").collection("hastes");

    let new_haste = Haste {
        _id: id.to_owned(),
        content: content,
        timestamp: timestamp
    };

    let result = collection.insert_one(new_haste, None).await;

    return if result.is_ok()
        { Some(id) } else { None };
}
