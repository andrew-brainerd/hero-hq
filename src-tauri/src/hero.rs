use ini::Ini;
use ini::Properties;
use serde::{Serialize, Deserialize};
use std::fs;
use std::path::Path;

use crate::aws;
use crate::compress;
use crate::logging;
use crate::logging::write_to_log;

#[derive(Default, Clone, PartialEq, Serialize, Deserialize)]
pub struct LocalSong {
    directory: String,
    track: String,
    artist: String,
    album: String,
    genre: String,
    year: String,
    charter: String
}

pub async fn get_local_songs(directory: &str) -> Result<Vec<LocalSong>, ()> {
    let paths = fs::read_dir(directory).unwrap();
    let mut song_list: Vec<LocalSong> = Vec::new();

    for path in paths {
        let name = path.unwrap().path().display().to_string();
        let local_song_data = parse_ini(&name);

        match local_song_data {
            Ok(optional_song) => {
                match optional_song {
                    Some(song_data) => song_list.push(song_data),
                    None => write_to_log(format!("Invalid song"))
                }
            },
            Err(err) => write_to_log(format!("Error parsing song"))
        }
    }

    Ok(song_list)
}

fn get_section_value(section: &Properties, key: &str) -> Result<String, ()> {
    let value = section.get(key);
    
    match value {
        Some(val) => Ok(val.to_owned()),
        None => Ok("".to_owned())
    }
}

fn get_song_data(directory: &str, song_section: &Properties) -> LocalSong {
    let song_name = get_section_value(song_section, "name").unwrap();
    let song_artist = get_section_value(song_section, "artist").unwrap();
    let song_album = get_section_value(song_section, "album").unwrap();
    let song_genre = get_section_value(song_section, "genre").unwrap();
    let song_year = get_section_value(song_section, "year").unwrap();
    let song_charter = get_section_value(song_section, "charter").unwrap();

    write_to_log(format!("{} - {}", song_artist, song_name));

    LocalSong {
        directory: directory.to_owned(),
        track: song_name,
        artist: song_artist,
        album: song_album,
        genre: song_genre,
        year: song_year,
        charter: song_charter,
    }
}

pub fn parse_ini(directory: &str) -> Result<Option<LocalSong>, ()> {
    let ini_path = format!("{directory}\\song.ini");

    if Path::new(&ini_path).exists() {
        let conf = Ini::load_from_file(ini_path);

        match conf {
            Ok(ini_file) => {
                let mut section = ini_file.section(Some("song"));

                match section {
                    Some(section) => Ok(Some(get_song_data(directory, section))),
                    None => {
                        section = ini_file.section(Some("Song"));

                        match section {
                            Some(section) => Ok(Some(get_song_data(directory, section))),
                            None => Err(write_to_log("Unable to find song definition".to_string())),
                        }
                    }
                }
            }
            Err(err) => Err(write_to_log(err.to_string())),
        }
    } else {
        Ok(None)
    }
}

pub async fn download_zip_from_s3(directory: &str, key: &str) -> String {
    logging::write_to_log(format!("Downloading zip from S3: {key}"));

    let zip_path = aws::download_object(directory, key).await.unwrap();
    let output_directory = format!("{}\\{}", directory, key.replace(".zip", ""));
    let song_downloaded = compress::upzip_file(&zip_path, &output_directory);

    song_downloaded.unwrap().to_owned()
}

pub async fn get_uploaded_songs() -> Result<Vec<String>, ()> {
    let bucket_objects = aws::get_bucket_objects().await;
    let songs = bucket_objects.unwrap();

    Ok(songs)
}

pub async fn upload_zip_to_s3(filename: &str, key: &str) -> String {
    logging::write_to_log(format!("Uploading zip to S3: {}", key));
    let _uploaded = aws::upload_object(filename, key).await.unwrap();

    key.to_owned()
}

pub fn zip_song(directory: &str, filename: &str) -> String {
    let zip_file = compress::create_zip_file(directory, filename);

    zip_file.unwrap().to_string()
}
