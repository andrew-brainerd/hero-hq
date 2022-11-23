use std::fs::File;
use std::io::prelude::*;
use std::io::{Seek, Write};
use std::iter::Iterator;
use std::path::Path;
use std::process::Command;
use walkdir::{DirEntry, WalkDir};
use zip::result::ZipError;
use zip::write::FileOptions;

use crate::logging::{self, write_to_log};

pub fn create_zip_file(directory: &str, filename: &str) -> Result<String, ZipError> {
    let zip_file = filename.to_string();

    zip_song_directory(directory, filename, zip::CompressionMethod::Bzip2)?;

    Ok(zip_file)
}

pub fn get_file_list(filename: &str, output_directory: &str) -> Result<String, ()> {
    let zip_path = format!("{output_directory}\\{filename}");

    write_to_log(format!("{output_directory}\\{filename}"));

    let command_output = Command::new("7z")
        .arg("l")
        .arg(&zip_path)
        .output()
        .unwrap()
        .stdout;

    let string_output = String::from_utf8(command_output).unwrap().to_string();
    write_to_log(string_output.to_owned());

    Ok(string_output)
}

pub fn unzip_7z_file(filename: &str, output_directory: &str) -> Result<String, ()> {
    logging::write_to_log(format!("Unzipping file: {filename} to {output_directory}"));
    let zip_path = format!("{output_directory}\\{filename}");

    write_to_log(format!("{output_directory}\\{filename}"));

    let command_output = Command::new("7z")
        .arg("x")
        .arg(&zip_path)
        .arg("-aos")
        .current_dir(output_directory)
        .output()
        .unwrap()
        .stdout;

    let string_output = String::from_utf8(command_output).unwrap().to_string();
    write_to_log(string_output.to_owned());

    Ok(string_output)
}

pub fn upzip_file(zip_path: &str, output_directory: &str) -> Result<String, ZipError> {
    logging::write_to_log(format!("Unzipping file: {zip_path} to {output_directory}"));
    let zip_file = File::open(Path::new(&zip_path)).unwrap();

    let mut archive = zip::ZipArchive::new(zip_file).unwrap();

    archive.extract(output_directory).unwrap();

    Ok(zip_path.to_owned())
}

fn zip_dir<T>(
    it: &mut dyn Iterator<Item = DirEntry>,
    prefix: &str,
    writer: T,
    method: zip::CompressionMethod,
) -> zip::result::ZipResult<()>
where
    T: Write + Seek,
{
    let mut zip = zip::ZipWriter::new(writer);
    let options = FileOptions::default()
        .compression_method(method)
        .unix_permissions(0o755);

    let mut buffer = Vec::new();
    for entry in it {
        let path = entry.path();
        let name = path.strip_prefix(Path::new(prefix)).unwrap();

        if path.is_file() {
            #[allow(deprecated)]
            zip.start_file_from_path(name, options)?;
            let mut f = File::open(path)?;

            f.read_to_end(&mut buffer)?;
            zip.write_all(&*buffer)?;
            buffer.clear();
        } else if !name.as_os_str().is_empty() {
            #[allow(deprecated)]
            zip.add_directory_from_path(name, options)?;
        }
    }
    zip.finish()?;
    Result::Ok(())
}

pub fn zip_song_directory(
    src_dir: &str,
    dst_file: &str,
    method: zip::CompressionMethod,
) -> zip::result::ZipResult<()> {
    if !Path::new(src_dir).is_dir() {
        return Err(ZipError::FileNotFound);
    }

    let path = Path::new(dst_file);
    let file = File::create(&path).unwrap();

    let walkdir = WalkDir::new(src_dir);
    let it = walkdir.into_iter();

    zip_dir(&mut it.filter_map(|e| e.ok()), src_dir, file, method)?;

    Ok(())
}
