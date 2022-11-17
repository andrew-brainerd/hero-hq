use rodio::{
    source::Source,
    Decoder, OutputStream, Sink,
};
use std::fs::File;
use std::io::BufReader;
use std::time::Duration;

pub fn play_song(directory: &str, duration: u64) {
    let (_stream, stream_handle) = OutputStream::try_default().unwrap();
    let song_path = format!("{}/song.ogg", directory);
    let file = BufReader::new(File::open(song_path).unwrap());
    let source = Decoder::new(file).unwrap();
    
    stream_handle.play_raw(source.convert_samples()).unwrap();
    std::thread::sleep(Duration::from_secs(duration));
}

pub fn play_song_sink(source: Decoder<BufReader<File>>) {
    let (_stream, stream_handle) = OutputStream::try_default().unwrap();
    let sink = Sink::try_new(&stream_handle).unwrap();

    sink.append(source);
    sink.sleep_until_end();
}

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

