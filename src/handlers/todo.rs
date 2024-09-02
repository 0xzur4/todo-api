
use rocket::{delete, get, post, put, State};
use mongodb::{bson::{doc, oid::ObjectId}, Database};
use rocket::serde::{Deserialize, Serialize, json::Json};
use futures::stream::StreamExt;
use std::sync::Arc;


#[derive(Deserialize, Serialize, Debug)]
pub struct Todo {
    pub id: Option<String>,
    pub title: String,
    pub text: String,
}

// add data ke database
#[post("/todo/add", data = "<todo>")]
pub async fn add_todo(db: &State<Arc<Database>>, todo: Json<Todo>) -> String {
    let collect = db.collection::<Todo>("todo");

    let new_todo = Todo {
        id: todo.id.clone(),
        title: todo.title.clone(),
        text: todo.text.clone()
    };

    match collect.insert_one(new_todo).await {
        Ok(_) => "List added".to_string(),
        Err(_) => "Error added".to_string()
    }
}

// menampilkan data
#[get("/todo")]
pub async fn get_todo(db: &State<Arc<Database>>) -> Json<Vec<Todo>> {
    let read_data = db.collection::<Todo>("todo");
    let filter = doc! {};

    match read_data.find(filter).await {
        Ok(mut cursor) => {
            let mut datas = Vec::new();
            while let Some(dataset) = cursor.next().await {
                if let Ok(dataset) = dataset {
                    datas.push(dataset);
                }
            }
            Json(datas)
        }
        Err(_) => Json(vec![]),
    }


}

// Edit data
#[put("/todo/update", data= "<todo>")]
pub async fn edit_data(db: &State<Arc<Database>>, todo: Json<Todo>) -> Result<Json<Todo>, String>{
    let collect = db.collection::<Todo>("todo");
    let id = match &todo.id {
        Some(id) => id,
        None => return Err("Id is required".to_string()),
    };

    let object_id = match ObjectId::parse_str(id){
        Ok(oid) => oid,
        Err(_) => return Err("Error id format".to_string()),
    };
    let filter = doc! {"_id": object_id};
    let edit_data = doc! {
        "$set" : {
            "title" : &todo.title,
            "text" : &todo.text
        }
    };

    match collect.update_one(filter, edit_data).await {
        Ok(edit_result) => {
            if edit_result.matched_count == 1 {
                Ok(Json(Todo {
                    id: todo.id.clone(),
                    title: todo.title.clone(),
                    text: todo.text.clone()
                }))
            }else {
                Err("not found".to_string())
            }
        }
        Err(_) => Err("Faildet to update data".to_string()),
    }
}

// delete data
#[delete("/todo/delete", data = "<todo>")]
pub async fn delete_data(db: &State<Arc<Database>>, todo: Json<Todo>) -> Result<String, String> {
    let collect = db.collection::<Todo>("todo");

    let id = match &todo.id {
        Some(id) => id,
        None => return Err("Id is required".to_string()),
    };

    let object_id = match ObjectId::parse_str(id) {
        Ok(oid) => oid,
        Err(_) => return Err("Error id format".to_string()),
    };
    let filter = doc! {"_id": object_id};

    match collect.delete_one(filter).await {
        Ok(del_result) => {
            if del_result.deleted_count == 1 {
                Ok("Data succes deleted".to_string())
            }else {
                Err("not found".to_string())
            }
        }
        Err(_) => Err("Faildet to deleted data".to_string()),
    }
}
