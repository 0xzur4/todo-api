
use rocket::{delete, get, post, put, State};
use mongodb::{bson::doc, Database};
use rocket::serde::{Deserialize, Serialize, json::Json};
use futures::stream::StreamExt;
use std::sync::Arc;


#[derive(Deserialize, Serialize, Debug)]
pub struct Todo {
    pub title: String,
    pub text: String,
}

// add data ke database
#[post("/todo/add", data = "<todo>")]
pub async fn add_todo(db: &State<Arc<Database>>, todo: Json<Todo>) -> Json<String> {
    let collect = db.collection::<Todo>("todo");

    let new_todo = Todo {
        title: todo.title.clone(),
        text: todo.text.clone()
    };

    match collect.insert_one(new_todo).await {
        Ok(_) => Json("List added".to_string()),
        Err(_) => Json("Error added".to_string())
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
#[put("/todo/update/<title>", data= "<todo>")]
pub async fn edit_data(db: &State<Arc<Database>>, todo: Json<Todo>, title: String) -> Result<Json<Todo>, Json<String>>{
    let collect = db.collection::<Todo>("todo");

    let filter = doc! {"title": title};
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
                    title: todo.title.clone(),
                    text: todo.text.clone()
                }))
            }else {
                Err(Json("Not found".to_string()))
            }
        }
        Err(_) => Err(Json("Faildet to update data".to_string())),
    }
}

// delete data
#[delete("/todo/delete/<title>")]
pub async fn delete_data(db: &State<Arc<Database>>, title: String) -> Result<Json<String>, Json<String>> {
    let collect = db.collection::<Todo>("todo");
    let filter = doc! {"title": title};

    match collect.delete_one(filter).await {
        Ok(del_result) => {
            if del_result.deleted_count == 1 {
                Ok(Json("Data deleted".to_string()))
            } else {
                Err(Json("Not found".to_string()))
            }
        }
        Err(err) => Err(Json(err.to_string())),
    }
}


