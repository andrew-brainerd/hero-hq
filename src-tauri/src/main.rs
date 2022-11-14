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
fn get_local_songs(directory: &str) -> Vec<String> {
    let paths = fs::read_dir(directory).unwrap();
    let mut song_list: Vec<String> = Vec::new();

    for path in paths {
        let name = path.unwrap().path().display().to_string();
        song_list.push(name);
    }

    song_list
}

#[tauri::command]
async fn upload_song(directory: &str, filename: &str, key: &str) -> Result<(), ()> {
    zip_song(directory, filename);
    upload_zip_to_s3(filename, key).await;

    Ok(())
}

async fn upload_zip_to_s3(filename: &str, key: &str) -> String {
    info!("Uploading zip to S3: {}", key);
    aws::upload_object(filename, key).await;

    "Zip file uploaded".to_owned()
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
            get_local_songs,
            upload_song
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
