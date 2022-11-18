use std::fs;
use log::info;
use crate::aws;
use crate::compress;

pub async fn get_local_songs(directory: &str) -> Result<Vec<String>, ()> {
  let paths = fs::read_dir(directory).unwrap();
  let mut song_list: Vec<String> = Vec::new();

  for path in paths {
      let name = path.unwrap().path().display().to_string();
      song_list.push(name);
  }

  Ok(song_list)
}

pub async fn download_zip_from_s3(key: &str) -> String {
  info!("Downloading zip from S3 {}", key);
  
  aws::download_object(key).await.unwrap()
}

pub async fn get_uploaded_songs() -> Result<Vec<String>, ()> {
  let bucket_objects = aws::get_bucket_objects().await;
  let songs = bucket_objects.unwrap();

  Ok(songs)
}

pub async fn upload_zip_to_s3(filename: &str, key: &str) -> String {
  info!("Uploading zip to S3: {}", key);
  let _uploaded = aws::upload_object(filename, key).await.unwrap();

  key.to_owned()
}

pub fn zip_song(directory: &str, filename: &str) -> String {
  let zip_file = compress::create_zip_file(directory, filename);

  zip_file.unwrap().to_string()
}
