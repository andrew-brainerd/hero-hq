#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::fs;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn open_songs_dir(directory: &str) -> Vec<String> {
    let paths = fs::read_dir(directory).unwrap();
    let mut song_list: Vec<String> = Vec::new();

    for path in paths {
        let name = path.unwrap().path().display().to_string();
        println!("Name: {}", name);
        song_list.push(name);
    }

    song_list
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, open_songs_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
