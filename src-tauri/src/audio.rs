use rodio::{Decoder, OutputStream, Sink, Source};
use std::fs::File;
use std::io::{BufReader, Cursor};

pub fn play_sound(sound_path: &str, volume: f32) {
    let (_stream, stream_handle) = OutputStream::try_default().unwrap();
    let file = BufReader::new(File::open(sound_path).unwrap());
    let source = Decoder::new(file).unwrap();
    let sink = Sink::try_new(&stream_handle).unwrap();

    sink.set_volume(volume);
    sink.append(source);
    sink.sleep_until_end();
}

pub fn upload_complete() {
    play_sound("audio/upload-complete.mp3", 0.3);
}

pub async fn play_remote_song() {
    let resp = reqwest::get("http://websrvr90va.audiovideoweb.com/va90web25003/companions/Foundations%20of%20Rock/13.01.mp3").await.unwrap();
    let cursor = Cursor::new(resp.bytes().await.unwrap());
    let source = rodio::Decoder::new(cursor).unwrap();
    let (_stream, stream_handle) = OutputStream::try_default().unwrap();
    stream_handle.play_raw(source.convert_samples()).unwrap();
    loop {}
}
