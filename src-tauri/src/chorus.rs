use serde::{Deserialize, Serialize};
use serde_json::Number;

use crate::api;

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
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
    link: Option<String>
}


// #[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
// #[serde(rename_all = "camelCase")]
// pub struct Song {
//     id: i64,
//     name: String,
//     artist: String,
//     album: String,
//     genre: String,
//     year: String,
//     charter: String,
//     length: i64
// }

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Roles {
    parallaxdg: String,
    rek3dge: String,
    sygenysis: String,
    neversoft: String,
    smoochums: String,
    acjgaming89: String,
    zantor: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RandomSongsResponse {
    pub songs: Vec<Song>,
    // #[serde(skip_serializing)]
    // pub roles: String,
}

pub async fn get_random_songs() -> Result<RandomSongsResponse, ()> {
    let url = "https://chorus.fightthe.pw/api/random";
    // let url = "https://gist.githubusercontent.com/andrew-brainerd/3dfff32d608bec81685d04b6f662d609/raw/394410368dd2458ee7a552530c9025db2f328cb8/song.json";
    api::get_request(url).await
}
