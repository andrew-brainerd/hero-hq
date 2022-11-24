use serde::Deserialize;
use std::fs::{create_dir, File};
use std::io::{BufWriter, Write};

pub async fn download_file(
    url: &str,
    directory: &str,
    filename: &str,
) -> Result<String, reqwest::Error> {
    let response = reqwest::get(url).await?;

    let file_content = response.bytes().await?;

    let file_path = format!("{directory}\\{filename}");

    let _ = create_dir(directory);
    let file = File::create(&file_path).unwrap();

    let mut buf_writer = BufWriter::new(file);
    let _ = buf_writer.write(&file_content);
    let _ = buf_writer.flush();

    Ok(filename.to_owned())
}

pub async fn get_json_request<T: for<'de> Deserialize<'de>>(request_url: &str) -> Result<T, ()> {
    println!("GET {}", request_url);
    let response = reqwest::get(request_url)
        .await
        .unwrap()
        .json::<T>()
        .await
        .unwrap();

    Ok(response)
}
