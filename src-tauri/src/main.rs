#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod api;
mod aws;
mod chorus;
mod compress;
mod hero;
mod logging;

use chorus::SongsResponse;
use dotenv::dotenv;
use hero::LocalSong;
use std::fs::remove_file;
use tauri_plugin_store::PluginBuilder;

#[tauri::command]
async fn get_all_songs(directory: &str) -> Result<(Vec<LocalSong>, Vec<String>), ()> {
    let local_songs = hero::get_local_songs(directory).await.unwrap();
    let uploaded_songs = hero::get_uploaded_songs().await.unwrap();

    Ok((local_songs, uploaded_songs))
}

#[tauri::command]
async fn upload_song(directory: &str, output_file: &str, key: &str) -> Result<String, ()> {
    let zip_path = hero::zip_song(directory, output_file);
    logging::write_to_log(format!("Zipped Song: {zip_path}"));

    let uploaded_song = hero::upload_zip_to_s3(output_file, key).await;
    logging::write_to_log(format!("Uploaded Song: {uploaded_song}"));

    remove_file(&zip_path).unwrap();
    logging::write_to_log(format!("Removed zip file {zip_path}"));

    Ok(key.to_owned())
}

#[tauri::command]
async fn download_song(directory: &str, key: &str) -> Result<String, ()> {
    let zip_path = hero::download_zip_from_s3(directory, key).await;

    remove_file(&zip_path).unwrap();

    Ok(key.to_owned())
}

#[tauri::command]
async fn get_random_songs() -> Result<SongsResponse, ()> {
    chorus::get_random_songs().await
}

#[tauri::command]
async fn search_chorus_songs(query: &str) -> Result<SongsResponse, ()> {
    chorus::search_songs(query).await
}

#[tauri::command]
async fn download_chorus_file(url: &str, directory: &str, filename: &str, archived: bool) -> Result<String, ()> {
    chorus::download_song_file(url, directory, filename, archived).await
}

#[tauri::command]
async fn cleanup_archive_files(directory: &str) -> Result<String, ()> {
    chorus::cleanup_archive_files(directory).await
}

#[tauri::command]
async fn write_to_log(message: &str) -> Result<String, ()> {
    logging::write_to_log(message.to_string());

    Ok("Wrote message to log".to_owned())
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
            download_song,
            get_random_songs,
            search_chorus_songs,
            download_chorus_file,
            cleanup_archive_files,
            write_to_log
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
