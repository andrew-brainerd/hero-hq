use aws_config::meta::region::RegionProviderChain;
use aws_sdk_s3::{types::ByteStream, Client, Error};
use ini::Ini;
use std::io::{BufWriter, Write};
use std::{fs::File, path::Path};
use tauri::api::path::home_dir;
use tokio_stream::StreamExt;
use crate::logging::write_to_log;

async fn create_client() -> Client {
    let region_provider = RegionProviderChain::default_provider().or_else("us-east-1");
    let config = aws_config::from_env().region(region_provider).load().await;
    let client = Client::new(&config);

    client
}

pub async fn download_object(directory: &str, key: &str) -> Result<String, std::io::Error> {
    let client: Client = create_client().await;
    let bucket = get_bucket().await.unwrap();
    let resp = client
        .get_object()
        .bucket(bucket)
        .key(key)
        .send()
        .await;

    let file_path = format!("{directory}/{key}");
    let mut data: ByteStream = resp.unwrap().body;
    let file = File::create(&file_path)?;
    let mut buf_writer = BufWriter::new(file);
    while let Some(bytes) = data.try_next().await? {
        buf_writer.write(&bytes)?;
    }
    buf_writer.flush()?;

    write_to_log(format!("Downloaded file \"{key}\" to {directory}"));

    Ok(file_path.to_owned())
}

pub async fn get_bucket() -> Result<String, Error> {
    let user_dir = home_dir().unwrap().display().to_string();
    let aws_creds_path = Path::new(&user_dir).join(".aws").join("credentials");
    let conf = Ini::load_from_file(aws_creds_path).unwrap();
    let section = conf.section(Some("hero-hq")).unwrap();
    let hq_bucket = section.get("bucket").unwrap().to_owned();

    Ok(hq_bucket)
}

pub async fn get_bucket_songs() -> Result<Vec<String>, Error> {
    let client: Client = create_client().await;
    let bucket = get_bucket().await.unwrap();
    let objects = client.list_objects_v2().bucket(bucket).send().await?;

    let mut song_list: Vec<String> = Vec::new();

    for obj in objects.contents().unwrap_or_default() {
        let key = obj.key().unwrap().to_owned();

        if !key.contains("artwork/") {
            song_list.push(key);
        }
    }

    Ok(song_list)
}

pub async fn upload_object(filename: &str, key: &str) -> Result<String, Error> {
    let client: Client = create_client().await;
    let bucket = get_bucket().await.unwrap();
    let body = ByteStream::from_path(Path::new(filename)).await;
    client
        .put_object()
        .bucket(bucket)
        .key(key)
        .body(body.unwrap())
        .send()
        .await?;

    write_to_log(format!("Uploaded file: \"{filename}\""));

    Ok(filename.to_owned())
}
