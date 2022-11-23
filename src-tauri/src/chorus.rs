use display_json::{DisplayAsJsonPretty, DebugAsJsonPretty};
use serde::{Deserialize, Serialize};
use serde_json::Number;
use std::collections::HashMap;

use crate::{api, logging::write_to_log, compress};

#[derive(Default, Clone, PartialEq, Serialize, Deserialize, DisplayAsJsonPretty, DebugAsJsonPretty)]
#[serde(rename_all = "camelCase")]
pub struct Song {
    id: i64,
    #[serde(skip_serializing_if = "Option::is_none")]
    name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    artist: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    album: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    genre: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    year: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    charter: Option<String>,
    length: i64,
    #[serde(skip_serializing_if = "Option::is_none")]
    effective_length: Option<Number>,
    #[serde(skip_serializing_if = "Option::is_none")]
    tier_band: Option<Number>,
    tier_guitar: Option<Number>,
    tier_bass: Option<Number>,
    tier_rhythm: Option<Number>,
    tier_drums: Option<Number>,
    tier_vocals: Option<Number>,
    tier_keys: Option<Number>,
    tier_guitarghl: Option<Number>,
    tier_bassghl: Option<Number>,
    diff_guitar: Option<Number>,
    diff_bass: Option<Number>,
    diff_rhythm: Option<Number>,
    diff_drums: Option<Number>,
    diff_keys: Option<Number>,
    diff_guitarghl: Option<Number>,
    diff_bassghl: Option<Number>,
    is_pack: bool,
    has_forced: bool,
    has_tap: bool,
    has_sections: bool,
    has_star_power: bool,
    has_solo_sections: bool,
    is_120: bool,
    has_stems: bool,
    has_video: bool,
    has_lyrics: bool,
    has_no_audio: bool,
    needs_renaming: bool,
    is_folder: bool,
    has_broken_notes: bool,
    has_background: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    last_modified: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    uploaded_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    link: Option<String>,
    direct_links: HashMap<String, String>
}

#[derive(Default, Clone, PartialEq, Serialize, Deserialize, DisplayAsJsonPretty, DebugAsJsonPretty)]
#[serde(rename_all = "camelCase")]
pub struct SongsResponse {
    pub songs: Vec<Song>
}

pub async fn get_random_songs() -> Result<SongsResponse, ()> {
    let url = "https://chorus.fightthe.pw/api/random";

    api::get_json_request(url).await
}

pub async fn search_songs(query: &str) -> Result<SongsResponse, ()> {
    let url = format!("https://chorus.fightthe.pw/api/search?query={query}");
    let search_results = api::get_json_request::<SongsResponse>(&url).await;

    search_results
}

pub async fn download_song_file(url: &str, directory: &str, filename: &str, archived: bool) -> Result<String, ()> {
    let downloaded_file = api::download_file(url, directory, filename).await;

    match downloaded_file {
        Ok(file_path) => {
            if archived {
                write_to_log(format!("Need to decompress {file_path} to {directory}"));
                // compress::get_file_list(&file_path, directory);
                let archive_info = compress::unzip_7z_file(&file_path, directory).unwrap();

                return Ok(archive_info)
            }

            Ok(file_path)
        },
        Err(err) => {
            let _ = write_to_log(err.to_string());
            Ok("Download failed. Check the log for more info.".to_owned())
        }
    }
}
