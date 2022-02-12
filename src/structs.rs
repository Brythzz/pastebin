use serde::{Deserialize, Serialize};

// Received on login
#[derive(Deserialize)]
pub struct User {
    pub username: String,
    pub password: String
}

// Received from user on creation
#[derive(Deserialize)]
pub struct NewHaste {
    pub content: String
}

// Returned after haste is created
#[derive(Serialize)]
pub struct CreatedHaste {
    pub id: String
}

// Returned on request
#[derive(Deserialize, Serialize)]
pub struct Haste {
    pub _id: String,
    pub content: String,
    pub timestamp: i64
}
