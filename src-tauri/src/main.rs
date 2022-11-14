#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

pub mod aws;
pub mod compress;

use dotenv::dotenv;
use log::info;
use std::env;
use std::fs;

#[tauri::command]
async fn get_all_songs(directory: &str) -> Result<(Vec<String>, Vec<String>), ()> {
    let local_songs = get_local_songs(directory).await.unwrap();
    let uploaded_songs = get_uploaded_songs().await.unwrap();

    Ok((local_songs, uploaded_songs))
}

async fn get_local_songs(directory: &str) -> Result<Vec<String>, ()> {
    let paths = fs::read_dir(directory).unwrap();
    let mut song_list: Vec<String> = Vec::new();

    for path in paths {
        let name = path.unwrap().path().display().to_string();
        song_list.push(name);
    }

    Ok(song_list)
}

async fn get_uploaded_songs() -> Result<Vec<String>, ()> {
    let bucket_objects = aws::get_bucket_objects().await;
    let songs = bucket_objects.unwrap();

    Ok(songs)
}

#[tauri::command]
async fn upload_song(directory: &str, filename: &str, key: &str) -> Result<(), ()> {
    zip_song(directory, filename);
    upload_zip_to_s3(filename, key).await;

    Ok(())
}

async fn upload_zip_to_s3(filename: &str, key: &str) -> String {
    info!("Uploading zip to S3: {}", key);
    let uploaded = aws::upload_object(filename, key).await.unwrap();

    uploaded
}

fn zip_song(directory: &str, filename: &str) -> String {
    let zip_file = compress::create_zip_file(directory, filename);

    zip_file.unwrap().to_string()
}

fn main() {
    dotenv().ok();
    env_logger::init();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_all_songs,
            upload_song
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
