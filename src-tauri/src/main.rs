#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod audio;
mod aws;
mod compress;
mod hero;

use dotenv::dotenv;
use log::info;
use std::{env, fs::remove_file};
use tauri_plugin_store::PluginBuilder;

#[tauri::command]
async fn get_all_songs(directory: &str) -> Result<(Vec<String>, Vec<String>), ()> {
    let local_songs = hero::get_local_songs(directory).await.unwrap();
    let uploaded_songs = hero::get_uploaded_songs().await.unwrap();

    Ok((local_songs, uploaded_songs))
}

#[tauri::command]
async fn upload_song(directory: &str, output_file: &str, key: &str) -> Result<String, ()> {
    let zip_path = hero::zip_song(directory, output_file);
    info!("Zipped Song: {zip_path}");

    let uploaded_song = hero::upload_zip_to_s3(output_file, key).await;
    info!("Uploaded Song: {uploaded_song}");

    remove_file(&zip_path).unwrap();

    audio::upload_complete();

    Ok(key.to_owned())
}

#[tauri::command]
async fn download_song(directory: &str, key: &str) -> Result<String, ()> {
    let zip_path = hero::download_zip_from_s3(directory, key).await;

    remove_file(&zip_path).unwrap();

    Ok(zip_path.to_owned())
}

fn main() {
    dotenv().ok();
    env_logger::init();
    tauri::Builder::default()
        .plugin(PluginBuilder::default().build())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            get_all_songs,
            upload_song,
            download_song
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
