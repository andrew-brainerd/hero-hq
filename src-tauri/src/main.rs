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
use zip::result::ZipError;

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
async fn get_aws_bucket() -> String {
    let bucket = aws::get_bucket().await;

    bucket.unwrap().to_string()
}

#[tauri::command]
fn zip_song(directory: &str, filename: &str) -> String {
    info!("TIME TO ZIP A SONG: {}", directory);
    let zip_file = create_zip_file(directory, filename);

    zip_file.unwrap().to_string()
}

fn create_zip_file(directory: &str, filename: &str) -> Result<String, ZipError> {
    let zip_file = filename.to_string();

    compress::zip_song_directory(directory, filename, zip::CompressionMethod::Bzip2)?;

    Ok(zip_file)
}

fn main() {
    dotenv().ok();
    env_logger::init();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_local_songs,
            get_aws_bucket,
            zip_song
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
