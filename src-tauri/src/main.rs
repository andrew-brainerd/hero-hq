#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

pub mod aws;

use std::fs;
use dotenv::dotenv;
use std::env;

#[tauri::command]
fn open_songs_dir(directory: &str) -> Vec<String> {
    let paths = fs::read_dir(directory).unwrap();
    let mut song_list: Vec<String> = Vec::new();

    for path in paths {
        let name = path.unwrap().path().display().to_string();
        song_list.push(name);
    }

    song_list
}

#[tauri::command]
async fn get_aws_bucket() -> String {
    let bucket = aws::get_bucket().await;

    bucket.unwrap().to_string()
}

fn main() {
    dotenv().ok();
    env_logger::init();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_songs_dir, get_aws_bucket])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
