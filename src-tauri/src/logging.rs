use log::info;
use std::fs::{OpenOptions, File};
use std::io::prelude::*;
use std::path::Path;
use std::time::{SystemTime, UNIX_EPOCH};

pub fn write_to_log(message: String) {
    let timestamp = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs().to_string();
    let log_message = format!("[{timestamp}] {message}");

    info!("{log_message}");

    let log_path = "C:\\temp\\hero-hq.log";

    if Path::new(log_path).exists() {
        let mut file = OpenOptions::new()
            .write(true)
            .append(true)
            .open(log_path)
            .unwrap();

        if let Err(e) = writeln!(file, "{log_message}") {
            eprintln!("Couldn't write to file: {}", e);
        }
    } else {
        File::create(log_path).unwrap();
    }
}
